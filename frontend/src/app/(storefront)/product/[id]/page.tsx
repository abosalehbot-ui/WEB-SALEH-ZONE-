"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import api from "@/lib/axios";

interface OfferItem {
  merchant: string;
  merchantId: string;
  price: number;
  stock: string;
}

interface ProductPayload {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  offers: Array<{ merchant: { _id: string; fullName?: string; username?: string }; price: number; isActive: boolean }>;
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<ProductPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<{ product: ProductPayload }>(`/catalog/products/${params.id}`);
      setProduct(response.data.product);
    };

    if (params.id) void load();
  }, [params.id]);

  const offersSorted = useMemo<OfferItem[]>(() => {
    if (!product) return [];

    return product.offers
      .filter((offer) => offer.isActive)
      .map((offer) => ({
        merchant: offer.merchant.fullName || offer.merchant.username || "Merchant",
        merchantId: offer.merchant._id,
        price: offer.price,
        stock: "In Stock"
      }))
      .sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price);
  }, [product]);

  const bestOffer = offersSorted[0];
  const [selectedMerchant, setSelectedMerchant] = useState<string>("");

  useEffect(() => {
    if (bestOffer) setSelectedMerchant(bestOffer.merchant);
  }, [bestOffer]);

  const selectedOffer = offersSorted.find((offer) => offer.merchant === selectedMerchant) ?? bestOffer;

  const handleAddToCart = () => {
    if (!product || !selectedOffer) return;

    addItem({
      productId: product._id,
      merchantId: selectedOffer.merchantId,
      quantity: 1,
      price: selectedOffer.price,
      name: product.name
    });
  };

  if (!product || !selectedOffer) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-saleh-textMuted">Loading product...</div>;
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
      <section className="rounded-xl border border-saleh-border bg-saleh-card p-5 lg:col-span-2">
        <img src={product.image || "https://placehold.co/800x450"} alt={product.name} className="mb-4 aspect-[16/9] w-full rounded-lg border border-saleh-border object-cover" />
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">{product.name}</h1>
        <p className="mt-4 text-sm leading-7 text-saleh-textMuted">{product.description || "No description available"}</p>
      </section>

      <aside className="rounded-xl border border-saleh-border bg-saleh-card p-5">
        <h2 className="text-lg font-black text-saleh-primary">Buy Box</h2>

        <div className="mt-4 space-y-2">
          {offersSorted.map((offer, index) => {
            const isSelected = selectedMerchant === offer.merchant;
            const isBest = index === 0;

            return (
              <button
                key={offer.merchant}
                type="button"
                onClick={() => setSelectedMerchant(offer.merchant)}
                className={`w-full rounded-lg border p-3 text-right transition-colors ${
                  isSelected ? "border-saleh-primary bg-saleh-primary/10" : "border-saleh-border bg-saleh-surface hover:border-saleh-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-saleh-text">{offer.merchant}</span>
                  <span className="font-black text-saleh-secondary">${offer.price.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-saleh-textMuted">
                  <span>{offer.stock}</span>
                  {isBest && <span className="rounded-full bg-saleh-primary/20 px-2 py-0.5 text-saleh-primary">Best Offer</span>}
                </div>
              </button>
            );
          })}
        </div>

        <Button className="mt-4 w-full" onClick={handleAddToCart}>Add to Cart</Button>
      </aside>
    </div>
  );
}
