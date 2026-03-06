import http from "http";

import { Server, Socket } from "socket.io";

import { Order } from "../models/Order";
import { ChatTicket } from "../models/ChatTicket";
import { User, UserRole } from "../models/User";
import { verifyToken } from "../utils/jwt";

interface SocketUser {
  id: string;
  role: UserRole;
}

interface ChatMessagePayload {
  ticketId: string;
  text: string;
}

interface ResolveTicketPayload {
  ticketId: string;
}

const extractSocketToken = (socket: Socket): string | null => {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim().length > 0) {
    return authToken;
  }

  const authHeader = socket.handshake.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
};

const getSocketUser = (socket: Socket): SocketUser | null => {
  const user = socket.data.user as SocketUser | undefined;
  return user ?? null;
};

export const initChatSocket = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = extractSocketToken(socket);
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("_id role");

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      socket.data.user = {
        id: user._id.toString(),
        role: user.role
      };

      return next();
    } catch (_error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinTicket", (ticketId: string) => {
      if (!ticketId) {
        return;
      }

      void socket.join(ticketId);
    });

    socket.on("sendMessage", async (payload: ChatMessagePayload) => {
      try {
        const user = getSocketUser(socket);
        if (!user) {
          socket.emit("errorMessage", "Unauthorized");
          return;
        }

        const { ticketId, text } = payload;

        if (!ticketId || !text?.trim()) {
          socket.emit("errorMessage", "ticketId and text are required");
          return;
        }

        const message = {
          sender: user.id,
          text: text.trim(),
          timestamp: new Date()
        };

        const updatedTicket = await ChatTicket.findByIdAndUpdate(
          ticketId,
          { $push: { messages: message }, $set: { status: "In_Progress" } },
          { new: true }
        );

        if (!updatedTicket) {
          socket.emit("errorMessage", "Ticket not found");
          return;
        }

        io.to(ticketId).emit("newMessage", message);
      } catch (_error) {
        socket.emit("errorMessage", "Failed to send message");
      }
    });

    socket.on("resolveTicket", async (payload: ResolveTicketPayload) => {
      try {
        const user = getSocketUser(socket);
        if (!user) {
          socket.emit("errorMessage", "Unauthorized");
          return;
        }

        if (user.role !== "Employee") {
          socket.emit("errorMessage", "Forbidden");
          return;
        }

        const { ticketId } = payload;
        if (!ticketId) {
          socket.emit("errorMessage", "ticketId is required");
          return;
        }

        const ticket = await ChatTicket.findByIdAndUpdate(
          ticketId,
          { $set: { status: "Resolved", assignedEmployee: user.id } },
          { new: true }
        );

        if (!ticket) {
          socket.emit("errorMessage", "Ticket not found");
          return;
        }

        await Order.findByIdAndUpdate(ticket.orderRef, {
          $set: { fulfillmentStatus: "Completed" }
        });

        io.to(ticketId).emit("ticketResolved", {
          ticketId,
          status: "Resolved"
        });
      } catch (_error) {
        socket.emit("errorMessage", "Failed to resolve ticket");
      }
    });
  });

  return io;
};
