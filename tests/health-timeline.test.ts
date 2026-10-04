import { buildHealthTimeline } from "@/features/health-timeline/types";

const appointment = {
  id: "a1", doctor_id: "d1", patient_id: "p1", starts_at: "2026-10-02T10:00:00Z",
  ends_at: "2026-10-02T10:30:00Z", status: "completed", reason: null, booking_reference: "REF-1", created_at: "2026-10-01T10:00:00Z",
};
const prescription = {
  id: "p1", filename: "prescription.pdf", content_type: "application/pdf", ocr_text: null,
  ocr_status: "completed", explanation: null, created_at: "2026-10-03T10:00:00Z", updated_at: "2026-10-03T10:00:00Z",
};
const record = {
  id: "r1", title: "CBC Report", category: "Lab", content: "Normal", created_at: "2026-10-04T10:00:00Z", updated_at: "2026-10-04T10:00:00Z",
};

describe("health timeline", () => {
  it("combines existing healthcare data and sorts newest first", () => {
    const timeline = buildHealthTimeline([appointment], [prescription], [record]);
    expect(timeline.map((item) => item.id)).toEqual([
      "medical-record-r1",
      "prescription-p1",
      "appointment-a1",
    ]);
  });

  it("handles an empty healthcare dataset", () => {
    expect(buildHealthTimeline([], [], [])).toEqual([]);
  });
});
