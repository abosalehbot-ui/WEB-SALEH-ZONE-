import { Button } from "@/components/ui/Button";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

const mockCategories: CategoryItem[] = [
  { id: "1", name: "Steam Gift Cards", slug: "steam-gift-cards", isActive: true },
  { id: "2", name: "PUBG UC", slug: "pubg-uc", isActive: true },
  { id: "3", name: "PlayStation Network", slug: "playstation-network", isActive: true },
  { id: "4", name: "Xbox Live", slug: "xbox-live", isActive: false }
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-saleh-primary">Category Management</h1>
          <p className="text-sm text-saleh-textMuted">Manage storefront categories and publishing visibility.</p>
        </div>
        <Button className="sm:w-auto">Add New Category</Button>
      </header>

      <div className="overflow-hidden rounded-xl border border-saleh-border bg-saleh-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-saleh-surface text-saleh-textMuted">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCategories.map((category) => (
                <tr key={category.id} className="border-t border-saleh-border/70 text-saleh-text">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{category.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-saleh-textMuted">{category.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        category.isActive
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-300 hover:bg-rose-500/10">
                        Delete
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
