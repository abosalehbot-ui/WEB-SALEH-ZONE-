"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [devToken, setDevToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError("");
      const response = await api.post<{ message: string; devResetToken?: string }>("/auth/forgot-password", { email });
      setMessage(response.data.message);
      setDevToken(response.data.devResetToken || "");
    } catch {
      setError("Unable to process forgot password request");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <form onSubmit={onSubmit} className="saleh-glass space-y-3 rounded-xl border border-saleh-border p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Forgot Password</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        {message && <p className="text-sm text-emerald-400">{message}</p>}
        {devToken && <p className="text-xs text-saleh-accent">Dev reset token: {devToken}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full">Request Reset</Button>

        <Link href="/reset-password" className="block text-center text-xs text-saleh-textMuted hover:text-saleh-primary">I already have reset token</Link>
      </form>
    </div>
  );
}
