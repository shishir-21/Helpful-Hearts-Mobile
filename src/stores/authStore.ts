import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuthenticated: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isHydrated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setHydrated: (value) => set({ isHydrated: value }),
}));