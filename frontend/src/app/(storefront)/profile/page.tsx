"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

type TabKey = "overview" | "edit" | "security" | "orders" | "wallet" | "support";

interface ProfileData {
  user: { fullName?: string; username?: string; email: string; walletBalance: number; createdAt?: string };
  orders: Array<{ _id: string; orderId: string; createdAt: string; fulfillmentStatus: string; items: Array<{ product: { name: string } }> }>;
}

interface WalletInfo { transactions: Array<{ _id: string; type: string; amount: number; createdAt: string; description?: string }> }
interface Ticket { _id: string; status: string; orderRef?: { orderId?: string }; messages: Array<{ text: string }> }

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "edit", label: "Edit Profile" },
  { key: "security", label: "Security" },
  { key: "orders", label: "Orders History" },
  { key: "wallet", label: "Wallet History" },
  { key: "support", label: "Support Tickets" }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [data, setData] = useState<ProfileData | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    const [profileRes, walletRes, ticketsRes] = await Promise.all([
      api.get<ProfileData>("/user/profile"),
      api.get<WalletInfo>("/wallet/info"),
      api.get<{ tickets: Ticket[] }>("/support/my")
    ]);
    setData(profileRes.data);
    setWalletInfo(walletRes.data);
    setTickets(ticketsRes.data.tickets);
    setFullName(profileRes.data.user.fullName || "");
  };

  useEffect(() => {
    void load();
  }, []);

  const onUpdateProfile = async (event: FormEvent) => {
    event.preventDefault();
    await api.patch("/user/profile", { fullName });
    await load();
  };

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-saleh-border bg-saleh-surface p-3">
          <nav className="flex gap-2 md:flex-col">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`rounded-lg px-4 py-2 text-sm ${activeTab === tab.key ? "bg-saleh-primary text-black" : "bg-saleh-card text-saleh-text"}`}>{tab.label}</button>
            ))}
          </nav>
        </aside>

        <section className="rounded-xl border border-saleh-border bg-saleh-card p-5">
          {!data ? <p className="text-saleh-textMuted">Loading...</p> : (
            <>
              {activeTab === "overview" && <div className="space-y-3"><h1 className="text-2xl font-black text-saleh-primary">Profile Overview</h1><p className="text-saleh-text">{data.user.fullName || data.user.username}</p><p className="text-saleh-textMuted">{data.user.email}</p><p className="text-saleh-secondary">Balance: ${data.user.walletBalance.toFixed(2)}</p></div>}

              {activeTab === "edit" && <form className="space-y-3" onSubmit={onUpdateProfile}><h1 className="text-2xl font-black text-saleh-primary">Edit Profile</h1><input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" /><Button type="submit">Save</Button></form>}

              {activeTab === "security" && <div className="space-y-3"><h1 className="text-2xl font-black text-saleh-primary">Security</h1><input type="password" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" /><Button onClick={async ()=>{await api.patch("/user/password",{password}); setPassword("");}}>Update Password</Button></div>}

              {activeTab === "orders" && <div className="space-y-3"><h1 className="text-2xl font-black text-saleh-primary">Orders History</h1>{data.orders.map((order)=><div key={order._id} className="rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm"><p>{order.orderId}</p><p className="text-saleh-textMuted">{order.items[0]?.product?.name} - {order.fulfillmentStatus}</p></div>)}</div>}

              {activeTab === "wallet" && <div className="space-y-3"><h1 className="text-2xl font-black text-saleh-primary">Wallet History</h1>{walletInfo?.transactions.map((tx)=><div key={tx._id} className="rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm"><p>{tx.type} ${tx.amount.toFixed(2)}</p><p className="text-saleh-textMuted">{new Date(tx.createdAt).toLocaleString()}</p></div>)}</div>}

              {activeTab === "support" && <div className="space-y-3"><h1 className="text-2xl font-black text-saleh-primary">Support Tickets</h1>{tickets.map((ticket)=><div key={ticket._id} className="rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm"><p>{ticket.orderRef?.orderId || "Order"} - {ticket.status}</p><p className="text-saleh-textMuted">{ticket.messages[ticket.messages.length-1]?.text}</p></div>)}</div>}
            </>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
