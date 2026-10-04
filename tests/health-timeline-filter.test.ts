import type { HealthTimelineItem } from "@/features/health-timeline/types";
import { filterHealthTimeline } from "@/features/health-timeline/filter";

const items: HealthTimelineItem[] = [
  { id: "appointment-1", kind: "appointment", date: "2026-10-01", title: "Appointment", subtitle: "Confirmed", appointment: {} as never },
  { id: "prescription-1", kind: "prescription", date: "2026-10-02", title: "Prescription", subtitle: "Prescription", prescription: {} as never },
  { id: "record-1", kind: "medical-record", date: "2026-10-03", title: "CBC", subtitle: "Lab", record: {} as never },
];

describe("health timeline filters", () => {
  it("filters by event kind", () => {
    expect(filterHealthTimeline(items, "appointment").map((item) => item.id)).toEqual(["appointment-1"]);
    expect(filterHealthTimeline(items, "prescription").map((item) => item.id)).toEqual(["prescription-1"]);
    expect(filterHealthTimeline(items, "medical-record").map((item) => item.id)).toEqual(["record-1"]);
  });

  it("returns all events for the all filter", () => {
    expect(filterHealthTimeline(items, "all")).toEqual(items);
  });
});
