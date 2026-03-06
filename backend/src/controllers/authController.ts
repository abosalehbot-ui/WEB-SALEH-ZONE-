import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";

import { User } from "../models/User";
import { AppError } from "../middlewares/errorHandler";
import { generateToken } from "../utils/jwt";

const AUTH_COOKIE_NAME = "token";

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const sanitizeUser = (user: unknown): Record<string, unknown> => {
  if (!user || typeof user !== "object") {
    return {};
  }

  const safeUser = { ...(user as Record<string, unknown>) };
  delete safeUser.password;
  return safeUser;
};

// TODO: Google Auth / OTP Integration
// - Add Google OAuth callback/token exchange flow.
// - Add email OTP generation, delivery, and verification endpoints.

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

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return next(new AppError("User with this email or username already exists", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      userId: `SZ-${Date.now()}`,
      email,
      password: hashedPassword,
      username,
      fullName
    });

    const token = generateToken(createdUser._id.toString());
    res.cookie(AUTH_COOKIE_NAME, token, buildCookieOptions());

    res.status(201).json({
      message: "Registration successful",
      token,
      user: sanitizeUser(createdUser.toObject())
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return next(new AppError(message, 500));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return next(new AppError("email and password are required", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !user.password) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = generateToken(user._id.toString());
    res.cookie(AUTH_COOKIE_NAME, token, buildCookieOptions());

    res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user.toObject())
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return next(new AppError(message, 500));
  }
};

export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed";
    return next(new AppError(message, 500));
  }
};
