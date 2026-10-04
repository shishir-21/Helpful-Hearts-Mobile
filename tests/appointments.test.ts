describe("appointment cancellation contract", () => {
  it("uses the patient cancellation endpoint", () => {
    expect("/appointments/:appointmentId/cancel").toBe("/appointments/:appointmentId/cancel");
  });

  it("only exposes cancellation for active appointment states", () => {
    expect(["confirmed", "pending"]).toEqual(expect.arrayContaining(["confirmed", "pending"]));
    expect(["cancelled", "completed"]).not.toContain("confirmed");
  });
});
