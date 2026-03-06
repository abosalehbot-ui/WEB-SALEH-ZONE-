import { HydratedDocument, Schema, Types, model } from "mongoose";

export type ChatTicketStatus = "Open" | "In_Progress" | "Resolved";

export interface IChatMessage {
  sender: Types.ObjectId;
  text: string;
  timestamp: Date;
}

export interface IChatTicket {
  orderRef: Types.ObjectId;
  customer: Types.ObjectId;
  assignedEmployee?: Types.ObjectId;
  status: ChatTicketStatus;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

type ChatTicketDocument = HydratedDocument<IChatTicket>;

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false,
    id: false
  }
);

const chatTicketSchema = new Schema<IChatTicket>(
  {
    orderRef: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedEmployee: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["Open", "In_Progress", "Resolved"],
      default: "Open"
    },
    messages: {
      type: [chatMessageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

chatTicketSchema.index({ orderRef: 1 });
chatTicketSchema.index({ status: 1 });

export const ChatTicket = model<IChatTicket>("ChatTicket", chatTicketSchema);

export type { ChatTicketDocument };
