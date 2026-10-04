import { sanitizeTelemetryProperties } from "@/lib/telemetry/sanitize";

describe("telemetry privacy", () => {
  it("removes healthcare and personal data fields", () => {
    expect(
      sanitizeTelemetryProperties({
        screen: "home",
        content: "private health conversation",
        ocr_text: "prescription text",
        email: "patient@example.com",
        duration_ms: 120,
      }),
    ).toEqual({
      screen: "home",
      duration_ms: 120,
    });
  });

  it("keeps primitive non-sensitive metadata", () => {
    expect(
      sanitizeTelemetryProperties({
        screen: "doctor-profile",
        result_count: 5,
        authenticated: true,
      }),
    ).toEqual({
      screen: "doctor-profile",
      result_count: 5,
      authenticated: true,
    });
  });
});
