import type { MedicalRecord } from "@/features/medical-records/types";
import { filterMedicalRecordsByDate } from "@/features/medical-records/dateFilter";

const records: MedicalRecord[] = [
  { id: "recent", title: "Recent", category: "Lab", content: null, created_at: "2026-10-03T10:00:00Z", updated_at: "2026-10-03T10:00:00Z" },
  { id: "week", title: "Week", category: "Report", content: null, created_at: "2026-09-28T10:00:00Z", updated_at: "2026-09-28T10:00:00Z" },
  { id: "month", title: "Month", category: "Report", content: null, created_at: "2026-09-10T10:00:00Z", updated_at: "2026-09-10T10:00:00Z" },
  { id: "old", title: "Old", category: "Report", content: null, created_at: "2026-08-01T10:00:00Z", updated_at: "2026-08-01T10:00:00Z" },
  { id: "invalid", title: "Invalid", category: "Report", content: null, created_at: "not-a-date", updated_at: "not-a-date" },
];

describe("medical record date filter", () => {
  const now = new Date("2026-10-04T10:00:00Z");

  it("returns all records for all time", () => {
    expect(filterMedicalRecordsByDate(records, "all", now)).toEqual(records);
  });

  it("keeps records from the last 7 days", () => {
    expect(filterMedicalRecordsByDate(records, "7d", now).map((record) => record.id)).toEqual(["recent", "week"]);
  });

  it("keeps records from the last 30 days", () => {
    expect(filterMedicalRecordsByDate(records, "30d", now).map((record) => record.id)).toEqual(["recent", "week", "month"]);
  });

  it("ignores invalid dates", () => {
    expect(filterMedicalRecordsByDate(records, "30d", now).map((record) => record.id)).not.toContain("invalid");
  });
});
