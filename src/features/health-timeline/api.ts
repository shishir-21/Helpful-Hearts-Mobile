import { getMyAppointments } from "@/features/appointments/api";
import { getMedicalRecords } from "@/features/medical-records/api";
import { getPrescriptions } from "@/features/prescriptions/api";
import { buildHealthTimeline } from "./types";

export async function getHealthTimeline() {
  const [appointments, prescriptions, records] = await Promise.all([
    getMyAppointments(),
    getPrescriptions(),
    getMedicalRecords(),
  ]);

  return buildHealthTimeline(appointments, prescriptions, records);
}
