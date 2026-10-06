import type { Appointment } from "@/features/appointments/types";
import type { MedicalRecord } from "@/features/medical-records/types";
import type { Prescription } from "@/features/prescriptions/types";
import { buildHealthDashboardSummary } from "@/features/health-dashboard/types";

const appointment = (overrides: Partial<Appointment> = {}): Appointment => ({
  id: "a1",
  doctor_id: "d1",
  patient_id: "p1",
  starts_at: "2026-10-08T10:00:00.000Z",
  ends_at: "2026-10-08T10:30:00.000Z",
  status: "confirmed",
  reason: "Follow-up",
  booking_reference: "REF-1",
  created_at: "2026-10-01T10:00:00.000Z",
  ...overrides,
});

const prescription = (overrides: Partial<Prescription> = {}): Prescription => ({
  id: "p1",
  filename: "prescription.pdf",
  content_type: "application/pdf",
  ocr_text: null,
  ocr_status: "pending",
  explanation: null,
  created_at: "2026-10-03T10:00:00.000Z",
  updated_at: "2026-10-03T10:00:00.000Z",
  ...overrides,
});

const record = (overrides: Partial<MedicalRecord> = {}): MedicalRecord => ({
  id: "r1",
  title: "Blood report",
  category: "Lab",
  content: null,
  created_at: "2026-10-04T10:00:00.000Z",
  updated_at: "2026-10-04T10:00:00.000Z",
  ...overrides,
});

describe("buildHealthDashboardSummary", () => {
  const now = new Date("2026-10-06T10:00:00.000Z");

  it("selects the nearest future non-cancelled appointment", () => {
    const result = buildHealthDashboardSummary(
      [
        appointment({ id: "later", starts_at: "2026-10-10T10:00:00.000Z" }),
        appointment({ id: "next", starts_at: "2026-10-07T10:00:00.000Z" }),
        appointment({ id: "cancelled", starts_at: "2026-10-06T12:00:00.000Z", status: "cancelled" }),
      ],
      [],
      [],
      now,
    );

    expect(result.upcomingAppointment?.id).toBe("next");
  });

  it("returns counts and the latest activity across health data", () => {
    const result = buildHealthDashboardSummary(
      [appointment()],
      [prescription()],
      [record()],
      now,
    );

    expect(result.prescriptionCount).toBe(1);
    expect(result.medicalRecordCount).toBe(1);
    expect(result.latestActivity).toEqual({
      kind: "medical-record",
      date: "2026-10-04T10:00:00.000Z",
      title: "Blood report",
    });
  });

  it("handles empty and invalid activity data safely", () => {
    const result = buildHealthDashboardSummary(
      [appointment({ starts_at: "not-a-date" })],
      [prescription({ created_at: "not-a-date" })],
      [record({ created_at: "not-a-date" })],
      now,
    );

    expect(result.upcomingAppointment).toBeNull();
    expect(result.latestActivity).toBeNull();
  });
});
