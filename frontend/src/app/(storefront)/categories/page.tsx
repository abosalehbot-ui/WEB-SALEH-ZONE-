import Link from "next/link";

const categories = [
  { name: "PUBG", slug: "pubg", icon: "🎯", count: 12 },
  { name: "Free Fire", slug: "free-fire", icon: "🔥", count: 9 },
  { name: "Mobile Legends", slug: "mobile-legends", icon: "⚔️", count: 7 },
  { name: "Steam", slug: "steam", icon: "🎮", count: 15 }
];

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">All Categories</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Choose a category to view available offers and products.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="rounded-xl border border-saleh-border bg-saleh-card p-4 transition-colors hover:border-saleh-primary/40 hover:bg-saleh-surface"
          >
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-saleh-primary/15 text-2xl">
              {category.icon}
            </div>
            <h2 className="font-bold text-saleh-text">{category.name}</h2>
            <p className="mt-1 text-xs text-saleh-textMuted">{category.count} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
