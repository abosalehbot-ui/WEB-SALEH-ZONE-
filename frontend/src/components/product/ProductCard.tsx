"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { BuyNowModal } from "@/components/storefront/BuyNowModal";
import { PurchaseSuccessModal } from "@/components/storefront/PurchaseSuccessModal";
import api from "@/lib/axios";
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
  const [buyOpen, setBuyOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");

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

  const handleQuickBuy = async () => {
    if (!bestOffer) return;

    setProcessing(true);
    try {
      const response = await api.post<{ order: { orderId: string } }>("/orders/checkout", {
        items: [{ productId: product.id, merchantId: bestOffer.merchantId, quantity: 1 }]
      });
      setBuyOpen(false);
      setSuccessOrderId(response.data.order.orderId);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <article className="saleh-glass overflow-hidden rounded-2xl border border-saleh-border shadow-sm">
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-[16/10] w-full bg-saleh-card">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
        </Link>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-saleh-primary/15 px-2.5 py-1 text-xs font-semibold text-saleh-primary">
              {typeLabel}
            </span>
            <Link href={`/product/${product.id}`} className="block text-lg font-bold text-saleh-text hover:text-saleh-primary">
              {product.name}
            </Link>
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

          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full" onClick={handleAddToCart} disabled={!bestOffer}>Add to Cart</Button>
            <Button className="w-full" variant="outline" onClick={() => setBuyOpen(true)} disabled={!bestOffer}>Buy Now</Button>
          </div>
        </div>
      </article>

      <BuyNowModal
        open={buyOpen}
        productName={product.name}
        price={lowestPrice}
        onClose={() => setBuyOpen(false)}
        onConfirm={handleQuickBuy}
        loading={processing}
      />
      <PurchaseSuccessModal open={Boolean(successOrderId)} orderId={successOrderId} onClose={() => setSuccessOrderId("")} />
    </>
  );
}
