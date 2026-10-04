import type { HealthTimelineItem } from "./types";

export function searchHealthTimeline(
  items: HealthTimelineItem[],
  query: string,
): HealthTimelineItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    `${item.title} ${item.subtitle}`.toLowerCase().includes(normalizedQuery),
  );
}
