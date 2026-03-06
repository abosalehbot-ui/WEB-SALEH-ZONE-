import { Button } from "@/components/ui/Button";

interface MerchantProductOffer {
  id: string;
  name: string;
  type: "PIN_BASED" | "DIRECT_TOPUP";
  basePrice: number;
  myPrice: number;
  isActive: boolean;
}

const mockOffers: MerchantProductOffer[] = [
  {
    id: "1",
    name: "Valorant 1000 VP",
    type: "PIN_BASED",
    basePrice: 10,
    myPrice: 9.5,
    isActive: true
  },
  {
    id: "2",
    name: "PUBG UC 660",
    type: "DIRECT_TOPUP",
    basePrice: 9.99,
    myPrice: 9.49,
    isActive: true
  },
  {
    id: "3",
    name: "Steam Wallet Code $20",
    type: "PIN_BASED",
    basePrice: 20,
    myPrice: 18.9,
    isActive: false
  }
];

export default function MerchantProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-saleh-primary">My Product Offers</h1>
          <p className="text-sm text-saleh-textMuted">Manage Buy Box pricing and offer activity across your catalog.</p>
        </div>
        <Button className="sm:w-auto">Add New Offer</Button>
      </header>

      <div className="overflow-hidden rounded-xl border border-saleh-border bg-saleh-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-saleh-surface text-saleh-textMuted">
              <tr>
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">MSRP (Base Price)</th>
                <th className="px-4 py-3 font-semibold">My Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOffers.map((offer) => (
                <tr key={offer.id} className="border-t border-saleh-border/70 text-saleh-text">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{offer.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-saleh-textMuted">{offer.type}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-saleh-textMuted">${offer.basePrice.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-saleh-secondary">${offer.myPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        offer.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {offer.isActive ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Update Price
                      </Button>
                      <Button size="sm" variant="ghost" className="text-amber-300 hover:bg-amber-500/10">
                        Pause Offer
                      </Button>
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
