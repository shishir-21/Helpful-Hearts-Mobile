jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from "@/lib/api/client";
import { searchDoctors } from "@/features/doctors/api";

const mockGet = jest.mocked(apiClient.get);

describe("doctor discovery API", () => {
  beforeEach(() => mockGet.mockReset());

  it("supports retrying the same submitted doctor search request", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({
      data: { items: [], page: 1, page_size: 20, total: 0 },
    });

    await expect(
      searchDoctors({ q: "cardiologist", page: 1, page_size: 20 }),
    ).rejects.toThrow("Network error");

    await expect(
      searchDoctors({ q: "cardiologist", page: 1, page_size: 20 }),
    ).resolves.toMatchObject({ items: [], total: 0 });

    expect(mockGet).toHaveBeenNthCalledWith(1, "/doctors", {
      params: { q: "cardiologist", page: 1, page_size: 20 },
    });
    expect(mockGet).toHaveBeenNthCalledWith(2, "/doctors", {
      params: { q: "cardiologist", page: 1, page_size: 20 },
    });
  });
});
