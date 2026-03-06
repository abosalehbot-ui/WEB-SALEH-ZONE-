"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type PaymentMethod = "wallet" | "creditCard";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    setIsProcessing(false);
    window.alert("Order Successful! Ticket/PIN generated.");
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
      <section className="space-y-6 rounded-xl border border-saleh-border bg-saleh-card p-5 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Checkout</h1>
          <p className="mt-2 text-sm text-saleh-textMuted">Choose your payment method and confirm your purchase.</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-saleh-text">Payment Method</h2>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-saleh-border bg-saleh-surface p-3">
            <div>
              <p className="font-semibold text-saleh-text">Wallet Balance</p>
              <p className="text-xs text-saleh-textMuted">Current: $50.00</p>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "wallet"}
              onChange={() => setPaymentMethod("wallet")}
              className="h-4 w-4 accent-[#5EEAD4]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-saleh-border bg-saleh-surface p-3">
            <div>
              <p className="font-semibold text-saleh-text">Credit Card</p>
              <p className="text-xs text-saleh-textMuted">Visa / MasterCard</p>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "creditCard"}
              onChange={() => setPaymentMethod("creditCard")}
              className="h-4 w-4 accent-[#5EEAD4]"
            />
          </label>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-saleh-text">Promo Code</h2>
          <input
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            type="text"
            placeholder="Enter promo code"
            className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text placeholder:text-saleh-textMuted focus:border-saleh-primary focus:outline-none"
          />
        </div>
      </section>

      <aside className="space-y-4 rounded-xl border border-saleh-border bg-saleh-card p-5">
        <h2 className="text-lg font-black text-saleh-primary">Order Summary</h2>

        <div className="rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm">
          <p className="font-semibold text-saleh-text">PUBG 600 UC</p>
          <p className="mt-1 text-saleh-textMuted">Vendor: FastPay</p>
          <p className="mt-2 font-bold text-saleh-secondary">$9.50</p>
        </div>

        <div className="space-y-2 border-t border-saleh-border pt-3 text-sm text-saleh-text">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>$9.50</span>
          </div>
          <div className="flex items-center justify-between text-saleh-textMuted">
            <span>Tax/Fees</span>
            <span>$0.50</span>
          </div>
          <div className="flex items-center justify-between text-base font-black text-saleh-primary">
            <span>Total</span>
            <span>$10.00</span>
          </div>
        </div>

        <Button onClick={handleConfirmPayment} disabled={isProcessing} className="w-full" size="lg">
          {isProcessing ? "Processing..." : "Confirm & Pay"}
        </Button>
      </aside>
    </div>
  );
}
