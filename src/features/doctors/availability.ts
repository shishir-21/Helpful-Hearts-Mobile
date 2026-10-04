import { apiClient } from "@/lib/api/client";
import type { AvailabilitySlot } from "./types";

export async function getDoctorAvailability(
  doctorId: string,
  fromDate?: string,
  days = 14,
) {
  const { data } = await apiClient.get<AvailabilitySlot[]>(
    `/doctors/${doctorId}/availability`,
    { params: { from_date: fromDate, days } },
  );
  return data;
}
