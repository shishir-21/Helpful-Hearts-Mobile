import { create } from "zustand";
import type { User } from "@/features/auth/types";

type AuthState = {
  user: User | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  setSession: (user: User) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  isAuthenticated: false,
  setSession: (user) => set({ user, isAuthenticated: true }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
  setHydrated: (value) => set({ isHydrated: value }),
}));