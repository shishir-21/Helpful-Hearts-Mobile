import type { MedicalRecord } from "@/features/medical-records/types";
import { sortMedicalRecords } from "@/features/medical-records/sort";

const records: MedicalRecord[] = [
  { id: "1", title: "Older", category: "Lab", content: null, created_at: "2026-09-01", updated_at: "2026-09-01" },
  { id: "2", title: "Newest", category: "Lab", content: null, created_at: "2026-10-03", updated_at: "2026-10-03" },
  { id: "3", title: "Middle", category: "Lab", content: null, created_at: "2026-09-20", updated_at: "2026-09-20" },
];

describe("medical record date sorting", () => {
  it("sorts newest first", () => {
    expect(sortMedicalRecords(records, "newest").map((record) => record.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts oldest first", () => {
    expect(sortMedicalRecords(records, "oldest").map((record) => record.id)).toEqual(["1", "3", "2"]);
  });

  it("does not mutate the source records", () => {
    expect(records.map((record) => record.id)).toEqual(["1", "2", "3"]);
  });
});
