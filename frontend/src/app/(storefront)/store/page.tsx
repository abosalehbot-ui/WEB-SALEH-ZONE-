import { ProductCard } from "@/components/product/ProductCard";

const mockProducts = [
  {
    id: "pubg-600-uc",
    name: "PUBG 600 UC",
    image: "https://placehold.co/640x360/111827/5EEAD4?text=PUBG+600+UC",
    basePrice: 10,
    productType: "DIRECT_TOPUP" as const,
    offers: [
      { merchantId: "m1", merchantName: "FastPay", price: 9.5, isActive: true },
      { merchantId: "m2", merchantName: "SalehOfficial", price: 10, isActive: true }
    ]
  },
  {
    id: "freefire-1080-d",
    name: "Free Fire 1080 Diamonds",
    image: "https://placehold.co/640x360/111827/5EEAD4?text=Free+Fire+1080",
    basePrice: 15,
    productType: "PIN_BASED" as const,
    offers: [
      { merchantId: "m3", merchantName: "UltraTopup", price: 14.5, isActive: true },
      { merchantId: "m2", merchantName: "SalehOfficial", price: 15, isActive: true }
    ]
  },
  {
    id: "steam-20",
    name: "Steam Wallet $20",
    image: "https://placehold.co/640x360/111827/5EEAD4?text=Steam+20",
    basePrice: 20,
    productType: "PIN_BASED" as const,
    offers: [{ merchantId: "m4", merchantName: "CodeHub", price: 19.2, isActive: true }]
  }
];

export default function StorePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Store</h1>
        <p className="text-sm text-saleh-textMuted">Browse all digital products and choose the best available offer.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
