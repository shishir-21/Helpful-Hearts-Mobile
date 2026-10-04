import type { HealthTimelineItem } from "@/features/health-timeline/types";
import { searchHealthTimeline } from "@/features/health-timeline/search";

const items: HealthTimelineItem[] = [
  { id: "appointment-1", kind: "appointment", date: "2026-10-01", title: "Appointment", subtitle: "Confirmed", appointment: {} as never },
  { id: "prescription-1", kind: "prescription", date: "2026-10-02", title: "Prescription", subtitle: "OCR completed", prescription: {} as never },
  { id: "record-1", kind: "medical-record", date: "2026-10-03", title: "CBC Report", subtitle: "Lab", record: {} as never },
];

describe("health timeline search", () => {
  it("matches title and subtitle case-insensitively", () => {
    expect(searchHealthTimeline(items, "cbc").map((item) => item.id)).toEqual(["record-1"]);
    expect(searchHealthTimeline(items, "OCR").map((item) => item.id)).toEqual(["prescription-1"]);
  });

  it("supports partial text matching", () => {
    expect(searchHealthTimeline(items, "appoint").map((item) => item.id)).toEqual(["appointment-1"]);
  });

  it("returns no results when nothing matches", () => {
    expect(searchHealthTimeline(items, "doctor")).toEqual([]);
  });

  it("returns all items for an empty query", () => {
    expect(searchHealthTimeline(items, "   ")).toEqual(items);
  });
});
