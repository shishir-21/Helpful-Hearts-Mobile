jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(async (..._args: unknown[]) => ({ data: [] })),
    patch: jest.fn(async (..._args: unknown[]) => ({
      data: { id: "appointment-1", status: "confirmed" },
    })),
  },
}));

import { apiClient } from "@/lib/api/client";
import {
  decideDoctorAppointment,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} from "@/features/doctor/api";

const mockGet = jest.mocked(apiClient.get);
const mockPatch = jest.mocked(apiClient.patch);

describe("doctor mobile API", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockPatch.mockClear();
  });

  it("requests pending doctor appointment requests", async () => {
    const result = await getDoctorAppointments({ status: "requested" });

    expect(result).toEqual([]);
    expect(mockGet).toHaveBeenCalledWith("/doctor/appointments", {
      params: { status: "requested", upcoming_only: undefined },
    });
  });

  it("accepts a requested appointment", async () => {
    const result = await decideDoctorAppointment("appointment-1", "confirmed");

    expect(result).toEqual({ id: "appointment-1", status: "confirmed" });
    expect(mockPatch).toHaveBeenCalledWith(
      "/doctor/appointments/appointment-1/decision",
      { decision: "confirmed" },
    );
  });

  it("rejects a requested appointment", async () => {
    mockPatch.mockResolvedValueOnce({
      data: { id: "appointment-1", status: "rejected" },
    });

    const result = await decideDoctorAppointment("appointment-1", "rejected");

    expect(result).toEqual({ id: "appointment-1", status: "rejected" });
    expect(mockPatch).toHaveBeenCalledWith(
      "/doctor/appointments/appointment-1/decision",
      { decision: "rejected" },
    );
  });

  it("keeps the existing terminal status endpoint contract", async () => {
    mockPatch.mockResolvedValueOnce({
      data: { id: "appointment-1", status: "completed" },
    });

    const result = await updateDoctorAppointmentStatus("appointment-1", "completed");

    expect(result).toEqual({ id: "appointment-1", status: "completed" });
    expect(mockPatch).toHaveBeenCalledWith(
      "/doctor/appointments/appointment-1/status",
      { status: "completed" },
    );
  });
});
