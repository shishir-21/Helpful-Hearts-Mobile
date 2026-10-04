import type { Appointment } from "@/features/appointments/types";

export type ConsultationHistoryItem = Appointment;

export type ConsultationSessionState =
  | "upcoming"
  | "ready"
  | "completed"
  | "unavailable";

export function getConsultationSessionState(
  appointment: Appointment,
  now = new Date(),
): ConsultationSessionState {
  const start = new Date(appointment.starts_at);
  const end = new Date(appointment.ends_at);

  if (appointment.status === "completed" || end <= now) return "completed";
  if (appointment.status !== "confirmed") return "unavailable";

  const waitingRoomOpensAt = new Date(start.getTime() - 15 * 60 * 1000);
  if (now >= waitingRoomOpensAt) return "ready";
  return "upcoming";
}
