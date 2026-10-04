import type { MedicalRecord } from "@/features/medical-records/types";
import { searchLabReports } from "@/features/medical-records/labReportSearch";

const reports: MedicalRecord[] = [
  { id: "1", title: "CBC Report", category: "Lab", content: null, created_at: "2026-10-01", updated_at: "2026-10-01" },
  { id: "2", title: "Lipid Profile", category: "Lab", content: null, created_at: "2026-09-20", updated_at: "2026-09-20" },
  { id: "3", title: "Thyroid Panel", category: "Lab", content: null, created_at: "2026-09-10", updated_at: "2026-09-10" },
];

describe("lab report search", () => {
  it("matches titles case-insensitively", () => {
    expect(searchLabReports(reports, "cbc").map((report) => report.id)).toEqual(["1"]);
  });

  it("matches partial titles", () => {
    expect(searchLabReports(reports, "profile").map((report) => report.id)).toEqual(["2"]);
  });

  it("returns no results for an unmatched query", () => {
    expect(searchLabReports(reports, "vitamin").map((report) => report.id)).toEqual([]);
  });

  it("returns all reports for an empty query", () => {
    expect(searchLabReports(reports, "   ")).toEqual(reports);
  });
});
