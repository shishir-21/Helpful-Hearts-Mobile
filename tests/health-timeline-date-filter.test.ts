import type { HealthTimelineItem } from "@/features/health-timeline/types";
import { filterHealthTimelineByDate } from "@/features/health-timeline/dateFilter";

const items: HealthTimelineItem[] = [
  { id: "old", kind: "appointment", date: "2026-08-01T10:00:00Z", title: "Old", subtitle: "Confirmed", appointment: {} as never },
  { id: "recent", kind: "prescription", date: "2026-10-01T10:00:00Z", title: "Recent", subtitle: "Prescription", prescription: {} as never },
];

describe("health timeline date filters", () => {
  const now = new Date("2026-10-04T10:00:00Z");

  it("returns all items for all time", () => {
    expect(filterHealthTimelineByDate(items, "all", now)).toEqual(items);
  });

  it("keeps items from the last 7 days", () => {
    expect(filterHealthTimelineByDate(items, "7d", now).map((item) => item.id)).toEqual(["recent"]);
  });

  it("keeps items from the last 30 days", () => {
    expect(filterHealthTimelineByDate(items, "30d", now).map((item) => item.id)).toEqual(["recent"]);
  });
});
