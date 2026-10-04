import { z } from "zod";

export const medicalRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  content: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const medicalRecordsResponseSchema = z.array(medicalRecordSchema);

export type MedicalRecord = z.infer<typeof medicalRecordSchema>;

export const MEDICAL_RECORD_CATEGORY_LABELS = [
  "Medical record",
  "Prescription",
  "Lab",
  "Doctor note",
  "Vaccination",
  "Allergy",
  "Medication",
] as const;

export function getMedicalRecordCategoryLabel(category: string): string {
  const normalized = category.trim().toLowerCase();
  const known = MEDICAL_RECORD_CATEGORY_LABELS.find(
    (value) => value.toLowerCase() === normalized,
  );
  return known ?? (category.trim() || "Medical record");
}
