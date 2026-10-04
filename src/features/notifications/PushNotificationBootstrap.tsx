import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { registerForPushNotifications } from "./register";
import { reportError } from "@/lib/telemetry";

export function PushNotificationBootstrap() {
  const { isHydrated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    let cancelled = false;

    registerForPushNotifications().catch((error: unknown) => {
      if (!cancelled) {
        reportError(error instanceof Error ? error : new Error("Push notification registration failed"));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, isAuthenticated]);

  return null;
}
