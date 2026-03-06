"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { CartItem, useCartStore } from "@/store/useCartStore";

interface ProductOffer {
  merchantId: string;
  merchantName: string;
  price: number;
  isActive: boolean;
}

interface ProductCardData {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  productType: "PIN_BASED" | "DIRECT_TOPUP";
  offers: ProductOffer[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const bestOffer = useMemo(() => {
    const activeOffers = product.offers.filter((offer) => offer.isActive);
    if (activeOffers.length === 0) {
      return null;
    }

    return [...activeOffers].sort((a, b) => a.price - b.price)[0];
  }, [product.offers]);

  const lowestPrice = bestOffer?.price ?? product.basePrice;
  const typeLabel = product.productType === "PIN_BASED" ? "Digital PIN" : "Direct Top-up";

  const handleAddToCart = () => {
    if (!bestOffer) {
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      merchantId: bestOffer.merchantId,
      quantity: 1,
      price: bestOffer.price,
      name: product.name
    };

    addItem(cartItem);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-saleh-border bg-saleh-surface shadow-sm">
      <div className="aspect-[16/10] w-full bg-saleh-card">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-saleh-primary/15 px-2.5 py-1 text-xs font-semibold text-saleh-primary">
            {typeLabel}
          </span>
          <h3 className="text-lg font-bold text-saleh-text">{product.name}</h3>
        </div>

        <div className="space-y-1 text-sm text-saleh-textMuted">
          <p className="text-2xl font-black text-saleh-secondary">${lowestPrice.toFixed(2)}</p>
          {bestOffer ? (
            <p>
              Available from <span className="font-semibold text-saleh-text">{bestOffer.merchantName}</span> for ${bestOffer.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-red-400">No active offers available.</p>
          )}
        </div>

        <Button className="w-full" onClick={handleAddToCart} disabled={!bestOffer}>
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
