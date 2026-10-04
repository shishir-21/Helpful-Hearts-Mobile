jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from "@/lib/api/client";
import { getMedicalRecord, getMedicalRecords } from "@/features/medical-records/api";

const mockGet = jest.mocked(apiClient.get);

describe("medical records API", () => {
  beforeEach(() => mockGet.mockReset());

  it("loads the authenticated medical-record list", async () => {
    mockGet.mockResolvedValueOnce({
      data: [{
        id: "record-1",
        title: "Blood test",
        category: "Lab",
        content: "Normal",
        created_at: "2026-10-01T10:00:00Z",
        updated_at: "2026-10-01T10:00:00Z",
      }],
    });

    await expect(getMedicalRecords()).resolves.toHaveLength(1);
    expect(mockGet).toHaveBeenCalledWith("/medical-records");
  });

  it("loads an individual medical record", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        id: "record-1",
        title: "Blood test",
        category: "Lab",
        content: "Normal",
        created_at: "2026-10-01T10:00:00Z",
        updated_at: "2026-10-01T10:00:00Z",
      },
    });

    await expect(getMedicalRecord("record-1")).resolves.toMatchObject({
      id: "record-1",
      category: "Lab",
    });
    expect(mockGet).toHaveBeenCalledWith("/medical-records/record-1");
  });

  it("rejects an invalid API record shape", async () => {
    mockGet.mockResolvedValueOnce({ data: [{ id: "record-1" }] });

    await expect(getMedicalRecords()).rejects.toThrow();
  });
});


describe("healthcare record category labels", () => {
  it("normalizes known Phase 9 categories for display", async () => {
    const { getMedicalRecordCategoryLabel } = await import("@/features/medical-records/types");
    expect(getMedicalRecordCategoryLabel("lab")).toBe("Lab");
    expect(getMedicalRecordCategoryLabel("Doctor note")).toBe("Doctor note");
    expect(getMedicalRecordCategoryLabel("Custom category")).toBe("Custom category");
  });
});
