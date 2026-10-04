import { getCurrentUser } from "@/features/auth/api";
import type { User } from "@/features/auth/types";

export async function getPatientProfile(): Promise<User> {
  return getCurrentUser();
}
