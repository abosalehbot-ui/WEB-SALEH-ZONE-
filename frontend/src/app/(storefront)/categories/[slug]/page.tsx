"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  basePrice: number;
}

export default function CategoryDetailsPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<{ category: Category; products: Product[] }>(`/catalog/categories/${params.slug}`);
      setCategory(response.data.category);
      setProducts(response.data.products);
    };

    void load();
  }, [params.slug]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Category: {category?.name || params.slug}</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product._id}`}
            className="rounded-xl border border-saleh-border bg-saleh-card p-4 transition-colors hover:border-saleh-primary/40 hover:bg-saleh-surface"
          >
            <h2 className="font-semibold text-saleh-text">{product.name}</h2>
            <p className="mt-2 text-sm text-saleh-secondary">From ${product.basePrice.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
