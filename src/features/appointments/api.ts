import { apiClient } from "@/lib/api/client";
import type { Appointment, CreateAppointmentInput } from "./types";

export async function createAppointment(input: CreateAppointmentInput) {
  const { data } = await apiClient.post<Appointment>("/appointments", input);
  return data;
}

export async function getMyAppointments() {
  const { data } = await apiClient.get<Appointment[]>("/appointments");
  return data;
}

export async function getMyAppointment(appointmentId: string) {
  const { data } = await apiClient.get<Appointment>(`/appointments/${appointmentId}`);
  return data;
}
