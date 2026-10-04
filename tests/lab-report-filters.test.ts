import { hasActiveLabReportFilters } from "@/features/medical-records/labReportFilters";

describe("lab report filter state", () => {
  it("returns false for the default state", () => {
    expect(hasActiveLabReportFilters("   ", "all", "newest")).toBe(false);
  });

  it("detects an active search", () => {
    expect(hasActiveLabReportFilters("CBC", "all", "newest")).toBe(true);
  });

  it("detects an active date filter", () => {
    expect(hasActiveLabReportFilters("", "7d", "newest")).toBe(true);
  });

  it("detects an active sort", () => {
    expect(hasActiveLabReportFilters("", "all", "oldest")).toBe(true);
  });
});
