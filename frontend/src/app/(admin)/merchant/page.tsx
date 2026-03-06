"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";

interface MerchantOverview {
  myRevenue: number;
  activeOffers: number;
  unitsSold: number;
  pendingPayouts: number;
}

export default function MerchantDashboardPage() {
  const [data, setData] = useState<MerchantOverview | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<MerchantOverview>("/merchant/overview");
      setData(response.data);
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Merchant Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-saleh-border bg-saleh-card p-5"><h2 className="text-sm text-saleh-textMuted">My Revenue</h2><p className="mt-2 text-2xl font-black text-saleh-primary">${data?.myRevenue.toFixed(2) ?? "..."}</p></article>
        <article className="rounded-xl border border-saleh-border bg-saleh-card p-5"><h2 className="text-sm text-saleh-textMuted">Active Offers</h2><p className="mt-2 text-2xl font-black text-saleh-primary">{data?.activeOffers ?? "..."}</p></article>
        <article className="rounded-xl border border-saleh-border bg-saleh-card p-5"><h2 className="text-sm text-saleh-textMuted">Units Sold</h2><p className="mt-2 text-2xl font-black text-saleh-primary">{data?.unitsSold ?? "..."}</p></article>
        <article className="rounded-xl border border-saleh-border bg-saleh-card p-5"><h2 className="text-sm text-saleh-textMuted">Pending Payouts</h2><p className="mt-2 text-2xl font-black text-saleh-primary">${data?.pendingPayouts.toFixed(2) ?? "..."}</p></article>
      </div>
    </div>
  );
}
