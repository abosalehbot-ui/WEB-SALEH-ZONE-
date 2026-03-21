"use client";

import Link from "next/link";

import { ThemeSwitcher } from "@/components/storefront/ThemeSwitcher";
import { CurrencySwitcher } from "@/components/storefront/CurrencySwitcher";
import { useUserStore } from "@/store/useUserStore";

export function StoreSidebar() {
  const user = useUserStore((state) => state.user);

  return (
    <aside className="hidden w-72 shrink-0 rounded-2xl border border-saleh-border bg-saleh-surface/80 p-4 lg:block">
      <div className="rounded-xl border border-saleh-border bg-saleh-card p-4">
        <p className="text-xs text-saleh-textMuted">Signed in as</p>
        <p className="mt-1 font-bold text-saleh-text">{user?.fullName || user?.username || "Guest"}</p>
        <p className="mt-2 text-sm text-saleh-secondary">Wallet: ${user?.walletBalance?.toFixed(2) ?? "0.00"}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ThemeSwitcher />
        <CurrencySwitcher />
      </div>

      <nav className="mt-6 space-y-2 text-sm">
        <Link href="/store" className="block rounded-lg px-3 py-2 text-saleh-text hover:bg-saleh-card">Store</Link>
        <Link href="/categories" className="block rounded-lg px-3 py-2 text-saleh-text hover:bg-saleh-card">Categories</Link>
        <Link href="/cart" className="block rounded-lg px-3 py-2 text-saleh-text hover:bg-saleh-card">Cart</Link>
        <Link href="/profile" className="block rounded-lg px-3 py-2 text-saleh-text hover:bg-saleh-card">Profile</Link>
        <Link href="/support" className="block rounded-lg px-3 py-2 text-saleh-text hover:bg-saleh-card">Support Tickets</Link>
      </nav>
    </aside>
  );
}
