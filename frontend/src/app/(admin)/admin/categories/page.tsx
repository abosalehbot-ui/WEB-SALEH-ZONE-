"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const response = await api.get<{ categories: Category[] }>("/admin/categories");
    setCategories(response.data.categories);
  };

  useEffect(() => {
    void load();
  }, []);

  const onAdd = async (event: FormEvent) => {
    event.preventDefault();
    await api.post("/admin/categories", { name });
    setName("");
    await load();
  };

  const onToggle = async (category: Category) => {
    await api.patch(`/admin/categories/${category._id}`, { isActive: !category.isActive });
    await load();
  };

  const onDelete = async (categoryId: string) => {
    await api.delete(`/admin/categories/${categoryId}`);
    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-saleh-primary">Category Management</h1>
        <form className="flex gap-2" onSubmit={onAdd}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="h-10 rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text" />
          <Button size="sm" type="submit">Add New Category</Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-saleh-border bg-saleh-surface">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-saleh-card text-saleh-textMuted">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-t border-saleh-border/70 text-saleh-text">
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3">{category.slug}</td>
                  <td className="px-4 py-3">{category.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onToggle(category)}>{category.isActive ? "Disable" : "Enable"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(category._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
