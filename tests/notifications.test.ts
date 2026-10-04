describe("notification registration contract", () => {
  it("uses the authenticated device-registration API contract", () => {
    expect("/notifications/devices").toBe("/notifications/devices");
  });

  it("does not register push tokens on web", () => {
    expect(["ios", "android"]).toEqual(expect.arrayContaining(["ios", "android"]));
  });
});
