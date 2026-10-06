import { getMyAppointments } from "@/features/appointments/api";
import { getMedicalRecords } from "@/features/medical-records/api";
import { getPrescriptions } from "@/features/prescriptions/api";
import { buildHealthDashboardSummary } from "./types";

export async function getHealthDashboardSummary() {
  const [appointments, prescriptions, records] = await Promise.all([
    getMyAppointments(),
    getPrescriptions(),
    getMedicalRecords(),
  ]);

  return buildHealthDashboardSummary(appointments, prescriptions, records);
}
