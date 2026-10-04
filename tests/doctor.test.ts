import {
  decideDoctorAppointment,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} from "@/features/doctor/api";

const getMock = jest.fn(async () => ({ data: [] }));
const patchMock = jest.fn(async () => ({
  data: { id: "appointment-1", status: "confirmed" },
}));

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: (...args: unknown[]) => getMock(...args),
    patch: (...args: unknown[]) => patchMock(...args),
  },
}));

describe("doctor mobile API", () => {
  beforeEach(() => {
    getMock.mockClear();
    patchMock.mockClear();
  });

  it("requests pending doctor appointment requests", async () => {
    const result = await getDoctorAppointments({ status: "requested" });

    expect(result).toEqual([]);
    expect(getMock).toHaveBeenCalledWith("/doctor/appointments", {
      params: { status: "requested", upcoming_only: undefined },
    });
  });

  it("accepts a requested appointment", async () => {
    const result = await decideDoctorAppointment("appointment-1", "confirmed");

    expect(result).toEqual({ id: "appointment-1", status: "confirmed" });
    expect(patchMock).toHaveBeenCalledWith(
      "/doctor/appointments/appointment-1/decision",
      { decision: "confirmed" },
    );
  });

  it("rejects a requested appointment", async () => {
    patchMock.mockResolvedValueOnce({
      data: { id: "appointment-1", status: "rejected" },
    });

    const result = await decideDoctorAppointment("appointment-1", "rejected");

    expect(result).toEqual({ id: "appointment-1", status: "rejected" });
    expect(patchMock).toHaveBeenCalledWith(
      "/doctor/appointments/appointment-1/decision",
      { decision: "rejected" },
    );
  });

  it("keeps the existing terminal status endpoint contract", async () => {
    patchMock.mockResolvedValueOnce({
      data: { id: "appointment-1", status: "completed" },
    });

    const result = await updateDoctorAppointmentStatus("appointment-1", "completed");

    expect(result).toEqual({ id: "appointment-1", status: "completed" });
    expect(patchMock).toHaveBeenCalledWith(
      "/doctor/appointments/appointment-1/status",
      { status: "completed" },
    );
  });
});
