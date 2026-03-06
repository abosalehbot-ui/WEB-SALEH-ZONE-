import { Button } from "@/components/ui/Button";

interface EmployeeChatPageProps {
  params: {
    ticketId: string;
  };
}

const mockMessages = [
  {
    id: 1,
    sender: "Customer",
    text: "Here is my ID: 12345"
  },
  {
    id: 2,
    sender: "Employee",
    text: "Processing now..."
  },
  {
    id: 3,
    sender: "Customer",
    text: "Thank you!"
  }
];

export default function EmployeeChatPage({ params }: EmployeeChatPageProps) {
  return (
    <div className="grid min-h-[calc(100vh-14rem)] grid-cols-1 gap-4 lg:grid-cols-3">
      <aside className="rounded-xl border border-saleh-border bg-saleh-surface p-4 lg:col-span-1">
        <h1 className="text-xl font-black text-saleh-primary">Ticket Details</h1>
        <div className="mt-4 space-y-3 text-sm text-saleh-text">
          <p>
            <span className="text-saleh-textMuted">Ticket ID:</span> {params.ticketId}
          </p>
          <p>
            <span className="text-saleh-textMuted">Product:</span> PUBG 600 UC (ID)
          </p>
          <p>
            <span className="text-saleh-textMuted">Player ID:</span> 12345
          </p>
          <p>
            <span className="text-saleh-textMuted">Customer:</span> Ahmed
          </p>
        </div>

        <Button className="mt-6 w-full">Fulfill Order</Button>
      </aside>

      <section className="flex min-h-[28rem] flex-col rounded-xl border border-saleh-border bg-saleh-surface lg:col-span-2">
        <div className="border-b border-saleh-border px-4 py-3">
          <h2 className="font-semibold text-saleh-text">Live Chat</h2>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {mockMessages.map((message) => {
            const isEmployee = message.sender === "Employee";

            return (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-xl border border-saleh-border bg-saleh-card p-3 text-sm ${
                  isEmployee ? "mr-auto text-right" : "ml-auto text-right"
                }`}
              >
                <p className="mb-1 text-xs text-saleh-textMuted">{message.sender}</p>
                <p className="text-saleh-text">{message.text}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-saleh-border p-3">
          <form className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Send
            </Button>
            <input
              type="text"
              placeholder="Type a message..."
              className="h-10 flex-1 rounded-lg border border-saleh-border bg-saleh-card px-3 text-sm text-saleh-text placeholder:text-saleh-textMuted focus:border-saleh-primary focus:outline-none"
            />
          </form>
        </div>
      </section>
    </div>
  );
}
