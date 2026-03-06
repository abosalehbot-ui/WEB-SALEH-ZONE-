import { Button } from "@/components/ui/Button";

interface QueueOrder {
  id: string;
  product: string;
  customer: string;
  date: string;
  status: "Pending" | "In Progress";
}

const mockQueue: QueueOrder[] = [
  {
    id: "ORD-123",
    product: "PUBG 600 UC (ID)",
    customer: "Ahmed",
    date: "2026-03-05 14:22",
    status: "Pending"
  },
  {
    id: "ORD-127",
    product: "Free Fire 530 Diamonds",
    customer: "Sara",
    date: "2026-03-05 15:10",
    status: "In Progress"
  },
  {
    id: "ORD-131",
    product: "Mobile Legends Weekly Pass",
    customer: "Yousef",
    date: "2026-03-05 15:45",
    status: "Pending"
  }
];

export default function EmployeeQueuePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Fulfillment Center</h1>
        <p className="text-sm text-saleh-textMuted">Orders requiring manual intervention and live customer support.</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-saleh-border bg-saleh-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-saleh-surface text-saleh-textMuted">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockQueue.map((order) => (
                <tr key={order.id} className="border-t border-saleh-border/70 text-saleh-text">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{order.id}</td>
                  <td className="whitespace-nowrap px-4 py-3">{order.product}</td>
                  <td className="whitespace-nowrap px-4 py-3">{order.customer}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-saleh-textMuted">{order.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-sky-500/15 text-sky-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline">
                      Open Ticket
                    </Button>
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
