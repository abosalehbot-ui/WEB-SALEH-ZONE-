import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

export const getMerchantOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));

    const merchantId = req.user.id;

    const [products, orderMetrics] = await Promise.all([
      Product.countDocuments({ "offers.merchant": merchantId, "offers.isActive": true }),
      Order.aggregate([
        { $unwind: "$items" },
        { $match: { "items.merchant": new mongoose.Types.ObjectId(merchantId) } },
        {
          $group: {
            _id: null,
            unitsSold: { $sum: "$items.quantity" },
            revenue: { $sum: "$items.subtotal" },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$fulfillmentStatus", "Pending"] }, "$items.subtotal", 0]
              }
            }
          }
        }
      ])
    ]);

    const metrics = orderMetrics[0] || { unitsSold: 0, revenue: 0, pending: 0 };

    res.status(200).json({
      myRevenue: metrics.revenue,
      activeOffers: products,
      unitsSold: metrics.unitsSold,
      pendingPayouts: metrics.pending
    });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load merchant overview", 500));
  }
};

export const getMerchantProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));

    const products = await Product.find({ "offers.merchant": req.user.id }).populate("category", "name");

    const normalized = products.map((product: any) => {
      const myOffer = product.offers.find((offer: any) => offer.merchant.toString() === req.user?.id);
      return { product, myOffer };
    });

    res.status(200).json({ items: normalized });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load merchant products", 500));
  }
};
