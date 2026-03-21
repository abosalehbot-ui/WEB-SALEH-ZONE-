import { HydratedDocument, Schema, model } from "mongoose";

export type UserRole = "SuperAdmin" | "Merchant" | "Employee" | "Customer";
export type MerchantTier = "None" | "Silver" | "Gold";

export interface IAuthProviders {
  googleId?: string;
  telegramId?: string;
}

export interface IUser {
  userId: string;
  fullName?: string;
  username?: string;
  email: string;
  password: string;
  role: UserRole;
  walletBalance: number;
  loyaltyPoints: number;
  merchantTier: MerchantTier;
  authProviders: IAuthProviders;
  createdAt: Date;
  updatedAt: Date;
}

type UserDocument = HydratedDocument<IUser>;


const authProvidersSchema = new Schema<IAuthProviders>(
  {
    googleId: {
      type: String,
      trim: true
    },
    telegramId: {
      type: String,
      trim: true
    }
  },
  {
    _id: false,
    id: false
  }
);

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Merchant", "Employee", "Customer"],
      default: "Customer"
    },
    walletBalance: {
      type: Number,
      default: 0
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    merchantTier: {
      type: String,
      enum: ["None", "Silver", "Gold"],
      default: "None"
    },
    authProviders: {
      type: authProvidersSchema,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ userId: 1 }, { unique: true });
userSchema.index({ username: 1 });

export const User = model<IUser>("User", userSchema);

export type { UserDocument };
