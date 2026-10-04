import type { HealthTimelineItem } from "./types";

export type HealthTimelineFilter = "all" | HealthTimelineItem["kind"];

export function filterHealthTimeline(
  items: HealthTimelineItem[],
  filter: HealthTimelineFilter
): HealthTimelineItem[] {
  if (filter === "all") return items;
  return items.filter((item) => item.kind === filter);
}
