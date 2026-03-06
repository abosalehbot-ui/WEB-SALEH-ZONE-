import { FloatingCartButton } from "@/components/storefront/FloatingCartButton";
import { FloatingProfileButton } from "@/components/storefront/FloatingProfileButton";
import { StoreSidebar } from "@/components/storefront/StoreSidebar";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-4 px-4 py-6 sm:px-6">
      <StoreSidebar />
      <section className="min-w-0 flex-1">{children}</section>
      <FloatingCartButton />
      <FloatingProfileButton />
      <CartDrawer />
    </div>
  );
}
