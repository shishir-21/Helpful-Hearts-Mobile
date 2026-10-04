import { z } from "zod";
import type { Appointment } from "@/features/appointments/types";

export const consultationSessionSchema = z.object({
  id: z.string(),
  appointment_id: z.string(),
  status: z.enum(["scheduled", "in_progress", "completed"]),
  media_provider: z.literal("webrtc"),
  room_name: z.string(),
  signaling_path: z.string(),
  ice_servers: z.array(z.object({ urls: z.string() })),
  starts_at: z.string(),
  ends_at: z.string(),
  started_at: z.string().nullable(),
  ended_at: z.string().nullable(),
});

export const consultationMessageSchema = z.object({
  id: z.string(),
  sender_user_id: z.string(),
  content: z.string(),
  created_at: z.string(),
});

export const consultationHistoryItemSchema = z.object({
  session_id: z.string(),
  appointment_id: z.string(),
  status: z.enum(["scheduled", "in_progress", "completed"]),
  starts_at: z.string(),
  ends_at: z.string(),
  booking_reference: z.string(),
  message_count: z.number(),
});

export type ConsultationSession = z.infer<typeof consultationSessionSchema>;
export type ConsultationMessage = z.infer<typeof consultationMessageSchema>;
export type ConsultationHistoryItem = z.infer<typeof consultationHistoryItemSchema>;

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
