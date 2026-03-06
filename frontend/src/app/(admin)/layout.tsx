import Link from "next/link";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/merchant", label: "Merchant" },
  { href: "/merchant/products", label: "Merchant Products" },
  { href: "/employee", label: "Employee" }
];

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["SuperAdmin", "Merchant", "Employee"]}>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl gap-4 px-4 py-6 sm:px-6">
        <aside className="order-1 w-64 shrink-0 rounded-xl border border-saleh-border bg-saleh-surface p-4">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-saleh-textMuted">Control Panel</h2>
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-saleh-text transition-colors hover:bg-saleh-card hover:text-saleh-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="order-2 min-w-0 flex-1 rounded-xl border border-saleh-border bg-saleh-surface p-4 sm:p-6">
          {children}
        </section>
      </div>
    </ProtectedRoute>
  );
}
