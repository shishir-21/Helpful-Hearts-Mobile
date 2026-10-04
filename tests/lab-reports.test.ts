import type { MedicalRecord } from "@/features/medical-records/types";

function isLabReport(record: MedicalRecord) {
  return record.category.trim().toLowerCase() === "lab";
}

describe("lab report categorization", () => {
  it("recognizes Lab medical records", () => {
    const record = {
      id: "record-1",
      title: "CBC",
      category: "Lab",
      content: null,
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-01T10:00:00Z",
    } satisfies MedicalRecord;

    expect(isLabReport(record)).toBe(true);
  });

  it("does not classify other medical records as lab reports", () => {
    const record = {
      id: "record-2",
      title: "Doctor note",
      category: "Doctor Note",
      content: null,
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-01T10:00:00Z",
    } satisfies MedicalRecord;

    expect(isLabReport(record)).toBe(false);
  });
});