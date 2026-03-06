import { HydratedDocument, Schema, Types, model } from "mongoose";

export interface IMerchantGroup {
  name: string;
  commissionRate: number;
  owner: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type MerchantGroupDocument = HydratedDocument<IMerchantGroup>;

const merchantGroupSchema = new Schema<IMerchantGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    commissionRate: {
      type: Number,
      default: 0,
      min: 0
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

merchantGroupSchema.index({ owner: 1 });
merchantGroupSchema.index({ name: 1 });

export const MerchantGroup = model<IMerchantGroup>("MerchantGroup", merchantGroupSchema);

export type { MerchantGroupDocument };
