import { apiClient } from "@/lib/api/client";
import {
  ocrReviewSchema,
  prescriptionSchema,
  prescriptionsResponseSchema,
  type OcrReviewInput,
  type Prescription,
} from "./types";

export type PrescriptionUpload = {
  uri: string;
  name: string;
  type: string;
};

export async function uploadPrescription(file: PrescriptionUpload): Promise<Prescription> {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  const { data } = await apiClient.post("/prescriptions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return prescriptionSchema.parse(data);
}

export async function getPrescriptions(): Promise<Prescription[]> {
  const { data } = await apiClient.get("/prescriptions");
  return prescriptionsResponseSchema.parse(data);
}

export async function getPrescription(id: string): Promise<Prescription> {
  const { data } = await apiClient.get(`/prescriptions/${id}`);
  return prescriptionSchema.parse(data);
}

export async function reviewPrescriptionOcr(
  id: string,
  input: OcrReviewInput,
): Promise<Prescription> {
  const payload = ocrReviewSchema.parse(input);
  const { data } = await apiClient.put(`/prescriptions/${id}/ocr-review`, payload);
  return prescriptionSchema.parse(data);
}

export async function explainPrescription(id: string): Promise<Prescription> {
  const { data } = await apiClient.post(`/prescriptions/${id}/explanation`);
  return prescriptionSchema.parse(data);
}
