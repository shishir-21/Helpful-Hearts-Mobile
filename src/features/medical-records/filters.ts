import type { MedicalRecordDateFilter } from "./dateFilter";
import type { MedicalRecordSort } from "./sort";

export function hasActiveMedicalRecordFilters(
  query: string,
  category: string | null,
  dateFilter: MedicalRecordDateFilter,
  sort: MedicalRecordSort,
): boolean {
  return query.trim().length > 0 || Boolean(category) || dateFilter !== "all" || sort !== "newest";
}
