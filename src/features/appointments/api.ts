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

export async function cancelAppointment(appointmentId: string) {
  const { data } = await apiClient.post<Appointment>(`/appointments/${appointmentId}/cancel`);
  return data;
}

export type AvailabilitySlot = {
  starts_at: string;
  ends_at: string;
  timezone: string;
};

export async function getDoctorAvailability(doctorId: string, fromDate?: string) {
  const { data } = await apiClient.get<AvailabilitySlot[]>(`/doctors/${doctorId}/availability`, {
    params: { from_date: fromDate, days: 14 },
  });
  return data;
}

export async function rescheduleAppointment(appointmentId: string, doctorId: string, startsAt: string) {
  const { data } = await apiClient.post<Appointment>(`/appointments/${appointmentId}/reschedule`, {
    doctor_id: doctorId,
    starts_at: startsAt,
  });
  return data;
}
