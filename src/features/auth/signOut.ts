import { secureTokenStorage } from "@/lib/auth/secureStorage";
import { useAuthStore } from "@/stores/authStore";

export async function signOut() {
  await secureTokenStorage.clear();
  useAuthStore.getState().clearSession();
}