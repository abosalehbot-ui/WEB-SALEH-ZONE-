import { HydratedDocument, Schema, Types, model } from "mongoose";

export type PINStatus = "Available" | "Sold" | "Expired";

export interface IPINVault {
  product: Types.ObjectId;
  merchant: Types.ObjectId;
  pinCode: string;
  status: PINStatus;
  orderRef?: Types.ObjectId | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type PINVaultDocument = HydratedDocument<IPINVault>;

const oneYearFromNow = (): Date => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

const pinVaultSchema = new Schema<IPINVault>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    pinCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Expired"],
      default: "Available"
    },
    orderRef: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null
    },
    expiresAt: {
      type: Date,
      default: oneYearFromNow
    }
  },
  {
    timestamps: true
  }
);

pinVaultSchema.index({ pinCode: 1 }, { unique: true });
pinVaultSchema.index({ product: 1, status: 1 });

export const PINVault = model<IPINVault>("PIN_Vault", pinVaultSchema);

export type { PINVaultDocument };
