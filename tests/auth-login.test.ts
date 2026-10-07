jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

import { apiClient } from "@/lib/api/client";
import { login } from "@/features/auth/api";
import { loginSchema } from "@/features/auth/schemas";

const mockPost = jest.mocked(apiClient.post);

describe("patient login", () => {
  beforeEach(() => mockPost.mockReset());

  it("accepts a valid login payload", () => {
    expect(
      loginSchema.parse({
        email: "patient@example.com",
        password: "password123",
      }),
    ).toEqual({
      email: "patient@example.com",
      password: "password123",
    });
  });

  it("rejects an invalid email", () => {
    expect(() =>
      loginSchema.parse({
        email: "not-an-email",
        password: "password123",
      }),
    ).toThrow("Enter a valid email address");
  });

  it("rejects an empty password", () => {
    expect(() =>
      loginSchema.parse({
        email: "patient@example.com",
        password: "",
      }),
    ).toThrow("Password is required");
  });

  it("calls the existing login endpoint and returns the auth response", async () => {
    const response = {
      access_token: "access-token",
      token_type: "bearer" as const,
      user: {
        id: "patient-1",
        email: "patient@example.com",
        full_name: "Test Patient",
        role: "patient" as const,
        is_active: true,
        created_at: "2026-10-07T08:00:00Z",
      },
    };

    mockPost.mockResolvedValueOnce({ data: response });

    await expect(
      login({
        email: "patient@example.com",
        password: "password123",
      }),
    ).resolves.toEqual(response);

    expect(mockPost).toHaveBeenCalledWith("/auth/login", {
      email: "patient@example.com",
      password: "password123",
    });
  });
});
