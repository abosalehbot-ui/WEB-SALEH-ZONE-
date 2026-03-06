import Link from "next/link";

import { Button } from "@/components/ui/Button";

const cartItems = [
  { id: "pubg-600-uc", name: "PUBG 600 UC", vendor: "FastPay", quantity: 1, price: 9.5 }
];

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Shopping Cart</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Review your selected products before checkout.</p>
      </header>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <article key={item.id} className="rounded-xl border border-saleh-border bg-saleh-card p-4">
            <h2 className="font-semibold text-saleh-text">{item.name}</h2>
            <p className="mt-1 text-sm text-saleh-textMuted">Vendor: {item.vendor}</p>
            <p className="mt-2 text-sm text-saleh-textMuted">Quantity: {item.quantity}</p>
            <p className="mt-2 font-bold text-saleh-secondary">${item.price.toFixed(2)}</p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-saleh-border bg-saleh-surface p-4">
        <div className="flex items-center justify-between font-semibold text-saleh-text">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="mt-4 block">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
