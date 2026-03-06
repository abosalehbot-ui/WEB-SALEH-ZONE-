"use client";

import Link from "next/link";

import { useCartStore } from "@/store/useCartStore";

export function FloatingCartButton() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="fixed bottom-5 left-5 z-40 rounded-full border border-saleh-border bg-saleh-card p-3 text-saleh-text shadow-glow lg:hidden">
      🛒 {count}
    </Link>
  );
}
