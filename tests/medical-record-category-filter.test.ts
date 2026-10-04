import type { MedicalRecord } from "@/features/medical-records/types";
import {
  filterMedicalRecordsByCategory,
  getMedicalRecordCategories,
} from "@/features/medical-records/categoryFilter";

const records: MedicalRecord[] = [
  { id: "1", title: "CBC Report", category: "Lab", content: null, created_at: "2026-10-01", updated_at: "2026-10-01" },
  { id: "2", title: "Prescription Notes", category: "Prescription", content: null, created_at: "2026-10-02", updated_at: "2026-10-02" },
  { id: "3", title: "Follow-up Lab", category: "Lab", content: null, created_at: "2026-10-03", updated_at: "2026-10-03" },
];

describe("medical record category filter", () => {
  it("returns unique sorted categories", () => {
    expect(getMedicalRecordCategories(records)).toEqual(["Lab", "Prescription"]);
  });

  it("filters records by the selected category", () => {
    expect(filterMedicalRecordsByCategory(records, "Lab").map((record) => record.id)).toEqual(["1", "3"]);
  });

  it("returns all records when no category is selected", () => {
    expect(filterMedicalRecordsByCategory(records, null)).toEqual(records);
  });
});
