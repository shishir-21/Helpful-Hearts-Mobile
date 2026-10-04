import { filterMedicalRecords } from "@/features/medical-records/search";
import type { MedicalRecord } from "@/features/medical-records/types";

const records: MedicalRecord[] = [
  { id:"1", title:"CBC Report", category:"Lab", content:null, created_at:"2026-10-01", updated_at:"2026-10-01" },
  { id:"2", title:"Prescription Notes", category:"Prescription", content:null, created_at:"2026-10-02", updated_at:"2026-10-02" },
];

describe("medical record search", () => {
  it("matches title or category case-insensitively", () => {
    expect(filterMedicalRecords(records, "cbc").map((r) => r.id)).toEqual(["1"]);
    expect(filterMedicalRecords(records, "PRESCRIPTION").map((r) => r.id)).toEqual(["2"]);
  });
  it("returns all records for an empty query", () => {
    expect(filterMedicalRecords(records, " ")).toEqual(records);
  });
});
