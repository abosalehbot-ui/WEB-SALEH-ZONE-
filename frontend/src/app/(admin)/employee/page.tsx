"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface QueueTicket {
  _id: string;
  status: string;
  updatedAt: string;
  orderRef?: { orderId?: string };
  customer?: { fullName?: string; username?: string };
}

export default function EmployeePage() {
  const [tickets, setTickets] = useState<QueueTicket[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<{ tickets: QueueTicket[] }>("/support/queue");
      setTickets(response.data.tickets);
    };

    void load();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["Employee", "SuperAdmin"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-black text-saleh-primary">Fulfillment Center</h1>
        <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-t border-saleh-border/70 text-saleh-text">
                  <td className="px-4 py-3">{ticket._id.slice(-6)}</td>
                  <td className="px-4 py-3">{ticket.orderRef?.orderId || "-"}</td>
                  <td className="px-4 py-3">{ticket.customer?.fullName || ticket.customer?.username || "Customer"}</td>
                  <td className="px-4 py-3">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{ticket.status}</td>
                  <td className="px-4 py-3"><Link href={`/employee/chat/${ticket._id}`}><Button size="sm">Open Ticket</Button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
