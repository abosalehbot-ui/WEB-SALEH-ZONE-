"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type ProfileTab = "wallet" | "orders" | "pins";

interface OrderItem {
  id: string;
  product: string;
  date: string;
  status: "Completed" | "Pending";
}

interface PinItem {
  id: string;
  product: string;
  pin: string;
  status: "Valid" | "Used";
}

const tabs: Array<{ key: ProfileTab; label: string }> = [
  { key: "wallet", label: "Wallet" },
  { key: "orders", label: "Order History" },
  { key: "pins", label: "My PIN Vault" }
];

const mockOrders: OrderItem[] = [
  { id: "ORD-001", product: "PUBG 600 UC", date: "2026-03-01", status: "Completed" },
  { id: "ORD-002", product: "Steam Wallet $20", date: "2026-03-03", status: "Completed" },
  { id: "ORD-003", product: "Free Fire 530 Diamonds", date: "2026-03-05", status: "Pending" }
];

const mockPins: PinItem[] = [
  {
    id: "PIN-1",
    product: "Free Fire 1080 Diamonds",
    pin: "ABCD-1234-EFGH-5678",
    status: "Valid"
  },
  {
    id: "PIN-2",
    product: "Steam Wallet $20",
    pin: "WXYZ-9876-IJKL-5432",
    status: "Used"
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("wallet");
  const [amount, setAmount] = useState("");

  const handleCopyPin = async (pin: string) => {
    try {
      await navigator.clipboard.writeText(pin);
      window.alert("PIN copied successfully.");
    } catch {
      window.alert("Unable to copy PIN on this device.");
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[240px_1fr]">
      <aside className="rounded-xl border border-saleh-border bg-saleh-surface p-3">
        <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-saleh-primary text-black"
                    : "bg-saleh-card text-saleh-text hover:bg-saleh-card/70"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="rounded-xl border border-saleh-border bg-saleh-card p-5 sm:p-6">
        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-saleh-primary">Wallet</h1>
              <p className="mt-2 text-sm text-saleh-textMuted">Manage your balance and top up instantly.</p>
            </div>

            <div className="rounded-xl border border-saleh-border bg-saleh-surface p-4">
              <p className="text-sm text-saleh-textMuted">Current Balance</p>
              <p className="mt-2 text-3xl font-black text-saleh-secondary">$50.00</p>
            </div>

            <form className="space-y-3 rounded-xl border border-saleh-border bg-saleh-surface p-4">
              <h2 className="text-sm font-bold text-saleh-text">Recharge Balance</h2>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text placeholder:text-saleh-textMuted focus:border-saleh-primary focus:outline-none"
              />
              <Button type="button">Proceed to Pay</Button>
            </form>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black text-saleh-primary">Order History</h1>
              <p className="mt-2 text-sm text-saleh-textMuted">Review your recent purchases and statuses.</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-saleh-border bg-saleh-surface">
              <div className="overflow-x-auto">
                <table className="min-w-full text-right text-sm">
                  <thead className="bg-saleh-card text-saleh-textMuted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order ID</th>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="border-t border-saleh-border/70 text-saleh-text">
                        <td className="whitespace-nowrap px-4 py-3 font-medium">{order.id}</td>
                        <td className="whitespace-nowrap px-4 py-3">{order.product}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-saleh-textMuted">{order.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              order.status === "Completed"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pins" && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black text-saleh-primary">My PIN Vault</h1>
              <p className="mt-2 text-sm text-saleh-textMuted">Your purchased digital codes are listed securely below.</p>
            </div>

            <div className="space-y-3">
              {mockPins.map((pinItem) => (
                <article
                  key={pinItem.id}
                  className="rounded-xl border border-saleh-border bg-saleh-surface p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-saleh-text">{pinItem.product}</h2>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        pinItem.status === "Valid"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-slate-500/15 text-slate-300"
                      }`}
                    >
                      {pinItem.status}
                    </span>
                  </div>
                  <p className="mt-3 rounded-lg border border-saleh-border bg-saleh-card px-3 py-2 font-mono text-sm text-saleh-secondary">
                    {pinItem.pin}
                  </p>
                  <Button
                    className="mt-3"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPin(pinItem.pin)}
                  >
                    Copy PIN
                  </Button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
