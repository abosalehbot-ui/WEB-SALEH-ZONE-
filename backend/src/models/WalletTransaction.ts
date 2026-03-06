import { HydratedDocument, Schema, Types, model } from "mongoose";

export type WalletTransactionType = "Credit" | "Debit";

export interface IWalletTransaction {
  user: Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  referenceId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

type WalletTransactionDocument = HydratedDocument<IWalletTransaction>;

const walletTransactionSchema = new Schema<IWalletTransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    referenceId: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

walletTransactionSchema.index({ user: 1 });
walletTransactionSchema.index({ referenceId: 1 });

export const WalletTransaction = model<IWalletTransaction>("WalletTransaction", walletTransactionSchema);

export type { WalletTransactionDocument };
