import mongoose, { ClientSession } from "mongoose";

import { AppError } from "../middlewares/errorHandler";
import { User } from "../models/User";
import { WalletTransaction } from "../models/WalletTransaction";

const validateAmount = (amount: number): void => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }
};

const createTransactionRecord = async (
  session: ClientSession,
  userId: string,
  type: "Credit" | "Debit",
  amount: number,
  referenceId: string,
  description: string
): Promise<void> => {
  await WalletTransaction.create(
    [
      {
        user: userId,
        type,
        amount,
        referenceId,
        description
      }
    ],
    { session }
  );
};

export const addFunds = async (
  userId: string,
  amount: number,
  referenceId: string,
  description: string
) => {
  validateAmount(amount);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.walletBalance += amount;
    await user.save({ session });

    await createTransactionRecord(session, userId, "Credit", amount, referenceId, description);

    await session.commitTransaction();

    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const deductFunds = async (
  userId: string,
  amount: number,
  referenceId: string,
  description: string
) => {
  validateAmount(amount);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.walletBalance < amount) {
      throw new AppError("Insufficient funds", 400);
    }

    user.walletBalance -= amount;
    await user.save({ session });

    await createTransactionRecord(session, userId, "Debit", amount, referenceId, description);

    await session.commitTransaction();

    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
