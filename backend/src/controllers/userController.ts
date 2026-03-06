import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { Order } from "../models/Order";
import { PINVault } from "../models/PIN_Vault";
import { User } from "../models/User";

export const getProfileSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));

    const [user, orders] = await Promise.all([
      User.findById(req.user.id).select("fullName username email role walletBalance"),
      Order.find({ customer: req.user.id }).populate("items.product", "name").sort({ createdAt: -1 }).limit(20)
    ]);

    if (!user) return next(new AppError("User not found", 404));

    const orderIds = orders.map((order: any) => order._id);
    const pins = await PINVault.find({ orderRef: { $in: orderIds }, status: "Sold" })
      .populate("product", "name")
      .sort({ updatedAt: -1 })
      .limit(50);

    res.status(200).json({
      user,
      orders,
      pins
    });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load profile", 500));
  }
};
