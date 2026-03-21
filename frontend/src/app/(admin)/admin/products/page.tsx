"use client";

import { FormEvent, useEffect, useState } from "react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";

interface Category { _id: string; name: string }
interface Product { _id: string; name: string; slug: string; productType: string; basePrice: number; category?: { _id?: string; name?: string } }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");

  const load = async () => {
    const [prodRes, catRes] = await Promise.all([
      api.get<{ products: Product[] }>("/admin/products"),
      api.get<{ categories: Category[] }>("/admin/categories")
    ]);
    setProducts(prodRes.data.products);
    setCategories(catRes.data.categories);
    if (!category && catRes.data.categories[0]?._id) setCategory(catRes.data.categories[0]._id);
  };

  useEffect(() => { void load(); }, []);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    await api.post("/admin/products", { name, slug, category, productType: "PIN_BASED", basePrice: 0 });
    setName(""); setSlug("");
    await load();
  };

  const onDelete = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-black text-saleh-primary">Products</h1>
        <form onSubmit={onCreate} className="flex flex-wrap gap-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="h-9 rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text" />
          <input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="Slug" className="h-9 rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text" />
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="h-9 rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text">{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select>
          <Button size="sm" type="submit">Add Product</Button>
        </form>
      </div>
      <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
        <table className="min-w-full text-right text-sm"><thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{products.map((p)=><tr key={p._id} className="border-t border-saleh-border/70 text-saleh-text"><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.category?.name || "-"}</td><td className="px-4 py-3">{p.productType}</td><td className="px-4 py-3">${p.basePrice.toFixed(2)}</td><td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={()=>onDelete(p._id)}>Delete</Button></td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
