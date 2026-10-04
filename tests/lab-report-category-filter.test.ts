import type { MedicalRecord } from "@/features/medical-records/types";
import { sortLabReports } from "@/features/medical-records/labReportFilter";

const reports: MedicalRecord[] = [
  { id: "old", title: "CBC", category: "Lab", content: null, created_at: "2026-08-01", updated_at: "2026-08-01" },
  { id: "new", title: "Lipid Profile", category: "Lab", content: null, created_at: "2026-10-02", updated_at: "2026-10-02" },
  { id: "middle", title: "Urine Test", category: "Lab", content: null, created_at: "2026-09-10", updated_at: "2026-09-10" },
];

describe("lab report date sorting", () => {
  it("sorts newest first", () => {
    expect(sortLabReports(reports, "newest").map((report) => report.id)).toEqual(["new", "middle", "old"]);
  });

  it("sorts oldest first", () => {
    expect(sortLabReports(reports, "oldest").map((report) => report.id)).toEqual(["old", "middle", "new"]);
  });

  it("does not mutate the original list", () => {
    const original = [...reports];
    sortLabReports(reports, "newest");
    expect(reports).toEqual(original);
  });
});
