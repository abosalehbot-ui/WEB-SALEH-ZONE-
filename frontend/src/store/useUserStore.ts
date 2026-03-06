import { create } from "zustand";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  role: "SuperAdmin" | "Merchant" | "Employee" | "Customer";
  merchantTier?: "None" | "Silver" | "Gold";
}

interface UserStoreState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

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
  login: async () => {
    set({ isLoading: true });
    // TODO: connect to auth API in next step.
    set({ isLoading: false });
  },
  logout: async () => {
    set({ isLoading: true });
    // TODO: connect to auth API in next step.
    set({ user: null, isAuthenticated: false, isLoading: false });
  }
}));
