"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const { user, isAuthenticated, isHydrated, fetchMe, logout } = useUserStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isHydrated: state.isHydrated,
    fetchMe: state.fetchMe,
    logout: state.logout
  }));

  useEffect(() => {
    if (!isHydrated) {
      void fetchMe();
    }
  }, [fetchMe, isHydrated]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Store" },
    { href: "/categories", label: "Categories" },
    { href: "/support", label: "Support" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-saleh-border bg-saleh-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <button className="text-saleh-text lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
            <Link href="/" className="text-xl font-black text-saleh-primary">Saleh Zone</Link>
            <nav className="hidden items-center gap-5 text-sm text-saleh-text lg:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-saleh-primary">{link.label}</Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-saleh-border bg-saleh-card text-saleh-text transition-colors hover:text-saleh-primary" aria-label="Cart">
              <span aria-hidden>🛒</span>
              {totalQuantity > 0 && <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-saleh-primary px-1 text-xs font-bold text-black">{totalQuantity}</span>}
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="hidden items-center gap-2 rounded-lg border border-saleh-border bg-saleh-card px-3 py-2 text-sm text-saleh-text sm:inline-flex">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-saleh-primary/20 text-saleh-primary">{user.fullName?.charAt(0) ?? user.username?.charAt(0) ?? "U"}</span>
                  <span>{user.fullName || user.username || "User"}</span>
                </Link>
                <Button size="sm" variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Link href="/login"><Button size="sm">Login</Button></Link>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="mr-auto h-full w-72 border-l border-saleh-border bg-saleh-surface p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-black text-saleh-primary">Menu</h2><button onClick={() => setMenuOpen(false)}>✕</button></div>
            <nav className="space-y-2">{links.map((link) => <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-saleh-text hover:bg-saleh-card" onClick={() => setMenuOpen(false)}>{link.label}</Link>)}</nav>
          </aside>
        </div>
      )}
    </>
  );
}
