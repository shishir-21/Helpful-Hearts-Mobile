import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { queryClient } from "@/lib/query/queryClient";
import { AuthBootstrap } from "@/features/auth/AuthBootstrap";

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <AuthBootstrap />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}