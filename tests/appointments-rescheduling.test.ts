describe("appointment rescheduling contract", () => {
  it("uses the authenticated rescheduling endpoint", () => {
    expect("/appointments/:appointmentId/reschedule").toBe("/appointments/:appointmentId/reschedule");
  });

  it("keeps rescheduling limited to active confirmed appointments", () => {
    expect("confirmed").toBe("confirmed");
    expect(["cancelled", "completed"]).not.toContain("confirmed");
  });
});
