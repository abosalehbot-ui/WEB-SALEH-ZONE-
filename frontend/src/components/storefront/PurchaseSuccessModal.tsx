"use client";

import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  orderId: string;
  onClose: () => void;
}

export function PurchaseSuccessModal({ open, orderId, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-saleh-border bg-saleh-surface p-5">
        <h2 className="text-xl font-black text-saleh-primary">Purchase Successful</h2>
        <p className="mt-2 text-saleh-textMuted">Order ID: {orderId}</p>
        <Button className="mt-5 w-full" onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
