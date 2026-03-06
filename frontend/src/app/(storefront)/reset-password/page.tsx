"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    const tokenFromQuery = searchParams.get("token");

    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }

    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    }
  }, [searchParams]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      const response = await api.post<{ message: string }>("/auth/reset-password", { email, token, newPassword });
      setMessage(response.data.message);
      setToken("");
      setNewPassword("");
    } catch {
      setError("Invalid or expired token");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <form onSubmit={onSubmit} className="saleh-glass space-y-3 rounded-xl border border-saleh-border p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Reset Password</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Reset token" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" required />
        {message && <p className="text-sm text-emerald-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full">Reset Password</Button>
      </form>
    </div>
  );
}
