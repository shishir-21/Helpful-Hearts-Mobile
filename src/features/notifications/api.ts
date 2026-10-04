import { z } from "zod";
import { apiClient } from "@/lib/api/client";

const registrationResponseSchema = z.object({
  id: z.string(),
  platform: z.enum(["ios", "android"]),
  device_token: z.string(),
  enabled: z.boolean(),
});

export type NotificationRegistration = z.infer<typeof registrationResponseSchema>;

export async function registerPushToken(
  platform: "ios" | "android",
  deviceToken: string,
): Promise<NotificationRegistration> {
  const { data } = await apiClient.post("/notifications/devices", {
    platform,
    device_token: deviceToken,
  });
  return registrationResponseSchema.parse(data);
}

export async function unregisterPushToken(deviceToken: string): Promise<void> {
  await apiClient.delete("/notifications/devices", {
    data: { device_token: deviceToken },
  });
}
