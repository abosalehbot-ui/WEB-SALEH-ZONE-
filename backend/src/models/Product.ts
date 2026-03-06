import { HydratedDocument, Schema, Types, model } from "mongoose";

export type ProductType = "PIN_BASED" | "DIRECT_TOPUP";

export interface IProductOffer {
  merchant: Types.ObjectId;
  price: number;
  isActive: boolean;
}

export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  category: Types.ObjectId;
  productType: ProductType;
  basePrice: number;
  offers: IProductOffer[];
  attributes: Map<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ProductDocument = HydratedDocument<IProduct>;

const productOfferSchema = new Schema<IProductOffer>(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    _id: false,
    id: false
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    productType: {
      type: String,
      enum: ["PIN_BASED", "DIRECT_TOPUP"],
      required: true
    },
    basePrice: {
      type: Number,
      default: 0,
      min: 0
    },
    offers: {
      type: [productOfferSchema],
      default: []
    },
    attributes: {
      type: Map,
      of: String,
      default: {}
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

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });

export const Product = model<IProduct>("Product", productSchema);

export type { ProductDocument };
