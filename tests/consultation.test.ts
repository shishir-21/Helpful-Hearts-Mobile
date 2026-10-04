import { getConsultationSessionState } from "@/features/consultation/types";
import type { Appointment } from "@/features/appointments/types";

const appointment: Appointment = {
  id:"a1", doctor_id:"d1", patient_id:"p1",
  starts_at:"2026-10-04T12:00:00Z", ends_at:"2026-10-04T12:30:00Z",
  status:"confirmed", reason:null, booking_reference:"HH-TEST01",
  created_at:"2026-10-01T00:00:00Z",
};

describe("consultation session state",()=>{
  it("keeps future appointments upcoming until 15 minutes before start",()=>{
    expect(getConsultationSessionState(appointment,new Date("2026-10-04T11:00:00Z"))).toBe("upcoming");
  });
  it("marks the appointment ready during the waiting-room window",()=>{
    expect(getConsultationSessionState(appointment,new Date("2026-10-04T11:50:00Z"))).toBe("ready");
  });
  it("marks ended appointments completed",()=>{
    expect(getConsultationSessionState(appointment,new Date("2026-10-04T13:00:00Z"))).toBe("completed");
  });
  it("does not expose a session for non-confirmed appointments",()=>{
    expect(getConsultationSessionState({...appointment,status:"cancelled"},new Date("2026-10-04T11:50:00Z"))).toBe("unavailable");
  });
});
