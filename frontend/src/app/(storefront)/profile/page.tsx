"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

type TabKey = "wallet" | "orders" | "pins";

interface ProfileData {
  user: { walletBalance: number };
  orders: Array<{ _id: string; orderId: string; createdAt: string; fulfillmentStatus: string; items: Array<{ product: { name: string } }> }>;
  pins: Array<{ _id: string; pinCode: string; status: string; product?: { name?: string } }>;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "wallet", label: "Wallet" },
  { key: "orders", label: "Order History" },
  { key: "pins", label: "My PIN Vault" }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("wallet");
  const [amount, setAmount] = useState("10");
  const [data, setData] = useState<ProfileData | null>(null);

  const load = async () => {
    const response = await api.get<ProfileData>("/user/profile");
    setData(response.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleRecharge = async () => {
    await api.post("/wallet/deposit", { amount: Number(amount), paymentMethod: "Card" });
    await load();
  };

  const handleCopyPin = async (pin: string) => {
    await navigator.clipboard.writeText(pin);
    window.alert("PIN copied");
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-8 sm:px-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-saleh-border bg-saleh-surface p-3">
          <nav className="flex gap-2 md:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.key ? "bg-saleh-primary text-black" : "bg-saleh-card text-saleh-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="rounded-xl border border-saleh-border bg-saleh-card p-5 sm:p-6">
          {!data ? (
            <p className="text-saleh-textMuted">Loading profile...</p>
          ) : (
            <>
              {activeTab === "wallet" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-black text-saleh-primary">Wallet</h1>
                  <div className="rounded-xl border border-saleh-border bg-saleh-surface p-4">
                    <p className="text-sm text-saleh-textMuted">Current Balance</p>
                    <p className="mt-2 text-3xl font-black text-saleh-secondary">${data.user.walletBalance.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2 rounded-xl border border-saleh-border bg-saleh-surface p-4">
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text" />
                    <Button type="button" onClick={handleRecharge}>Proceed to Pay</Button>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-black text-saleh-primary">Order History</h1>
                  <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
                    <table className="min-w-full text-right text-sm">
                      <thead className="bg-saleh-card text-saleh-textMuted">
                        <tr><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
                      </thead>
                      <tbody>
                        {data.orders.map((order) => (
                          <tr key={order._id} className="border-t border-saleh-border/70 text-saleh-text">
                            <td className="px-4 py-3">{order.orderId}</td>
                            <td className="px-4 py-3">{order.items[0]?.product?.name || "-"}</td>
                            <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">{order.fulfillmentStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "pins" && (
                <div className="space-y-3">
                  <h1 className="text-2xl font-black text-saleh-primary">My PIN Vault</h1>
                  {data.pins.map((pinItem) => (
                    <article key={pinItem._id} className="rounded-xl border border-saleh-border bg-saleh-surface p-4">
                      <h2 className="font-semibold text-saleh-text">{pinItem.product?.name || "Digital Code"}</h2>
                      <p className="mt-3 rounded-lg border border-saleh-border bg-saleh-card px-3 py-2 font-mono text-sm text-saleh-secondary">{pinItem.pinCode}</p>
                      <Button className="mt-3" size="sm" variant="outline" onClick={() => handleCopyPin(pinItem.pinCode)}>Copy PIN</Button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
