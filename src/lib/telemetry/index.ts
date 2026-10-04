import { sanitizeTelemetryProperties } from "./sanitize";

export type AnalyticsEvent =
  | "app_started"
  | "screen_viewed"
  | "authentication_completed"
  | "doctor_search_used"
  | "appointment_created"
  | "prescription_upload_started"
  | "assistant_opened"
  | "consultation_waiting_room_opened";

type AnalyticsProperties = Record<string, unknown>;

const analyticsEnabled = process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === "true";

export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  if (!analyticsEnabled) return;

  const safeProperties = sanitizeTelemetryProperties(properties);
  if (__DEV__) {
    console.info("[analytics]", event, safeProperties);
  }

  // Intentionally provider-neutral. A production analytics SDK can be wired here
  // without exposing healthcare data to a third-party provider by default.
}

export function reportError(error: Error, context?: Record<string, unknown>): void {
  const safeContext = sanitizeTelemetryProperties(context);

  if (__DEV__) {
    console.error("[error]", error.name, error.message, safeContext);
  }

  // Intentionally provider-neutral. Crash monitoring is opt-in and must receive
  // only sanitized metadata.
}
