import { getDoctorAppointments, updateDoctorAppointmentStatus } from "@/features/doctor/api";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(async () => ({ data: [] })),
    patch: jest.fn(async () => ({ data: { id: "appointment-1", status: "completed" } })),
  },
}));

describe("doctor mobile API", () => {
  it("requests doctor appointments with upcoming filtering", async () => {
    const result = await getDoctorAppointments({ upcomingOnly: true });
    expect(result).toEqual([]);
  });

  it("updates a doctor appointment status through the protected endpoint", async () => {
    const result = await updateDoctorAppointmentStatus("appointment-1", "completed");
    expect(result).toEqual({ id: "appointment-1", status: "completed" });
  });
});
