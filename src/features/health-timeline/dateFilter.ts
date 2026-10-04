import type { HealthTimelineItem } from "./types";

export type HealthTimelineDateFilter = "all" | "7d" | "30d";

export function filterHealthTimelineByDate(
  items: HealthTimelineItem[],
  filter: HealthTimelineDateFilter,
  now = new Date()
): HealthTimelineItem[] {
  if (filter === "all") return items;

  const days = filter === "7d" ? 7 : 30;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);

  return items.filter((item) => {
    const date = new Date(item.date);
    return !Number.isNaN(date.getTime()) && date >= cutoff && date <= now;
  });
}
