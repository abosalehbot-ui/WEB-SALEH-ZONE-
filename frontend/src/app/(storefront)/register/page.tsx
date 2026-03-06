"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useUserStore((state) => state.register);
  const isLoading = useUserStore((state) => state.isLoading);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError("");
      await register({ fullName, username, email, password });
      router.push("/");
    } catch {
      setError("Unable to create account");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <form onSubmit={onSubmit} className="saleh-glass space-y-3 rounded-xl border border-saleh-border p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Register</h1>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>Create Account</Button>

        <div className="my-4 flex items-center gap-3 text-xs text-saleh-textMuted">
          <span className="h-px flex-1 bg-saleh-border" />
          <span>or continue with</span>
          <span className="h-px flex-1 bg-saleh-border" />
        </div>

        <SocialAuthButtons />
      </form>
    </div>
  );
}
