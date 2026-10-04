import Constants from "expo-constants";
import { z } from "zod";

const envSchema = z.object({ EXPO_PUBLIC_API_URL: z.string().url() });
const source = {
  EXPO_PUBLIC_API_URL:
    process.env.EXPO_PUBLIC_API_URL ?? Constants.expoConfig?.extra?.apiUrl ?? "",
};
const parsed = envSchema.safeParse(source);
if (!parsed.success) {
  throw new Error("Invalid mobile environment. Set EXPO_PUBLIC_API_URL to the Helpful-Hearts API base URL.");
}
export const env = parsed.data;