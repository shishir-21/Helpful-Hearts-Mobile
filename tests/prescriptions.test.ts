import {
  ocrReviewSchema,
  prescriptionSchema,
} from "@/features/prescriptions/types";

const basePrescription = {
  id: "prescription-1",
  filename: "prescription.pdf",
  content_type: "application/pdf",
  ocr_text: null,
  ocr_status: "review_required",
  explanation: null,
  created_at: "2026-10-04T10:00:00Z",
  updated_at: "2026-10-04T10:00:00Z",
};

describe("prescription contracts", () => {
  it("accepts the upload response contract", () => {
    expect(prescriptionSchema.parse(basePrescription)).toEqual(basePrescription);
  });

  it("requires non-empty reviewed OCR text", () => {
    expect(() => ocrReviewSchema.parse({ ocr_text: "   " })).toThrow();
    expect(ocrReviewSchema.parse({ ocr_text: "Medicine: example" })).toEqual({
      ocr_text: "Medicine: example",
    });
  });

  it("accepts an explained prescription response", () => {
    expect(
      prescriptionSchema.parse({
        ...basePrescription,
        ocr_text: "Medicine: example",
        ocr_status: "explained",
        explanation: "Educational explanation.",
      }),
    ).toMatchObject({
      ocr_status: "explained",
      explanation: "Educational explanation.",
    });
  });
});
