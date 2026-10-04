import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/stores/authStore";

export default function AuthenticatedLayout() {
  const { isHydrated, isAuthenticated } = useAuthStore();
  if (!isHydrated) return null;
  if (!isAuthenticated) return <Redirect href="/(public)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}