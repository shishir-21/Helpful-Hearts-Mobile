import type { MedicalRecord } from "./types";

export function getMedicalRecordCategories(records: MedicalRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.category).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function filterMedicalRecordsByCategory(
  records: MedicalRecord[],
  category: string | null
): MedicalRecord[] {
  if (!category) return records;
  return records.filter((record) => record.category === category);
}
