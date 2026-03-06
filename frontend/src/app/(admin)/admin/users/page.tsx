"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import api from "@/lib/axios";

interface User { _id: string; fullName?: string; username?: string; email: string; role: string; walletBalance: number }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { void api.get<{ users: User[] }>("/admin/users").then((r) => setUsers(r.data.users)); }, []);

  return (
    <ProtectedRoute allowedRoles={["SuperAdmin"]}>
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-saleh-primary">Users</h1>
        <div className="overflow-x-auto rounded-xl border border-saleh-border bg-saleh-surface">
          <table className="min-w-full text-right text-sm"><thead className="bg-saleh-card text-saleh-textMuted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Wallet</th></tr></thead><tbody>{users.map((u) => <tr key={u._id} className="border-t border-saleh-border/70 text-saleh-text"><td className="px-4 py-3">{u.fullName || u.username || "-"}</td><td className="px-4 py-3">{u.email}</td><td className="px-4 py-3">{u.role}</td><td className="px-4 py-3">${u.walletBalance.toFixed(2)}</td></tr>)}</tbody></table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
