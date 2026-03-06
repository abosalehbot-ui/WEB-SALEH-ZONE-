import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { WalletTransaction } from "../models/WalletTransaction";
import { reservePIN } from "../services/pinVaultService";

interface CheckoutItemInput {
  productId: string;
  merchantId: string;
  quantity: number;
}

interface ValidatedCheckoutItem {
  productId: string;
  merchantId: string;
  quantity: number;
  productType: "PIN_BASED" | "DIRECT_TOPUP";
  price: number;
  subtotal: number;
}

interface DeliveredPIN {
  productId: string;
  pinCode: string;
}

export const checkoutCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.id) {
    return next(new AppError("Unauthorized", 401));
  }

  const { items } = req.body as { items?: CheckoutItemInput[] };

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError("items array is required", 400));
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(req.user.id).session(session);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const validatedItems: ValidatedCheckoutItem[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const { productId, merchantId, quantity } = item;

      if (!productId || !merchantId || !Number.isInteger(quantity) || quantity <= 0) {
        throw new AppError("Invalid checkout item payload", 400);
      }

      const product = await Product.findById(productId).session(session);

      if (!product || !product.isActive) {
        throw new AppError("Product not found or inactive", 400);
      }

      const matchedOffer = product.offers.find(
        (offer) => offer.merchant.toString() === merchantId && offer.isActive
      );

      if (!matchedOffer) {
        throw new AppError("Selected merchant offer is not available", 400);
      }

      const subtotal = matchedOffer.price * quantity;
      totalAmount += subtotal;

      validatedItems.push({
        productId,
        merchantId,
        quantity,
        productType: product.productType,
        price: matchedOffer.price,
        subtotal
      });
    }

    if (user.walletBalance < totalAmount) {
      throw new AppError("Insufficient funds", 400);
    }

    user.walletBalance -= totalAmount;
    await user.save({ session });

    const orderId = `ORD-${Date.now()}`;

    const [createdOrder] = await Order.create(
      [
        {
          orderId,
          customer: user._id,
          items: validatedItems.map((item) => ({
            product: item.productId,
            merchant: item.merchantId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
          })),
          totalAmount,
          paymentMethod: "Wallet",
          paymentStatus: "Paid",
          fulfillmentStatus: "Pending"
        }
      ],
      { session }
    );

    await WalletTransaction.create(
      [
        {
          user: user._id,
          type: "Debit",
          amount: totalAmount,
          referenceId: orderId,
          description: `Checkout payment for ${orderId}`
        }
      ],
      { session }
    );

    const deliveredPINs: DeliveredPIN[] = [];

    for (const item of validatedItems) {
      if (item.productType !== "PIN_BASED") {
        continue;
      }

      for (let index = 0; index < item.quantity; index += 1) {
        const reservedPIN = await reservePIN(item.productId, createdOrder._id.toString(), session);
        deliveredPINs.push({
          productId: item.productId,
          pinCode: reservedPIN.pinCode
        });
      }
    }

    const allItemsPinBased = validatedItems.every((item) => item.productType === "PIN_BASED");

    if (allItemsPinBased) {
      createdOrder.fulfillmentStatus = "Completed";
      await createdOrder.save({ session });
    }

    await session.commitTransaction();

    res.status(201).json({
      order: createdOrder,
      deliveredPINs
    });
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof AppError) {
      return next(error);
    }

    const message = error instanceof Error ? error.message : "Checkout failed";
    return next(new AppError(message, 500));
  } finally {
    await session.endSession();
  }
};
