import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-10 sm:px-6">
      <div className="w-full rounded-xl border border-saleh-border bg-saleh-card p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Login</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Sign in to access your orders, wallet, and PIN vault.</p>

        <form className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text placeholder:text-saleh-textMuted focus:border-saleh-primary focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text placeholder:text-saleh-textMuted focus:border-saleh-primary focus:outline-none"
          />
          <Button className="w-full" size="lg">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
