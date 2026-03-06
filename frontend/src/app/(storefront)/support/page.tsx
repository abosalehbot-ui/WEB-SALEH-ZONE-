"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface Ticket {
  _id: string;
  status: string;
  orderRef?: { orderId?: string };
  messages: Array<{ text: string; timestamp: string }>;
}

interface Order {
  orderId: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [replyByTicket, setReplyByTicket] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [ticketsRes, ordersRes] = await Promise.all([
        api.get<{ tickets: Ticket[] }>("/support/my"),
        api.get<{ orders: Array<{ orderId: string }> }>("/orders/my")
      ]);
      setTickets(ticketsRes.data.tickets);
      setOrders(ordersRes.data.orders);
      if (!orderId && ordersRes.data.orders[0]?.orderId) setOrderId(ordersRes.data.orders[0].orderId);
    } catch {
      setError("Failed to load support data.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!orderId) return;
    try {
      await api.post("/support", { orderId, message });
      setMessage("");
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create ticket.");
    }
  };

  const onReply = async (ticketId: string) => {
    const text = replyByTicket[ticketId]?.trim();
    if (!text) return;

    try {
      await api.post(`/support/${ticketId}/messages`, { message: text });
      setReplyByTicket((prev) => ({ ...prev, [ticketId]: "" }));
      await load();
    } catch {
      setError("Failed to send reply.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-saleh-primary">Support Tickets</h1>
        {error && <p className="text-sm text-red-400">{error}</p>}

        <form onSubmit={onCreate} className="space-y-3 rounded-xl border border-saleh-border bg-saleh-card p-4">
          {orders.length > 0 ? (
            <select value={orderId} onChange={(e) => setOrderId(e.target.value)} className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text">
              {orders.map((order) => <option key={order.orderId} value={order.orderId}>{order.orderId}</option>)}
            </select>
          ) : (
            <p className="text-saleh-textMuted">No orders found. You need an order to open a support ticket.</p>
          )}
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Describe your issue" className="w-full rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm text-saleh-text" />
          <Button type="submit" disabled={!orderId}>Create Ticket</Button>
        </form>

        <div className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-saleh-textMuted">No support tickets yet.</p>
          ) : (
            tickets.map((ticket) => (
              <article key={ticket._id} className="rounded-xl border border-saleh-border bg-saleh-card p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-saleh-text">{ticket.orderRef?.orderId || "Order"}</h2>
                  <span className="text-xs text-saleh-textMuted">{ticket.status}</span>
                </div>
                <p className="mt-2 text-sm text-saleh-textMuted">{ticket.messages[ticket.messages.length - 1]?.text}</p>

                <div className="mt-3 flex gap-2">
                  <input
                    value={replyByTicket[ticket._id] || ""}
                    onChange={(event) => setReplyByTicket((prev) => ({ ...prev, [ticket._id]: event.target.value }))}
                    placeholder="Reply to this ticket"
                    className="h-10 flex-1 rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text"
                  />
                  <Button size="sm" onClick={() => void onReply(ticket._id)}>Send</Button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
