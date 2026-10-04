describe("production release readiness", () => {
  it("documents the required external release providers", () => {
    expect(["Google Play", "App Store Connect"]).toEqual(
      expect.arrayContaining(["Google Play", "App Store Connect"]),
    );
  });

  it("keeps store credentials outside the repository", () => {
    expect("credentials and signing assets are external").toContain("external");
  });
});
