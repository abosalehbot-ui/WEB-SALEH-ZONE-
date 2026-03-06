"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";
import { ProductCard } from "@/components/product/ProductCard";

interface MerchantUser {
  _id: string;
  fullName?: string;
  username?: string;
}

interface Offer {
  merchant: MerchantUser | string;
  price: number;
  isActive: boolean;
}

interface ApiProduct {
  _id: string;
  name: string;
  image: string;
  basePrice: number;
  productType: "PIN_BASED" | "DIRECT_TOPUP";
  offers: Offer[];
}

export default function StorePage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<{ products: ApiProduct[] }>("/catalog/products");
        setProducts(response.data.products);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Store</h1>
        <p className="text-sm text-saleh-textMuted">Browse all digital products and choose the best available offer.</p>
      </header>

      {loading ? (
        <p className="text-saleh-textMuted">Loading products...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-saleh-textMuted">No products available right now.</p>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                image: product.image,
                basePrice: product.basePrice,
                productType: product.productType,
                offers: product.offers.map((offer) => ({
                  merchantId: typeof offer.merchant === "string" ? offer.merchant : offer.merchant._id,
                  merchantName:
                    typeof offer.merchant === "string"
                      ? "Merchant"
                      : offer.merchant.fullName || offer.merchant.username || "Merchant",
                  price: offer.price,
                  isActive: offer.isActive
                }))
              }}
            />
          ))}
        </section>
      )}
    </div>
  );
}
