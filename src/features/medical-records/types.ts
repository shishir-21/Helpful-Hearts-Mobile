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
