"use client";

import { Button } from "@/components/ui/Button";

interface BuyNowModalProps {
  open: boolean;
  productName: string;
  price: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function BuyNowModal({ open, productName, price, onClose, onConfirm, loading }: BuyNowModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-saleh-border bg-saleh-surface p-5 shadow-glow">
        <h2 className="text-xl font-black text-saleh-primary">Confirm Purchase</h2>
        <p className="mt-3 text-saleh-text">{productName}</p>
        <p className="mt-1 text-saleh-secondary">${price.toFixed(2)}</p>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={() => void onConfirm()} disabled={loading}>{loading ? "Processing..." : "Buy Now"}</Button>
        </div>
      </div>
    </div>
  );
}
