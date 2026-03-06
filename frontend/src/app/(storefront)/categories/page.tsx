"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<{ categories: Category[] }>("/catalog/categories");
        setCategories(response.data.categories);
      } catch {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">All Categories</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Choose a category to view available offers and products.</p>
      </header>

      {loading ? (
        <p className="text-saleh-textMuted">Loading categories...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-saleh-textMuted">No categories available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="rounded-xl border border-saleh-border bg-saleh-card p-4 transition-colors hover:border-saleh-primary/40 hover:bg-saleh-surface"
            >
              <h2 className="font-bold text-saleh-text">{category.name}</h2>
              <p className="mt-1 text-xs text-saleh-textMuted">Open category</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
