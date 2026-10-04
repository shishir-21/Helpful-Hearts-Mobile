import { getNotificationRoute } from "@/features/notifications/navigation";

describe("notification navigation contract", () => {
  it("opens the appointment when an appointment reminder is tapped", () => {
    expect(
      getNotificationRoute({
        type: "appointment_reminder",
        appointment_id: "appointment-123",
      }),
    ).toBe("/(auth)/appointments/appointment-123");
  });

  it("ignores unrelated notifications", () => {
    expect(getNotificationRoute({ type: "other", appointment_id: "appointment-123" })).toBeNull();
  });

  it("rejects malformed appointment reminder payloads", () => {
    expect(getNotificationRoute({ type: "appointment_reminder" })).toBeNull();
    expect(getNotificationRoute({ type: "appointment_reminder", appointment_id: 123 })).toBeNull();
  });
});
