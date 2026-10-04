import type { Appointment } from "@/features/appointments/types";
import type { MedicalRecord } from "@/features/medical-records/types";
import type { Prescription } from "@/features/prescriptions/types";

export type HealthTimelineItem =
  | { id: string; kind: "appointment"; date: string; title: string; subtitle: string; appointment: Appointment }
  | { id: string; kind: "prescription"; date: string; title: string; subtitle: string; prescription: Prescription }
  | { id: string; kind: "medical-record"; date: string; title: string; subtitle: string; record: MedicalRecord };

export function buildHealthTimeline(
  appointments: Appointment[],
  prescriptions: Prescription[],
  records: MedicalRecord[],
): HealthTimelineItem[] {
  const items: HealthTimelineItem[] = [
    ...appointments.map((appointment) => ({
      id: `appointment-${appointment.id}`,
      kind: "appointment" as const,
      date: appointment.starts_at,
      title: "Appointment",
      subtitle: `${appointment.status} • ${appointment.reason ?? "General consultation"}`,
      appointment,
    })),
    ...prescriptions.map((prescription) => ({
      id: `prescription-${prescription.id}`,
      kind: "prescription" as const,
      date: prescription.created_at,
      title: prescription.filename,
      subtitle: `Prescription • OCR ${prescription.ocr_status}`,
      prescription,
    })),
    ...records.map((record) => ({
      id: `medical-record-${record.id}`,
      kind: "medical-record" as const,
      date: record.created_at,
      title: record.title,
      subtitle: record.category,
      record,
    })),
  ];

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
