import jwt, { SignOptions } from "jsonwebtoken";

interface IJwtPayload {
  id: string;
}

const getJwtConfig = (): { secret: string; expiresIn: string } => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return { secret, expiresIn };
};

export const generateToken = (userId: string): string => {
  const { secret, expiresIn } = getJwtConfig();
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };

  return jwt.sign({ id: userId }, secret, options);
};

export const verifyToken = (token: string): IJwtPayload => {
  const { secret } = getJwtConfig();
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === "string" || !decoded || typeof decoded !== "object" || !("id" in decoded)) {
    throw new Error("Invalid token payload");
  }

  return { id: String(decoded.id) };
};
