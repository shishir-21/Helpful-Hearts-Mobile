import axios from "axios";
import { env } from "@/config/env";

export const apiClient = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});