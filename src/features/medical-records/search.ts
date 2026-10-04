import type { MedicalRecord } from "./types";

export function filterMedicalRecords(records: MedicalRecord[], query: string): MedicalRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return records;
  return records.filter((record) =>
    record.title.toLowerCase().includes(normalized) ||
    record.category.toLowerCase().includes(normalized)
  );
}
