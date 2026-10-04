import axios from "axios";
import { env } from "@/config/env";
import { secureTokenStorage } from "@/lib/auth/secureStorage";

export const apiClient = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await secureTokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});