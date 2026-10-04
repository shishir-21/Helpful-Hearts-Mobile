import type { MedicalRecord } from "./types";

export type LabReportDateFilter = "all" | "7d" | "30d";

export function filterLabReportsByDate(
  reports: MedicalRecord[],
  filter: LabReportDateFilter,
  now = new Date(),
): MedicalRecord[] {
  if (filter === "all") return reports;

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - (filter === "7d" ? 7 : 30));

  return reports.filter((report) => {
    const createdAt = new Date(report.created_at);
    return (
      !Number.isNaN(createdAt.getTime()) &&
      createdAt >= cutoff &&
      createdAt <= now
    );
  });
}
