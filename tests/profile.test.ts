jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from "@/lib/api/client";
import { getPatientProfile } from "@/features/profile/api";

const mockGet = jest.mocked(apiClient.get);

describe("patient profile API", () => {
  beforeEach(() => mockGet.mockReset());

  it("loads the authenticated user profile through the existing auth contract", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        id: "patient-1",
        email: "patient@example.com",
        full_name: "Test Patient",
        role: "patient",
        is_active: true,
        created_at: "2026-10-01T10:00:00Z",
      },
    });

    await expect(getPatientProfile()).resolves.toMatchObject({
      id: "patient-1",
      role: "patient",
      full_name: "Test Patient",
    });
    expect(mockGet).toHaveBeenCalledWith("/auth/me");
  });
});
