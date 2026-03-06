"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";

interface Product { _id: string; name: string; productType: string; basePrice: number; category?: { name?: string } }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { void api.get<{products: Product[]}>("/admin/products").then((r)=>setProducts(r.data.products)); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-saleh-primary">Products</h1>
      <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
        <table className="min-w-full text-right text-sm"><thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Price</th></tr></thead><tbody>{products.map((p)=><tr key={p._id} className="border-t border-saleh-border/70 text-saleh-text"><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.category?.name || "-"}</td><td className="px-4 py-3">{p.productType}</td><td className="px-4 py-3">${p.basePrice.toFixed(2)}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
