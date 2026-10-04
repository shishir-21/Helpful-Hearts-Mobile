import type { MedicalRecord } from "./types";

export function getLabReportCategories(records: MedicalRecord[]): string[] {
  return [...new Set(records.map((record) => record.category.trim()).filter(Boolean))].sort();
}

export function filterLabReportsByCategory(
  reports: MedicalRecord[],
  category: string
): MedicalRecord[] {
  if (category === "all") return reports;
  return reports.filter((report) => report.category.trim() === category);
}
