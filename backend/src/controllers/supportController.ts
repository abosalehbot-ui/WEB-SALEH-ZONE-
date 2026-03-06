import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { ChatTicket } from "../models/ChatTicket";
import { Order } from "../models/Order";

export const createSupportTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));

    const { orderId, message } = req.body as { orderId?: string; message?: string };
    if (!orderId || !message) return next(new AppError("orderId and message are required", 400));

    const order = await Order.findOne({ orderId, customer: req.user.id });
    if (!order) return next(new AppError("Order not found", 404));

    const existingOpenTicket = await ChatTicket.findOne({
      orderRef: order._id,
      customer: req.user.id,
      status: { $in: ["Open", "In_Progress"] }
    });

    if (existingOpenTicket) {
      return next(new AppError("An open support ticket already exists for this order", 409));
    }

    const ticket = await ChatTicket.create({
      orderRef: order._id,
      customer: req.user.id,
      status: "Open",
      messages: [{ sender: req.user.id, text: message, timestamp: new Date() }]
    });

    res.status(201).json({ ticket });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to create ticket", 500));
  }
};

export const getMyTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));

    const tickets = await ChatTicket.find({ customer: req.user.id })
      .populate("orderRef", "orderId")
      .populate("messages.sender", "fullName username role")
      .sort({ updatedAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load tickets", 500));
  }
};

export const getEmployeeQueue = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tickets = await ChatTicket.find({ status: { $in: ["Open", "In_Progress"] } })
      .populate("orderRef", "orderId")
      .populate("customer", "fullName username")
      .sort({ updatedAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load support queue", 500));
  }
};

export const addTicketMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) return next(new AppError("Unauthorized", 401));

    const { message } = req.body as { message?: string };
    if (!message) return next(new AppError("message is required", 400));

    const ticket = await ChatTicket.findById(req.params.ticketId);
    if (!ticket) return next(new AppError("Ticket not found", 404));

    const isOwner = ticket.customer.toString() === req.user.id;
    const isStaff = req.user.role === "Employee" || req.user.role === "SuperAdmin";

    if (!isOwner && !isStaff) {
      return next(new AppError("Forbidden", 403));
    }

    ticket.messages.push({ sender: req.user.id as any, text: message, timestamp: new Date() } as any);
    if (ticket.status === "Open") ticket.status = "In_Progress";
    await ticket.save();

    res.status(200).json({ ticket });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to add message", 500));
  }
};

export const resolveTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ticket = await ChatTicket.findByIdAndUpdate(
      req.params.ticketId,
      { status: "Resolved", assignedEmployee: req.user?.id },
      { new: true }
    );

    if (!ticket) return next(new AppError("Ticket not found", 404));

    await Order.findByIdAndUpdate(ticket.orderRef, { fulfillmentStatus: "Completed" });

    res.status(200).json({ ticket });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to resolve ticket", 500));
  }
};
