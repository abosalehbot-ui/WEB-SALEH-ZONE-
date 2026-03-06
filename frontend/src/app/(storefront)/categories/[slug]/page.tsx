import Link from "next/link";

interface CategorySlugPageProps {
  params: {
    slug: string;
  };
}

const products = [
  { id: "pubg-600-uc", name: "PUBG 600 UC", price: 9.5 },
  { id: "pubg-325-uc", name: "PUBG 325 UC", price: 5.2 },
  { id: "pubg-1800-uc", name: "PUBG 1800 UC", price: 26.4 }
];

export default function CategoryDetailsPage({ params }: CategorySlugPageProps) {
  const categoryName = params.slug.replace(/-/g, " ");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Category: {categoryName}</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Top offers available in this category.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="rounded-xl border border-saleh-border bg-saleh-card p-4 transition-colors hover:border-saleh-primary/40 hover:bg-saleh-surface"
          >
            <h2 className="font-semibold text-saleh-text">{product.name}</h2>
            <p className="mt-2 text-sm text-saleh-secondary">From ${product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
