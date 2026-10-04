import type { MedicalRecord } from "@/features/medical-records/types";
import { filterLabReportsByCategory, getLabReportCategories } from "@/features/medical-records/labReportFilter";

const reports: MedicalRecord[] = [
  { id: "1", title: "CBC", category: "Lab", content: null, created_at: "2026-10-01", updated_at: "2026-10-01" },
  { id: "2", title: "Lipid Profile", category: "Blood", content: null, created_at: "2026-10-02", updated_at: "2026-10-02" },
  { id: "3", title: "Urine Test", category: "Urine", content: null, created_at: "2026-10-03", updated_at: "2026-10-03" },
];

describe("lab report category filter", () => {
  it("returns sorted available categories", () => {
    expect(getLabReportCategories(reports)).toEqual(["Blood", "Lab", "Urine"]);
  });

  it("filters reports by category", () => {
    expect(filterLabReportsByCategory(reports, "Blood").map((report) => report.id)).toEqual(["2"]);
  });

  it("returns all reports for the all filter", () => {
    expect(filterLabReportsByCategory(reports, "all")).toEqual(reports);
  });
});
