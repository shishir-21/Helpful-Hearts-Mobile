import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { reportError } from "@/lib/telemetry";
import { unregisterPushToken } from "./api";
import { getNotificationRoute } from "./navigation";
import { registerForPushNotifications } from "./register";

export function PushNotificationBootstrap() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registeredToken = useRef<string | null>(null);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    let cancelled = false;

    const openNotificationRoute = (response: Notifications.NotificationResponse) => {
      const route = getNotificationRoute(response.notification.request.content.data);
      if (route) router.push(route);
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(openNotificationRoute);

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!cancelled && response) openNotificationRoute(response);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          reportError(
            error instanceof Error
              ? error
              : new Error("Notification response lookup failed"),
          );
        }
      });

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
      subscription.remove();

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
