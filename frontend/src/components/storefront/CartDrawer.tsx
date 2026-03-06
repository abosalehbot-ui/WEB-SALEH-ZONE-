"use client";

import { useState } from "react";
import Link from "next/link";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, getTotal } = useCartStore((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    getTotal: state.getTotal
  }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-5 z-40 rounded-full border border-saleh-border bg-saleh-surface px-3 py-2 text-xs text-saleh-text shadow-glow lg:hidden"
      >
        Quick Cart
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70" onClick={() => setOpen(false)}>
          <aside className="mr-auto h-full w-full max-w-sm border-l border-saleh-border bg-saleh-surface p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-saleh-primary">Cart</h2>
              <button onClick={() => setOpen(false)} className="text-saleh-textMuted">✕</button>
            </div>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.merchantId}`} className="rounded-lg border border-saleh-border bg-saleh-card p-3">
                  <p className="font-semibold text-saleh-text">{item.name}</p>
                  <p className="text-xs text-saleh-textMuted">{item.quantity} × ${item.price.toFixed(2)}</p>
                  <button className="mt-1 text-xs text-saleh-danger" onClick={() => removeItem(item.productId, item.merchantId)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-saleh-border pt-3 text-sm text-saleh-text">Subtotal: ${getTotal().toFixed(2)}</div>
            <Link href="/checkout" className="mt-3 block" onClick={() => setOpen(false)}><Button className="w-full">Checkout</Button></Link>
          </aside>
        </div>
      )}
    </>
  );
}
