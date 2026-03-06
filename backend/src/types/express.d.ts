import "express";

import type { MerchantTier, UserRole } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        role: UserRole;
        merchantTier: MerchantTier;
      };
    }
  }
}

export {};
