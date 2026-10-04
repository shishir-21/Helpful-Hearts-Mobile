import type { LabReportDateFilter } from "./labReportDateFilter";
import type { LabReportSort } from "./labReportSort";

export function hasActiveLabReportFilters(
  query: string,
  dateFilter: LabReportDateFilter,
  sort: LabReportSort,
): boolean {
  return query.trim().length > 0 || dateFilter !== "all" || sort !== "newest";
}
