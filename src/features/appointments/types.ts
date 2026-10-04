export type Appointment = {
  id: string;
  doctor_id: string;
  patient_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  reason: string | null;
  booking_reference: string;
  created_at: string;
};

export type CreateAppointmentInput = {
  doctor_id: string;
  starts_at: string;
  reason?: string;
};
