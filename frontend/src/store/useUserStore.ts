import { create } from "zustand";

import api from "@/lib/axios";

export interface UserProfile {
  _id: string;
  email: string;
  username?: string;
  fullName?: string;
  role: "SuperAdmin" | "Merchant" | "Employee" | "Customer";
  merchantTier?: "None" | "Silver" | "Gold";
  walletBalance?: number;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

interface TelegramPayload {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}

interface UserStoreState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  fetchMe: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithTelegram: (payload: TelegramPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const setAuthenticatedUser = (set: (state: Partial<UserStoreState>) => void, user: UserProfile) => {
  set({ user, isAuthenticated: true, isLoading: false, isHydrated: true });
};

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  setUser: (user) => setAuthenticatedUser(set, user),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: true
    }),
  fetchMe: async () => {
    set({ isLoading: true });

    try {
      const response = await api.get<{ user: UserProfile }>("/auth/me");
      setAuthenticatedUser(set, response.data.user);
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false, isHydrated: true });
    }
  },
  login: async (payload) => {
    set({ isLoading: true });
    const response = await api.post<{ user: UserProfile }>("/auth/login", payload);
    setAuthenticatedUser(set, response.data.user);
  },
  register: async (payload) => {
    set({ isLoading: true });
    const response = await api.post<{ user: UserProfile }>("/auth/register", payload);
    setAuthenticatedUser(set, response.data.user);
  },
  loginWithGoogle: async (credential) => {
    set({ isLoading: true });
    const response = await api.post<{ user: UserProfile }>("/auth/google", { credential });
    setAuthenticatedUser(set, response.data.user);
  },
  loginWithTelegram: async (payload) => {
    set({ isLoading: true });
    const response = await api.post<{ user: UserProfile }>("/auth/telegram", payload);
    setAuthenticatedUser(set, response.data.user);
  },
  logout: async () => {
    set({ isLoading: true });
    await api.post("/auth/logout");
    set({ user: null, isAuthenticated: false, isLoading: false, isHydrated: true });
  }
}));
