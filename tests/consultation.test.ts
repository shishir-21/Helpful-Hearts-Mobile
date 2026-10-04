import { getConsultationSessionState, consultationHistoryItemSchema, consultationMessageSchema, consultationSessionSchema } from "@/features/consultation/types";
import type { Appointment } from "@/features/appointments/types";

const appointment: Appointment = {
  id:"a1", doctor_id:"d1", patient_id:"p1",
  starts_at:"2026-10-04T12:00:00Z", ends_at:"2026-10-04T12:30:00Z",
  status:"confirmed", reason:null, booking_reference:"HH-TEST01",
  created_at:"2026-10-01T00:00:00Z",
};

describe("consultation contracts",()=>{
  it("validates the session contract",()=>{
    expect(consultationSessionSchema.parse({
      id:"s1", appointment_id:"a1", status:"scheduled", media_provider:"webrtc",
      room_name:"hh-room", signaling_path:"/api/v1/consultations/sessions/s1/signal",
      ice_servers:[{urls:"stun:stun.l.google.com:19302"}],
      starts_at:appointment.starts_at, ends_at:appointment.ends_at, started_at:null, ended_at:null,
    }).media_provider).toBe("webrtc");
  });
  it("validates persisted messages and history",()=>{
    expect(consultationMessageSchema.parse({
      id:"m1", sender_user_id:"d1", content:"Hello", created_at:appointment.starts_at,
    }).content).toBe("Hello");
    expect(consultationHistoryItemSchema.parse({
      session_id:"s1", appointment_id:"a1", status:"completed",
      starts_at:appointment.starts_at, ends_at:appointment.ends_at,
      booking_reference:"HH-TEST01", message_count:2,
    }).message_count).toBe(2);
  });
  it("keeps the waiting-room timing contract",()=>{
    expect(getConsultationSessionState(appointment,new Date("2026-10-04T11:00:00Z"))).toBe("upcoming");
    expect(getConsultationSessionState(appointment,new Date("2026-10-04T11:50:00Z"))).toBe("ready");
    expect(getConsultationSessionState(appointment,new Date("2026-10-04T13:00:00Z"))).toBe("completed");
  });
  it("blocks non-confirmed appointments",()=>{
    expect(getConsultationSessionState({...appointment,status:"cancelled"},new Date("2026-10-04T11:50:00Z"))).toBe("unavailable");
  });
});
