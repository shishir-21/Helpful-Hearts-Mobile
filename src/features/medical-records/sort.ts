import type { MedicalRecord } from "./types";

export type MedicalRecordSort = "newest" | "oldest";

export function sortMedicalRecords(
  records: MedicalRecord[],
  sort: MedicalRecordSort
): MedicalRecord[] {
  return [...records].sort((a, b) => {
    const difference = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sort === "newest" ? -difference : difference;
  });
}
