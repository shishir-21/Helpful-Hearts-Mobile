export function getNotificationRoute(
  data: Record<string, unknown> | null | undefined,
): string | null {
  if (data?.type !== "appointment_reminder") return null;

  const appointmentId = data.appointment_id;
  if (typeof appointmentId !== "string" || appointmentId.length === 0) return null;

  return `/(auth)/appointments/${appointmentId}`;
}
