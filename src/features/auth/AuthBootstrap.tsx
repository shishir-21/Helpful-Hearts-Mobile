import { useEffect } from "react";
import { getCurrentUser } from "./api";
import { secureTokenStorage } from "@/lib/auth/secureStorage";
import { useAuthStore } from "@/stores/authStore";

export function AuthBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      try {
        const token = await secureTokenStorage.getAccessToken();
        if (!token) return;
        const user = await getCurrentUser();
        if (mounted) setSession(user);
      } catch {
        await secureTokenStorage.clear();
        if (mounted) clearSession();
      } finally {
        if (mounted) setHydrated(true);
      }
    }
    hydrate();
    return () => { mounted = false; };
  }, [clearSession, setHydrated, setSession]);

  return null;
}