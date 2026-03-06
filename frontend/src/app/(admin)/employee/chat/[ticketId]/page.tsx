"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface Message {
  sender: { fullName?: string; username?: string; role?: string };
  text: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  status: string;
  orderRef?: { orderId?: string };
  customer?: { fullName?: string; username?: string };
  messages: Message[];
}

export default function EmployeeChatPage({ params }: { params: { ticketId: string } }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<{ tickets: Ticket[] }>("/support/queue");
      setTicket(response.data.tickets.find((item) => item._id === params.ticketId) || null);
    } catch {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [params.ticketId]);

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/support/${params.ticketId}/messages`, { message: text });
      setText("");
      await load();
    } catch {
      setError("Failed to send message.");
    }
  };

  const onResolve = async () => {
    try {
      await api.post(`/support/${params.ticketId}/resolve`);
      await load();
    } catch {
      setError("Failed to resolve ticket.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["Employee", "SuperAdmin"]}>
      {loading ? (
        <p className="text-saleh-textMuted">Loading ticket...</p>
      ) : !ticket ? (
        <p className="text-saleh-textMuted">Ticket not found or already resolved.</p>
      ) : (
        <div className="grid min-h-[calc(100vh-14rem)] grid-cols-1 gap-4 lg:grid-cols-3">
          <aside className="rounded-xl border border-saleh-border bg-saleh-surface p-4 lg:col-span-1">
            <h1 className="text-xl font-black text-saleh-primary">Ticket Details</h1>
            <div className="mt-4 space-y-3 text-sm text-saleh-text">
              <p><span className="text-saleh-textMuted">Ticket ID:</span> {params.ticketId}</p>
              <p><span className="text-saleh-textMuted">Order:</span> {ticket.orderRef?.orderId || "-"}</p>
              <p><span className="text-saleh-textMuted">Customer:</span> {ticket.customer?.fullName || ticket.customer?.username || "-"}</p>
              <p><span className="text-saleh-textMuted">Status:</span> {ticket.status || "-"}</p>
            </div>

            <Button className="mt-6 w-full" onClick={onResolve}>Fulfill Order</Button>
          </aside>

          <section className="flex min-h-[28rem] flex-col rounded-xl border border-saleh-border bg-saleh-surface lg:col-span-2">
            <div className="border-b border-saleh-border px-4 py-3"><h2 className="font-semibold text-saleh-text">Live Chat</h2></div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {ticket.messages.map((message, index) => {
                const isEmployee = message.sender?.role === "Employee" || message.sender?.role === "SuperAdmin";
                return (
                  <div key={index} className={`max-w-[85%] rounded-xl border border-saleh-border bg-saleh-card p-3 text-sm ${isEmployee ? "mr-auto" : "ml-auto"}`}>
                    <p className="mb-1 text-xs text-saleh-textMuted">{message.sender?.fullName || message.sender?.username || "User"}</p>
                    <p className="text-saleh-text">{message.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-saleh-border p-3">
              {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
              <form className="flex items-center gap-2" onSubmit={onSend}>
                <Button type="submit" size="sm">Send</Button>
                <input value={text} onChange={(event) => setText(event.target.value)} type="text" placeholder="Type a message..." className="h-10 flex-1 rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text" />
              </form>
            </div>
          </section>
        </div>
      )}
    </ProtectedRoute>
  );
}
