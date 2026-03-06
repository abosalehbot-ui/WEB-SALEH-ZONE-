"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);
  const [email, setEmail] = useState("user@saleh.zone");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError("");
      await login({ email, password });
      router.push("/");
    } catch (_err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-10 sm:px-6">
      <div className="w-full rounded-xl border border-saleh-border bg-saleh-card p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Login</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Use seeded account: user@saleh.zone / 12345678</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button className="w-full" size="lg" type="submit" disabled={isLoading}>Login</Button>
        </form>
      </div>
    </div>
  );
}
