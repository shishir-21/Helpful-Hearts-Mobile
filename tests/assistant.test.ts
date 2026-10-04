import { conversationSchema, assistantMessageSchema, SAFETY_NOTICE } from "@/features/assistant/types";

describe("assistant contracts", () => {
  it("accepts a valid conversation", () => {
    expect(
      conversationSchema.parse({
        id: "conversation-1",
        title: "General health question",
        created_at: "2026-10-04T10:00:00Z",
        updated_at: "2026-10-04T10:01:00Z",
      }),
    ).toEqual({
      id: "conversation-1",
      title: "General health question",
      created_at: "2026-10-04T10:00:00Z",
      updated_at: "2026-10-04T10:01:00Z",
    });
  });

  it("rejects an assistant message with an invalid role", () => {
    expect(() =>
      assistantMessageSchema.parse({
        id: "message-1",
        role: "system",
        content: "unsafe",
        created_at: "2026-10-04T10:00:00Z",
      }),
    ).toThrow();
  });

  it("keeps the safety boundary visible in the feature contract", () => {
    expect(SAFETY_NOTICE).toContain("cannot diagnose");
    expect(SAFETY_NOTICE).toContain("cannot prescribe");
  });
});
