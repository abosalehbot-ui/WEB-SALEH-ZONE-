import Link from "next/link";

const featuredCategories = [
  {
    name: "PUBG",
    slug: "pubg",
    icon: "🎯",
    description: "UC top-ups and premium bundles"
  },
  {
    name: "Free Fire",
    slug: "free-fire",
    icon: "🔥",
    description: "Diamonds and membership passes"
  },
  {
    name: "Mobile Legends",
    slug: "mobile-legends",
    icon: "⚔️",
    description: "Weekly passes and crystal packs"
  },
  {
    name: "Steam",
    slug: "steam",
    icon: "🎮",
    description: "Gift cards and wallet recharge codes"
  }
];

export default function StorefrontHomePage() {
  return (
    <div className="space-y-10 pb-10">
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-saleh-border bg-saleh-card p-6 shadow-glow sm:p-10">
          <p className="mb-3 inline-flex rounded-full bg-saleh-primary/15 px-3 py-1 text-xs font-semibold text-saleh-primary">
            Welcome to the marketplace
          </p>
          <h1 className="text-3xl font-black text-saleh-primary sm:text-5xl">Saleh Zone</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-saleh-text sm:text-base">
            Your trusted destination for digital goods, fast top-ups, and competitive multi-vendor offers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/store"
              className="inline-flex items-center justify-center rounded-lg bg-saleh-primary px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-saleh-secondary"
            >
              Start Shopping
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-lg border border-saleh-border bg-saleh-surface px-5 py-2.5 text-sm font-semibold text-saleh-text transition-colors hover:bg-saleh-card"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-saleh-primary sm:text-2xl">Featured Categories</h2>
          <span className="text-xs text-saleh-textMuted">Updated daily</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group rounded-xl border border-saleh-border bg-saleh-card p-4 transition-colors hover:border-saleh-primary/50 hover:bg-saleh-surface"
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-saleh-primary/15 text-2xl">
                {category.icon}
              </div>
              <h3 className="text-base font-bold text-saleh-text group-hover:text-saleh-primary">{category.name}</h3>
              <p className="mt-2 text-sm text-saleh-textMuted">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
