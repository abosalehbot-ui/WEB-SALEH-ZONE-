import { NextFunction, Request, Response } from "express";

import { processPayment } from "../integrations/paymentGateway";
import { AppError } from "../middlewares/errorHandler";
import { User } from "../models/User";
import { WalletTransaction } from "../models/WalletTransaction";
import { addFunds } from "../services/walletService";

export const getWalletInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      return next(new AppError("Unauthorized", 401));
    }

    const user = await User.findById(req.user.id).select("walletBalance");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const recentTransactions = await WalletTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      walletBalance: user.walletBalance,
      transactions: recentTransactions
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch wallet info";
    return next(new AppError(message, 500));
  }
};

export const depositFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      return next(new AppError("Unauthorized", 401));
    }

    const { amount, paymentMethod } = req.body as {
      amount?: number;
      paymentMethod?: string;
    };

    if (!amount || amount <= 0 || !paymentMethod) {
      return next(new AppError("amount and paymentMethod are required", 400));
    }

    const paymentResult = await processPayment(amount, paymentMethod);

    if (!paymentResult.success) {
      return next(new AppError("Payment processing failed", 400));
    }

    const updatedUser = await addFunds(
      req.user.id,
      amount,
      paymentResult.transactionId,
      `Deposit via ${paymentMethod}`
    );

    res.status(200).json({
      message: "Deposit successful",
      walletBalance: updatedUser.walletBalance,
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    const message = error instanceof Error ? error.message : "Failed to deposit funds";
    return next(new AppError(message, 500));
  }
};
