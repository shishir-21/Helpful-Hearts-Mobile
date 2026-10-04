import { apiClient } from "@/lib/api/client";

export type DoctorAppointmentStatus =
  | "requested"
  | "confirmed"
  | "rejected"
  | "completed"
  | "cancelled"
  | "no_show";

export type DoctorAppointment = {
  id: string;
  doctor_id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  starts_at: string;
  ends_at: string;
  status: DoctorAppointmentStatus;
  reason: string | null;
  booking_reference: string;
  created_at: string;
};

export type DoctorAppointmentDecision = "confirmed" | "rejected";

export async function getDoctorAppointments(options?: {
  status?: DoctorAppointmentStatus;
  upcomingOnly?: boolean;
}) {
  const { data } = await apiClient.get<DoctorAppointment[]>("/doctor/appointments", {
    params: {
      status: options?.status,
      upcoming_only: options?.upcomingOnly,
    },
  });
  return data;
}

export async function getDoctorAppointment(appointmentId: string) {
  const { data } = await apiClient.get<DoctorAppointment>(
    `/doctor/appointments/${appointmentId}`,
  );
  return data;
}

export async function updateDoctorAppointmentStatus(
  appointmentId: string,
  status: "completed" | "cancelled" | "no_show",
) {
  const { data } = await apiClient.patch<DoctorAppointment>(
    `/doctor/appointments/${appointmentId}/status`,
    { status },
  );
  return data;
}

export async function decideDoctorAppointment(
  appointmentId: string,
  decision: DoctorAppointmentDecision,
) {
  const { data } = await apiClient.patch<DoctorAppointment>(
    `/doctor/appointments/${appointmentId}/decision`,
    { decision },
  );
  return data;
}
