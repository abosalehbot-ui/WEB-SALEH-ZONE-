import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { User } from "../models/User";
import { MailerConfigError, sendPasswordResetEmail } from "../services/mailerService";
import { generateToken } from "../utils/jwt";

const AUTH_COOKIE_NAME = "token";
const DEFAULT_RESET_TOKEN_TTL_MINUTES = 15;
const TELEGRAM_AUTH_MAX_AGE_SECONDS = 24 * 60 * 60;

const googleClient = new OAuth2Client();

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const sanitizeUser = (user: unknown): Record<string, unknown> => {
  if (!user || typeof user !== "object") return {};
  const safeUser = { ...(user as Record<string, unknown>) };
  delete safeUser.password;
  delete safeUser.resetPasswordTokenHash;
  delete safeUser.resetPasswordExpiresAt;
  return safeUser;
};

const hashResetToken = (token: string): string => crypto.createHash("sha256").update(token).digest("hex");

const getResetTokenTtlMinutes = (): number => {
  const parsed = Number.parseInt(process.env.RESET_TOKEN_TTL_MINUTES || "", 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_RESET_TOKEN_TTL_MINUTES;
  }

  return parsed;
};

const issueAuth = (res: Response, user: Record<string, unknown>) => {
  const token = generateToken(String(user._id));
  res.cookie(AUTH_COOKIE_NAME, token, buildCookieOptions());

  return {
    token,
    user: sanitizeUser(user)
  };
};

const generateRandomPasswordHash = async (): Promise<string> => {
  const randomPassword = crypto.randomBytes(24).toString("hex");
  return bcrypt.hash(randomPassword, 12);
};

interface TelegramPayload {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number | string;
  hash?: string;
}

const verifyTelegramPayload = (payload: TelegramPayload): { telegramId: string; fullName?: string; username?: string } => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new AppError("TELEGRAM_BOT_TOKEN is not configured", 503);
  }

  const { hash, ...rest } = payload;
  if (!hash) {
    throw new AppError("Invalid Telegram payload", 400);
  }

  const entries = Object.entries(rest)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => [key, String(value)] as const)
    .sort(([a], [b]) => a.localeCompare(b));

  const dataCheckString = entries.map(([key, value]) => `${key}=${value}`).join("\n");
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const hashBuffer = Buffer.from(hash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (hashBuffer.length !== computedBuffer.length || !crypto.timingSafeEqual(hashBuffer, computedBuffer)) {
    throw new AppError("Invalid Telegram signature", 401);
  }

  const authDate = Number(payload.auth_date);
  if (!authDate || Number.isNaN(authDate)) {
    throw new AppError("Invalid Telegram auth_date", 400);
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (ageSeconds < 0 || ageSeconds > TELEGRAM_AUTH_MAX_AGE_SECONDS) {
    throw new AppError("Telegram auth payload expired", 401);
  }

  const telegramId = String(payload.id || "");
  if (!telegramId) {
    throw new AppError("Telegram id is required", 400);
  }

  const fullName = [payload.first_name, payload.last_name].filter(Boolean).join(" ").trim() || undefined;
  const username = payload.username ? String(payload.username) : undefined;

  return { telegramId, fullName, username };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, username, fullName } = req.body as {
      email?: string;
      password?: string;
      username?: string;
      fullName?: string;
    };

    if (!email || !password || !username || !fullName) {
      return next(new AppError("email, password, username, and fullName are required", 400));
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existingUser) return next(new AppError("User with this email or username already exists", 409));

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      userId: `SZ-${Date.now()}`,
      email: email.toLowerCase(),
      password: hashedPassword,
      username,
      fullName,
      role: "Customer"
    });

    const authPayload = issueAuth(res, createdUser.toObject());
    res.status(201).json({ message: "Registration successful", ...authPayload });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Registration failed", 500));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return next(new AppError("email and password are required", 400));

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !user.password) return next(new AppError("Invalid email or password", 401));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(new AppError("Invalid email or password", 401));

    const authPayload = issueAuth(res, user.toObject());
    res.status(200).json({ message: "Login successful", ...authPayload });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Login failed", 500));
  }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { credential } = req.body as { credential?: string };
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) return next(new AppError("GOOGLE_CLIENT_ID is not configured", 503));
    if (!credential) return next(new AppError("Google credential is required", 400));

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.email_verified) {
      return next(new AppError("Invalid Google identity payload", 401));
    }

    const normalizedEmail = payload.email.toLowerCase();
    let user = await User.findOne({
      $or: [{ "authProviders.googleId": payload.sub }, { email: normalizedEmail }]
    }).select("+password");

    if (!user) {
      user = await User.create({
        userId: `SZ-${Date.now()}`,
        email: normalizedEmail,
        password: await generateRandomPasswordHash(),
        username: payload.email.split("@")[0],
        fullName: payload.name,
        role: "Customer",
        authProviders: {
          googleId: payload.sub
        }
      });
    } else if (user.authProviders?.googleId !== payload.sub) {
      user.authProviders = {
        ...user.authProviders,
        googleId: payload.sub
      };
      await user.save();
    }

    const authPayload = issueAuth(res, user.toObject());
    res.status(200).json({ message: "Google login successful", ...authPayload });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Google login failed", 500));
  }
};

export const telegramAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const telegramData = req.body as TelegramPayload;
    const { telegramId, fullName, username } = verifyTelegramPayload(telegramData);

    let user = await User.findOne({ "authProviders.telegramId": telegramId }).select("+password");

    if (!user) {
      const fallbackEmail = `telegram_${telegramId}@telegram.local`;
      user = await User.findOne({ email: fallbackEmail }).select("+password");
    }

    if (!user) {
      user = await User.create({
        userId: `SZ-${Date.now()}`,
        email: `telegram_${telegramId}@telegram.local`,
        password: await generateRandomPasswordHash(),
        username: username || `tg_${telegramId}`,
        fullName,
        role: "Customer",
        authProviders: {
          telegramId
        }
      });
    } else if (user.authProviders?.telegramId !== telegramId) {
      user.authProviders = {
        ...user.authProviders,
        telegramId
      };

      if (!user.fullName && fullName) {
        user.fullName = fullName;
      }

      if (!user.username && username) {
        user.username = username;
      }

      await user.save();
    }

    const authPayload = issueAuth(res, user.toObject());
    res.status(200).json({ message: "Telegram login successful", ...authPayload });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError(error instanceof Error ? error.message : "Telegram login failed", 500));
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({ user: sanitizeUser(user.toObject()) });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to fetch user profile", 500));
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) return next(new AppError("email is required", 400));

    const user = await User.findOne({ email: email.toLowerCase() }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");
    if (!user) {
      res.status(200).json({ message: "If the account exists, a reset instruction has been sent." });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = hashResetToken(rawToken);
    user.resetPasswordExpiresAt = new Date(Date.now() + getResetTokenTtlMinutes() * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail({
      to: user.email,
      resetToken: rawToken
    });

    const devMode = process.env.NODE_ENV !== "production";
    res.status(200).json({
      message: "If the account exists, a reset instruction has been sent.",
      ...(devMode ? { devResetToken: rawToken } : {})
    });
  } catch (error) {
    if (error instanceof MailerConfigError) {
      return next(new AppError(error.message, 503));
    }

    return next(new AppError(error instanceof Error ? error.message : "Forgot password failed", 500));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, token, newPassword } = req.body as { email?: string; token?: string; newPassword?: string };

    if (!email || !token || !newPassword || newPassword.length < 8) {
      return next(new AppError("email, token and newPassword(min 8 chars) are required", 400));
    }

    const tokenHash = hashResetToken(token);
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() }
    }).select("+password +resetPasswordTokenHash +resetPasswordExpiresAt");

    if (!user) return next(new AppError("Invalid or expired reset token", 400));

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Reset password failed", 500));
  }
};

export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Logout failed", 500));
  }
};
