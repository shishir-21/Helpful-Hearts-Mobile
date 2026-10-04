import type { MedicalRecord } from "./types";

export function searchLabReports(
  reports: MedicalRecord[],
  query: string
): MedicalRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return reports;
  }

  return reports.filter((report) =>
    report.title.toLowerCase().includes(normalizedQuery)
  );
}
