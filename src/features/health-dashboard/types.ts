import type { Appointment } from "@/features/appointments/types";
import type { MedicalRecord } from "@/features/medical-records/types";
import type { Prescription } from "@/features/prescriptions/types";

export type HealthDashboardSummary = {
  upcomingAppointment: Appointment | null;
  prescriptionCount: number;
  medicalRecordCount: number;
  latestActivity:
    | { kind: "appointment"; date: string; title: string }
    | { kind: "prescription"; date: string; title: string }
    | { kind: "medical-record"; date: string; title: string }
    | null;
};

function latestDate(items: Array<{ date: string; title: string }>) {
  return [...items]
    .filter((item) => Number.isFinite(new Date(item.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;
}

export function buildHealthDashboardSummary(
  appointments: Appointment[],
  prescriptions: Prescription[],
  records: MedicalRecord[],
  now = new Date(),
): HealthDashboardSummary {
  const nowMs = now.getTime();
  const upcomingAppointment =
    appointments
      .filter(
        (appointment) =>
          Number.isFinite(new Date(appointment.starts_at).getTime()) &&
          new Date(appointment.starts_at).getTime() >= nowMs &&
          !["cancelled", "canceled", "rejected"].includes(appointment.status.toLowerCase()),
      )
      .sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
      )[0] ?? null;

  const activities = [
    ...appointments.map((appointment) => ({
      kind: "appointment" as const,
      date: appointment.starts_at,
      title: "Appointment",
    })),
    ...prescriptions.map((prescription) => ({
      kind: "prescription" as const,
      date: prescription.created_at,
      title: prescription.filename,
    })),
    ...records.map((record) => ({
      kind: "medical-record" as const,
      date: record.created_at,
      title: record.title,
    })),
  ];

  return {
    upcomingAppointment,
    prescriptionCount: prescriptions.length,
    medicalRecordCount: records.length,
    latestActivity: latestDate(activities),
  };
}
