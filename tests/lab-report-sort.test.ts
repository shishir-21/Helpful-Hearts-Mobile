import type { MedicalRecord } from "@/features/medical-records/types";
import { sortLabReports } from "@/features/medical-records/labReportSort";

const reports: MedicalRecord[] = [
  { id: "1", title: "Older", category: "Lab", content: null, created_at: "2026-09-01", updated_at: "2026-09-01" },
  { id: "2", title: "Newest", category: "Lab", content: null, created_at: "2026-10-03", updated_at: "2026-10-03" },
  { id: "3", title: "Middle", category: "Lab", content: null, created_at: "2026-09-20", updated_at: "2026-09-20" },
];

describe("lab report date sorting", () => {
  it("sorts newest first", () => {
    expect(sortLabReports(reports, "newest").map((report) => report.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts oldest first", () => {
    expect(sortLabReports(reports, "oldest").map((report) => report.id)).toEqual(["1", "3", "2"]);
  });

  it("does not mutate the source reports", () => {
    expect(reports.map((report) => report.id)).toEqual(["1", "2", "3"]);
  });
});
