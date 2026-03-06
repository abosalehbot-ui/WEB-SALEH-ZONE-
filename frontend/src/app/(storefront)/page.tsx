"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface Category { _id: string; name: string; slug: string; description?: string }

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    void api.get<{categories: Category[]}>("/catalog/categories").then((r)=>setCategories(r.data.categories.slice(0,6)));
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6">
      <section className="rounded-2xl border border-saleh-border bg-saleh-card p-6 sm:p-10">
        <h1 className="text-3xl font-black text-saleh-primary sm:text-5xl">Welcome to Saleh Zone</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-saleh-textMuted sm:text-base">Trusted marketplace for game top-ups, digital PINs, and instant fulfillment.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/store"><Button size="lg">Start Shopping</Button></Link>
          <Link href="/categories"><Button size="lg" variant="outline">Browse Categories</Button></Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-saleh-primary">Featured Categories</h2></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`} className="rounded-xl border border-saleh-border bg-saleh-card p-4 transition hover:border-saleh-primary/40 hover:bg-saleh-surface">
              <h3 className="font-bold text-saleh-text">{category.name}</h3>
              <p className="mt-2 text-sm text-saleh-textMuted">{category.description || "Discover products in this category."}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
