"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";

interface OverviewData {
  totalRevenue: number;
  activeUsers: number;
  pendingOrders: number;
  activeMerchants: number;
}

const stats = [
  { key: "totalRevenue", label: "Total Revenue", prefix: "$" },
  { key: "activeUsers", label: "Active Users", prefix: "" },
  { key: "pendingOrders", label: "Pending Orders", prefix: "" },
  { key: "activeMerchants", label: "Active Merchants", prefix: "" }
] as const;

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<OverviewData>("/admin/overview");
      setData(response.data);
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">SuperAdmin Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.key} className="rounded-xl border border-saleh-border bg-saleh-card p-5">
            <h2 className="text-sm font-medium text-saleh-textMuted">{stat.label}</h2>
            <p className="mt-3 text-3xl font-black text-saleh-primary">
              {stat.prefix}{data ? Number(data[stat.key]).toLocaleString() : "..."}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
