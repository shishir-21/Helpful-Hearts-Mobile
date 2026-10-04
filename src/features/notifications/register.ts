import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { registerPushToken } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === "web") return null;

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== "granted") return null;

  const projectId = Constants.easConfig?.projectId;
  if (!projectId) {
    throw new Error("EAS project ID is required for push notifications.");
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  const deviceToken = token.data;

  await registerPushToken(Platform.OS === "ios" ? "ios" : "android", deviceToken);
  return deviceToken;
}
