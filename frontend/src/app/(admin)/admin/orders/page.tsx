"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import api from "@/lib/axios";

interface Order { _id: string; orderId: string; totalAmount: number; fulfillmentStatus: string; customer?: { fullName?: string; username?: string } }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { void api.get<{ orders: Order[] }>("/admin/orders").then((r) => setOrders(r.data.orders)); }, []);

  return (
    <ProtectedRoute allowedRoles={["SuperAdmin"]}>
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-saleh-primary">Orders</h1>
        <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
          <table className="min-w-full text-right text-sm"><thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{orders.map((o) => <tr key={o._id} className="border-t border-saleh-border/70 text-saleh-text"><td className="px-4 py-3">{o.orderId}</td><td className="px-4 py-3">{o.customer?.fullName || o.customer?.username || "-"}</td><td className="px-4 py-3">${o.totalAmount.toFixed(2)}</td><td className="px-4 py-3">{o.fulfillmentStatus}</td></tr>)}</tbody></table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
