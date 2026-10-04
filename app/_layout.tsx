import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { AuthBootstrap } from "@/features/auth/AuthBootstrap";
import { PushNotificationBootstrap } from "@/features/notifications";
import { queryClient } from "@/lib/query/queryClient";
import { trackEvent } from "@/lib/telemetry";

export default function RootLayout() {
  trackEvent("app_started");

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <AuthBootstrap />
        <PushNotificationBootstrap />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}