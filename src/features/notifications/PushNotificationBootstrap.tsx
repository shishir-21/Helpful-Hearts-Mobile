import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { registerForPushNotifications } from "./register";
import { unregisterPushToken } from "./api";
import { reportError } from "@/lib/telemetry";

export function PushNotificationBootstrap() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registeredToken = useRef<string | null>(null);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    let cancelled = false;

    registerForPushNotifications()
      .then((token) => {
        if (!cancelled) registeredToken.current = token;
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          reportError(
            error instanceof Error
              ? error
              : new Error("Push notification registration failed"),
          );
        }
      });

    return () => {
      cancelled = true;
      const token = registeredToken.current;
      registeredToken.current = null;

      if (!token) return;

      unregisterPushToken(token).catch((error: unknown) => {
        reportError(
          error instanceof Error
            ? error
            : new Error("Push notification unregister failed"),
        );
      });
    };
  }, [isHydrated, isAuthenticated]);

  return null;
}
