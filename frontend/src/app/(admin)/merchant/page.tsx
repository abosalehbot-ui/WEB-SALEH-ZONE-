const merchantStats = [
  { label: "My Revenue", value: "$8,940", delta: "+9.8%" },
  { label: "Active Offers", value: "42", delta: "+6.3%" },
  { label: "Units Sold", value: "1,386", delta: "+14.1%" },
  { label: "Pending Payouts", value: "$1,275", delta: "Due in 2 days" }
];

export default function MerchantOverviewPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">Merchant Dashboard</h1>
        <p className="text-sm text-saleh-textMuted">Track your offer performance, payouts, and revenue growth.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {merchantStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-saleh-border bg-saleh-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          >
            <p className="text-sm text-saleh-textMuted">{stat.label}</p>
            <p className="mt-3 text-3xl font-black text-saleh-primary">{stat.value}</p>
            <p className="mt-2 text-xs text-saleh-secondary">{stat.delta}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
