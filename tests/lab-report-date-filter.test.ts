import type { MedicalRecord } from "@/features/medical-records/types";
import { filterLabReportsByDate } from "@/features/medical-records/labReportDateFilter";

const reports: MedicalRecord[] = [
  { id: "1", title: "Recent CBC", category: "Lab", content: null, created_at: "2026-10-04T10:00:00Z", updated_at: "2026-10-04T10:00:00Z" },
  { id: "2", title: "Older CBC", category: "Lab", content: null, created_at: "2026-09-20T10:00:00Z", updated_at: "2026-09-20T10:00:00Z" },
  { id: "3", title: "Old Report", category: "Lab", content: null, created_at: "2026-08-01T10:00:00Z", updated_at: "2026-08-01T10:00:00Z" },
  { id: "4", title: "Invalid Report", category: "Lab", content: null, created_at: "not-a-date", updated_at: "2026-10-01T10:00:00Z" },
];

const now = new Date("2026-10-05T10:00:00Z");

describe("lab report date filter", () => {
  it("returns all reports for all time", () => {
    expect(filterLabReportsByDate(reports, "all", now)).toEqual(reports);
  });

  it("keeps reports from the last 7 days", () => {
    expect(filterLabReportsByDate(reports, "7d", now).map((report) => report.id)).toEqual(["1"]);
  });

  it("keeps reports from the last 30 days", () => {
    expect(filterLabReportsByDate(reports, "30d", now).map((report) => report.id)).toEqual(["1", "2"]);
  });

  it("ignores invalid dates", () => {
    expect(filterLabReportsByDate(reports, "30d", now).some((report) => report.id === "4")).toBe(false);
  });
});
