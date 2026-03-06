"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface ManualOrder {
  _id: string;
  orderId: string;
  createdAt: string;
  fulfillmentStatus: string;
  customer?: { fullName?: string; username?: string };
  items: Array<{ product?: { name?: string } }>;
}

export default function EmployeePage() {
  const [orders, setOrders] = useState<ManualOrder[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<{ orders: ManualOrder[] }>("/orders/manual");
      setOrders(response.data.orders);
    };

    void load();
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-saleh-primary">Fulfillment Center</h1>
      <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-saleh-border/70 text-saleh-text">
                <td className="px-4 py-3">{order.orderId}</td>
                <td className="px-4 py-3">{order.items[0]?.product?.name || "-"}</td>
                <td className="px-4 py-3">{order.customer?.fullName || order.customer?.username || "Customer"}</td>
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{order.fulfillmentStatus}</td>
                <td className="px-4 py-3"><Link href={`/employee/chat/${order.orderId}`}><Button size="sm">Open Ticket</Button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
