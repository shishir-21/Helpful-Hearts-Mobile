import type { MedicalRecord } from "./types";

export type MedicalRecordDateFilter = "all" | "7d" | "30d";

export function filterMedicalRecordsByDate(
  records: MedicalRecord[],
  filter: MedicalRecordDateFilter,
  now = new Date(),
): MedicalRecord[] {
  if (filter === "all") return records;

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - (filter === "7d" ? 7 : 30));

  return records.filter((record) => {
    const createdAt = new Date(record.created_at);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= cutoff && createdAt <= now;
  });
}
