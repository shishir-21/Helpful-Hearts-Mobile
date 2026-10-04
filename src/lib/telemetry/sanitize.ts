const SENSITIVE_KEYS = new Set([
  "content",
  "ocr_text",
  "explanation",
  "prescription",
  "prescriptions",
  "conversation",
  "messages",
  "message",
  "reason",
  "diagnosis",
  "medication",
  "medications",
  "symptoms",
  "notes",
  "phone",
  "email",
  "address",
]);

export function sanitizeTelemetryProperties(
  properties: Record<string, unknown> = {},
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key, value]) => !SENSITIVE_KEYS.has(key.toLowerCase()) && value !== undefined)
      .map(([key, value]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          return [key, value];
        }
        return [key, String(value)];
      }),
  );
}
