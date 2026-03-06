"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useUserStore } from "@/store/useUserStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"SuperAdmin" | "Merchant" | "Employee" | "Customer">;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, isHydrated, fetchMe } = useUserStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    isHydrated: state.isHydrated,
    fetchMe: state.fetchMe
  }));

  useEffect(() => {
    if (!isHydrated) {
      void fetchMe();
    }
  }, [fetchMe, isHydrated]);

  const isAuthorized = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (!user) {
      return false;
    }

    return allowedRoles.includes(user.role);
  }, [allowedRoles, user]);

  useEffect(() => {
    if (isLoading || !isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAuthorized) {
      router.replace("/");
    }
  }, [isAuthenticated, isAuthorized, isLoading, isHydrated, router]);

  if (isLoading || !isHydrated || !isAuthenticated || !isAuthorized) {
    return <div className="flex min-h-[40vh] items-center justify-center text-saleh-textMuted">Loading...</div>;
  }

  return <>{children}</>;
}
