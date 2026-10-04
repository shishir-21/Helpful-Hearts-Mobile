import { z } from "zod";

export const prescriptionSchema = z.object({
  id: z.string(),
  filename: z.string(),
  content_type: z.string(),
  ocr_text: z.string().nullable(),
  ocr_status: z.string(),
  explanation: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const prescriptionsResponseSchema = z.array(prescriptionSchema);

export const ocrReviewSchema = z.object({
  ocr_text: z.string().trim().min(1).max(30000),
});

export type Prescription = z.infer<typeof prescriptionSchema>;
export type OcrReviewInput = z.infer<typeof ocrReviewSchema>;

export const ALLOWED_PRESCRIPTION_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

export const PRESCRIPTION_TYPE_LABELS = "JPG, JPEG, PNG or PDF";
