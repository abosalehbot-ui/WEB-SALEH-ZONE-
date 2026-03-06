"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    getTotal: state.getTotal
  }));

  const subtotal = getTotal();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Shopping Cart</h1>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border border-saleh-border bg-saleh-card p-6 text-center">
          <p className="text-saleh-textMuted">Your cart is empty.</p>
          <Link href="/store" className="mt-4 inline-block"><Button>Browse Store</Button></Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <article key={`${item.productId}-${item.merchantId}`} className="rounded-xl border border-saleh-border bg-saleh-card p-4">
                <h2 className="font-semibold text-saleh-text">{item.name}</h2>
                <p className="mt-1 text-sm text-saleh-textMuted">Price: ${item.price.toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.productId, item.merchantId, item.quantity - 1)}>-</Button>
                  <span className="text-saleh-text">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.productId, item.merchantId, item.quantity + 1)}>+</Button>
                  <Button size="sm" variant="ghost" onClick={() => removeItem(item.productId, item.merchantId)}>Remove</Button>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-xl border border-saleh-border bg-saleh-surface p-4">
            <div className="flex items-center justify-between font-semibold text-saleh-text">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="mt-4 block">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
