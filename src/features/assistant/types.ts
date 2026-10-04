import { z } from "zod";

export const assistantMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  created_at: z.string(),
});

export const conversationSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const conversationsResponseSchema = z.array(conversationSchema);
export const messagesResponseSchema = z.array(assistantMessageSchema);

export type AssistantMessage = z.infer<typeof assistantMessageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;

export type SendAssistantMessageInput = {
  content: string;
};

export const SAFETY_NOTICE =
  "Helpful-Hearts AI provides general health information only. It cannot diagnose conditions and cannot prescribe medicines or recommend medication changes. For severe or emergency symptoms, contact local emergency services or a licensed clinician.";
