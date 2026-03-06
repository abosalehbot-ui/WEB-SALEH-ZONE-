"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";

type PaymentMethod = "Wallet" | "CreditCard";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore((state) => ({
    items: state.items,
    getTotal: state.getTotal,
    clearCart: state.clearCart
  }));

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotal();
  const fees = useMemo(() => (items.length ? 0.5 : 0), [items.length]);
  const total = subtotal + fees;

  const handleConfirmPayment = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    setError("");
    try {
      await api.post("/orders/checkout", { items, paymentMethod });
      clearCart();
      window.alert("Order Successful! Ticket/PIN generated.");
      router.push("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["Customer", "SuperAdmin", "Merchant", "Employee"]}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
        <section className="space-y-6 rounded-xl border border-saleh-border bg-saleh-card p-5 lg:col-span-2">
          <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Checkout</h1>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-saleh-border bg-saleh-surface p-3">
              <span className="font-semibold text-saleh-text">Wallet Balance</span>
              <input type="radio" checked={paymentMethod === "Wallet"} onChange={() => setPaymentMethod("Wallet")} />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-saleh-border bg-saleh-surface p-3">
              <span className="font-semibold text-saleh-text">Credit Card</span>
              <input type="radio" checked={paymentMethod === "CreditCard"} onChange={() => setPaymentMethod("CreditCard")} />
            </label>
          </div>
        </section>

        <aside className="space-y-4 rounded-xl border border-saleh-border bg-saleh-card p-5">
          <h2 className="text-lg font-black text-saleh-primary">Order Summary</h2>
          <div className="space-y-2 text-sm text-saleh-textMuted">
            {items.map((item) => (
              <p key={`${item.productId}-${item.merchantId}`}>{item.name} × {item.quantity} - ${item.price.toFixed(2)}</p>
            ))}
          </div>
          <div className="space-y-2 border-t border-saleh-border pt-3 text-sm text-saleh-text">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax/Fees</span><span>${fees.toFixed(2)}</span></div>
            <div className="flex justify-between font-black"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button className="w-full" onClick={handleConfirmPayment} disabled={isProcessing || items.length === 0}>
            {isProcessing ? "Processing..." : "Confirm & Pay"}
          </Button>
        </aside>
      </div>
    </ProtectedRoute>
  );
}
