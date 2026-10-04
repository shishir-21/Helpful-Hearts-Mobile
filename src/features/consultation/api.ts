import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import {
  consultationHistoryItemSchema,
  consultationMessageSchema,
  consultationSessionSchema,
  type ConsultationHistoryItem,
  type ConsultationMessage,
  type ConsultationSession,
} from "./types";

export async function getOrCreateConsultationSession(appointmentId: string): Promise<ConsultationSession> {
  const { data } = await apiClient.post(`/consultations/appointments/${appointmentId}/session`);
  return consultationSessionSchema.parse(data);
}

export async function getConsultationSession(sessionId: string): Promise<ConsultationSession> {
  const { data } = await apiClient.get(`/consultations/sessions/${sessionId}`);
  return consultationSessionSchema.parse(data);
}

export async function endConsultation(sessionId: string): Promise<ConsultationSession> {
  const { data } = await apiClient.post(`/consultations/sessions/${sessionId}/end`);
  return consultationSessionSchema.parse(data);
}

export async function getConsultationHistory(): Promise<ConsultationHistoryItem[]> {
  const { data } = await apiClient.get("/consultations/history");
  return z.array(consultationHistoryItemSchema).parse(data);
}

export async function getConsultationMessages(sessionId: string): Promise<ConsultationMessage[]> {
  const { data } = await apiClient.get(`/consultations/sessions/${sessionId}/messages`);
  return z.array(consultationMessageSchema).parse(data);
}

export async function sendConsultationMessage(sessionId: string, content: string): Promise<ConsultationMessage> {
  const { data } = await apiClient.post(`/consultations/sessions/${sessionId}/messages`, { content });
  return consultationMessageSchema.parse(data);
}
