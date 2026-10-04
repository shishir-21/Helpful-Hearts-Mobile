import type { MedicalRecord } from "./types";

export type LabReportSort = "newest" | "oldest";

export function sortLabReports(
  reports: MedicalRecord[],
  sort: LabReportSort
): MedicalRecord[] {
  return [...reports].sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    return sort === "newest" ? bTime - aTime : aTime - bTime;
  });
}
