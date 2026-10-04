import { hasActiveMedicalRecordFilters } from "@/features/medical-records/filters";

describe("medical record filter state", () => {
  it("returns false for the default state", () => {
    expect(hasActiveMedicalRecordFilters(" ", null, "all", "newest")).toBe(false);
  });

  it("detects an active search", () => {
    expect(hasActiveMedicalRecordFilters("CBC", null, "all", "newest")).toBe(true);
  });

  it("detects an active category", () => {
    expect(hasActiveMedicalRecordFilters("", "Lab", "all", "newest")).toBe(true);
  });

  it("detects an active date range", () => {
    expect(hasActiveMedicalRecordFilters("", null, "7d", "newest")).toBe(true);
  });

  it("detects an active sort", () => {
    expect(hasActiveMedicalRecordFilters("", null, "all", "oldest")).toBe(true);
  });
});
