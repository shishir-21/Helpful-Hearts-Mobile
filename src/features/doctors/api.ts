import { apiClient } from "@/lib/api/client";
import type { Doctor, DoctorSearchResponse } from "./types";

export type DoctorSearchParams = {
  q?: string;
  specialty?: string;
  location?: string;
  page?: number;
  page_size?: number;
};

export async function searchDoctors(params: DoctorSearchParams = {}) {
  const { data } = await apiClient.get<DoctorSearchResponse>("/doctors", { params });
  return data;
}

export async function getDoctor(doctorId: string) {
  const { data } = await apiClient.get<Doctor>(`/doctors/${doctorId}`);
  return data;
}
