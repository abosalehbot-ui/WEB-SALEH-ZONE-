import { NextFunction, Request, Response } from "express";

import { AppError } from "./errorHandler";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1] || null;
};

const extractTokenFromCookies = (cookieHeader?: string): string | null => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

  if (!tokenCookie) {
    return null;
  }

  const token = tokenCookie.substring("token=".length);
  return token || null;
};

export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const bearerToken = extractBearerToken(req.headers.authorization);
    const cookieToken = extractTokenFromCookies(req.headers.cookie);
    const token = bearerToken || cookieToken;

    if (!token) {
      return next(new AppError("Unauthorized", 401));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("_id role merchantTier");

    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      merchantTier: user.merchantTier
    };

    return next();
  } catch (_error) {
    return next(new AppError("Unauthorized", 401));
  }
};

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    return next();
  };
