import { apiClient } from "@/lib/api/client";
import {
  medicalRecordSchema,
  medicalRecordsResponseSchema,
  type MedicalRecord,
} from "./types";

export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  const { data } = await apiClient.get("/medical-records");
  return medicalRecordsResponseSchema.parse(data);
}

export async function getMedicalRecord(id: string): Promise<MedicalRecord> {
  const { data } = await apiClient.get(`/medical-records/${id}`);
  return medicalRecordSchema.parse(data);
}
