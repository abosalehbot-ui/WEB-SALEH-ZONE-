"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useUserStore((state) => state.register);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await register({ fullName, username, email, password });
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <form onSubmit={onSubmit} className="saleh-glass space-y-3 rounded-xl border border-saleh-border p-6">
        <h1 className="text-2xl font-black text-saleh-primary">Register</h1>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" />
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="h-10 w-full rounded-lg border border-saleh-border bg-saleh-surface px-3 text-saleh-text" />
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
    </div>
  );
}
