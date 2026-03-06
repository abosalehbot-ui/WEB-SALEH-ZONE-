"use client";

import { FormEvent, useEffect, useState } from "react";

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

  const load = async () => {
    const [ticketsRes, ordersRes] = await Promise.all([
      api.get<{ tickets: Ticket[] }>("/support/my"),
      api.get<{ orders: Array<{ orderId: string }> }>("/orders/my")
    ]);
    setTickets(ticketsRes.data.tickets);
    setOrders(ordersRes.data.orders);
    if (!orderId && ordersRes.data.orders[0]?.orderId) setOrderId(ordersRes.data.orders[0].orderId);
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    await api.post("/support", { orderId, message });
    setMessage("");
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-saleh-primary">Support Tickets</h1>

      <form onSubmit={onCreate} className="space-y-3 rounded-xl border border-saleh-border bg-saleh-card p-4">
        <select value={orderId} onChange={(e) => setOrderId(e.target.value)} className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text">
          {orders.map((order) => <option key={order.orderId} value={order.orderId}>{order.orderId}</option>)}
        </select>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Describe your issue" className="w-full rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm text-saleh-text" />
        <Button type="submit">Create Ticket</Button>
      </form>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <article key={ticket._id} className="rounded-xl border border-saleh-border bg-saleh-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-saleh-text">{ticket.orderRef?.orderId || "Order"}</h2>
              <span className="text-xs text-saleh-textMuted">{ticket.status}</span>
            </div>
            <p className="mt-2 text-sm text-saleh-textMuted">{ticket.messages[ticket.messages.length - 1]?.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
