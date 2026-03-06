const stats = [
  {
    label: "Total Revenue",
    value: "$15,231",
    delta: "+12.4%"
  },
  {
    label: "Active Users",
    value: "1,204",
    delta: "+8.1%"
  },
  {
    label: "Pending Orders",
    value: "87",
    delta: "-3.2%"
  },
  {
    label: "Active Merchants",
    value: "63",
    delta: "+5.7%"
  }
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-saleh-primary sm:text-3xl">SuperAdmin Dashboard</h1>
        <p className="text-sm text-saleh-textMuted">Live overview of marketplace performance and operational health.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-saleh-border bg-saleh-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          >
            <p className="text-sm text-saleh-textMuted">{stat.label}</p>
            <p className="mt-3 text-3xl font-black text-saleh-primary">{stat.value}</p>
            <p className="mt-2 text-xs text-saleh-secondary">{stat.delta} from last month</p>
          </article>
        ))}
      </section>
    </div>
  );
}
