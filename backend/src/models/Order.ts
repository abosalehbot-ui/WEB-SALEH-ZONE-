import { HydratedDocument, Schema, Types, model } from "mongoose";

export type PaymentMethod = "Wallet" | "CreditCard";
export type PaymentStatus = "Unpaid" | "Paid" | "Refunded";
export type FulfillmentStatus = "Pending" | "Completed" | "Failed" | "Manual_Action_Required";

export interface IOrderItem {
  product: Types.ObjectId;
  merchant: Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  orderId: string;
  customer: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

type OrderDocument = HydratedDocument<IOrder>;

const orderItemSchema = new Schema<IOrderItem>(
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
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false,
    id: false
  }
);

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      default: []
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ["Wallet", "CreditCard"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid"
    },
    fulfillmentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Manual_Action_Required"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ customer: 1 });

export const Order = model<IOrder>("Order", orderSchema);

export type { OrderDocument };
