"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import api from "@/lib/axios";

interface MerchantProductRow {
  product: { _id: string; name: string; productType: string; basePrice: number };
  myOffer?: { price: number; isActive: boolean };
}

export default function MerchantProductsPage() {
  const [items, setItems] = useState<MerchantProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get<{ items: MerchantProductRow[] }>("/merchant/products");
        setItems(response.data.items);
      } catch {
        setError("Failed to load merchant products.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["Merchant", "SuperAdmin"]}>
      <div className="space-y-5">
        <div className="flex items-center justify-between"><h1 className="text-2xl font-black text-saleh-primary">Merchant Offers</h1></div>
        {error && <p className="text-sm text-red-400">{error}</p>}

        {loading ? (
          <p className="text-saleh-textMuted">Loading merchant offers...</p>
        ) : items.length === 0 ? (
          <p className="text-saleh-textMuted">No merchant offers found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Product Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">MSRP</th><th className="px-4 py-3">My Price</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product._id} className="border-t border-saleh-border/70 text-saleh-text">
                    <td className="px-4 py-3">{item.product.name}</td><td className="px-4 py-3">{item.product.productType}</td><td className="px-4 py-3">${item.product.basePrice.toFixed(2)}</td><td className="px-4 py-3">${item.myOffer?.price?.toFixed(2) ?? "-"}</td><td className="px-4 py-3">{item.myOffer?.isActive ? "Active" : "Paused"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
