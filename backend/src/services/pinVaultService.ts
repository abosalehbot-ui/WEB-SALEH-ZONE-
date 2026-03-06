import { ClientSession } from "mongoose";

import { AppError } from "../middlewares/errorHandler";
import { IPINVault, PINVault } from "../models/PIN_Vault";

interface BulkAddResult {
  requested: number;
  added: number;
}

const isBulkWriteError = (error: unknown): error is {
  writeErrors?: Array<{ code?: number }>;
  insertedDocs?: unknown[];
  result?: { nInserted?: number };
  code?: number;
} => typeof error === "object" && error !== null;

export const addPINsBulk = async (
  productId: string,
  merchantId: string,
  pins: string[]
): Promise<BulkAddResult> => {
  const preparedPins = pins
    .map((pin) => pin.trim())
    .filter((pin) => pin.length > 0)
    .map((pinCode) => ({
      product: productId,
      merchant: merchantId,
      pinCode,
      status: "Available" as const
    }));

  if (preparedPins.length === 0) {
    return { requested: pins.length, added: 0 };
  }

  try {
    const inserted = await PINVault.insertMany(preparedPins, { ordered: false });
    return {
      requested: pins.length,
      added: inserted.length
    };
  } catch (error) {
    if (isBulkWriteError(error)) {
      const hasOnlyDuplicateErrors =
        Array.isArray(error.writeErrors) &&
        error.writeErrors.length > 0 &&
        error.writeErrors.every((writeError) => writeError.code === 11000);

      if (hasOnlyDuplicateErrors || error.code === 11000) {
        const addedFromInsertedDocs = Array.isArray(error.insertedDocs) ? error.insertedDocs.length : undefined;
        const addedFromResult = error.result?.nInserted;

        return {
          requested: pins.length,
          added: addedFromInsertedDocs ?? addedFromResult ?? 0
        };
      }
    }

    throw error;
  }
};

export const reservePIN = async (
  productId: string,
  orderId: string,
  session?: ClientSession
): Promise<IPINVault> => {
  const reservedPIN = await PINVault.findOneAndUpdate(
    { product: productId, status: "Available", expiresAt: { $gt: new Date() } },
    { $set: { status: "Sold", orderRef: orderId } },
    { new: true, session }
  );

  if (!reservedPIN) {
    throw new AppError("Product out of stock or all PINs expired", 400);
  }

  return reservedPIN;
};
