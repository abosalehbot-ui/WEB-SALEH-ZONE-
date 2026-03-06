import { create } from "zustand";

import api from "@/lib/axios";

export type UserRole = "SuperAdmin" | "Merchant" | "Employee" | "Customer";
export type MerchantTier = "None" | "Silver" | "Gold";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  role: UserRole;
  walletBalance?: number;
  merchantTier?: MerchantTier;
}

type RegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type TelegramAuthPayload = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
};

type AuthApiResponse = {
  message?: string;
  token?: string;
  user?: Record<string, unknown>;
};

interface UserStoreState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithTelegram: (payload: TelegramAuthPayload) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const normalizeRole = (role: unknown): UserRole => {
  if (role === "SuperAdmin" || role === "Merchant" || role === "Employee" || role === "Customer") {
    return role;
  }

  return "Customer";
};

const normalizeMerchantTier = (merchantTier: unknown): MerchantTier => {
  if (merchantTier === "Silver" || merchantTier === "Gold" || merchantTier === "None") {
    return merchantTier;
  }

  return "None";
};

const normalizeUser = (rawUser: Record<string, unknown> | undefined): UserProfile | null => {
  if (!rawUser) {
    return null;
  }

  const idValue = rawUser.id ?? rawUser._id;

  if (typeof idValue !== "string" || typeof rawUser.email !== "string") {
    return null;
  }

  return {
    id: idValue,
    email: rawUser.email,
    username: typeof rawUser.username === "string" ? rawUser.username : undefined,
    fullName: typeof rawUser.fullName === "string" ? rawUser.fullName : undefined,
    role: normalizeRole(rawUser.role),
    walletBalance: typeof rawUser.walletBalance === "number" ? rawUser.walletBalance : undefined,
    merchantTier: normalizeMerchantTier(rawUser.merchantTier)
  };
};

const applyAuthenticatedUser = (
  set: (partial: Partial<UserStoreState>) => void,
  rawUser: Record<string, unknown> | undefined
) => {
  const user = normalizeUser(rawUser);

  set({
    user,
    isAuthenticated: Boolean(user),
    isLoading: false
  });
};

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false
    }),

  register: async (payload) => {
    set({ isLoading: true });

    try {
      const response = await api.post<AuthApiResponse>("/auth/register", payload);
      applyAuthenticatedUser(set, response.data.user);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (payload) => {
    set({ isLoading: true });

    try {
      const response = await api.post<AuthApiResponse>("/auth/login", payload);
      applyAuthenticatedUser(set, response.data.user);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async (credential) => {
    set({ isLoading: true });

    try {
      const response = await api.post<AuthApiResponse>("/auth/google", { credential });
      applyAuthenticatedUser(set, response.data.user);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithTelegram: async (payload) => {
    set({ isLoading: true });

    try {
      const response = await api.post<AuthApiResponse>("/auth/telegram", payload);
      applyAuthenticatedUser(set, response.data.user);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMe: async () => {
    set({ isLoading: true });

    try {
      const response = await api.get<AuthApiResponse>("/auth/me");
      applyAuthenticatedUser(set, response.data.user);
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await api.post("/auth/logout");
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }
}));
