"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/Button";

interface OfferItem {
  merchant: string;
  price: number;
  stock: string;
}

const mockOffers: OfferItem[] = [
  { merchant: "FastPay", price: 9.5, stock: "In Stock" },
  { merchant: "SalehOfficial", price: 10, stock: "Instant PIN" },
  { merchant: "UltraTopup", price: 9.75, stock: "In Stock" }
];

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();

  const offersSorted = useMemo(
    () => [...mockOffers].sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price),
    []
  );

  const bestOffer = offersSorted[0];
  const [selectedMerchant, setSelectedMerchant] = useState<string>(bestOffer.merchant);

  const selectedOffer = offersSorted.find((offer) => offer.merchant === selectedMerchant) ?? bestOffer;

  const handleAddToCart = () => {
    console.log("Add to Cart", {
      merchant: selectedOffer.merchant,
      price: selectedOffer.price,
      id: params.id
    });
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
      <section className="rounded-xl border border-saleh-border bg-saleh-card p-5 lg:col-span-2">
        <div className="mb-4 aspect-[16/9] w-full rounded-lg border border-saleh-border bg-saleh-surface" />
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">PUBG 600 UC</h1>
        <p className="mt-4 text-sm leading-7 text-saleh-textMuted">
          Secure and instant PUBG UC top-up for your account. Select your preferred merchant offer from the Buy Box
          and complete your purchase in seconds.
        </p>
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
                  isSelected
                    ? "border-saleh-primary bg-saleh-primary/10"
                    : "border-saleh-border bg-saleh-surface hover:border-saleh-primary/40"
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

        <div className="mt-5 rounded-lg border border-saleh-border bg-saleh-surface p-3 text-sm text-saleh-text">
          <p>
            Available from <span className="font-bold text-saleh-primary">{selectedOffer.merchant}</span> for
            <span className="mr-1 font-black text-saleh-secondary">${selectedOffer.price.toFixed(2)}</span>
          </p>
        </div>

        <Button className="mt-4 w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </aside>
    </div>
  );
}
