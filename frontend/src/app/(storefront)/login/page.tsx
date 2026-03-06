"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
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
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-10 sm:px-6">
      <div className="saleh-glass w-full rounded-xl border border-saleh-border p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Login</h1>
        <p className="mt-2 text-sm text-saleh-textMuted">Use seeded account: user@saleh.zone / 12345678</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text" required />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="h-11 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-sm text-saleh-text" required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button className="w-full" size="lg" type="submit" disabled={isLoading}>Login</Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-saleh-textMuted">
          <span className="h-px flex-1 bg-saleh-border" />
          <span>or continue with</span>
          <span className="h-px flex-1 bg-saleh-border" />
        </div>

        <SocialAuthButtons />

        <div className="mt-4 flex justify-between text-xs text-saleh-textMuted">
          <Link href="/register" className="hover:text-saleh-primary">Create account</Link>
          <Link href="/forgot-password" className="hover:text-saleh-primary">Forgot password</Link>
        </div>
      </div>
    </div>
  );
}
