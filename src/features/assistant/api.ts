import { apiClient } from "@/lib/api/client";
import {
  conversationSchema,
  conversationsResponseSchema,
  messagesResponseSchema,
  assistantMessageSchema,
  type AssistantMessage,
  type Conversation,
  type SendAssistantMessageInput,
} from "./types";

export async function createConversation(): Promise<Conversation> {
  const { data } = await apiClient.post("/assistant/conversations");
  return conversationSchema.parse(data);
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get("/assistant/conversations");
  return conversationsResponseSchema.parse(data);
}

export async function getConversationMessages(conversationId: string): Promise<AssistantMessage[]> {
  const { data } = await apiClient.get(
    `/assistant/conversations/${conversationId}/messages`,
  );
  return messagesResponseSchema.parse(data);
}

export async function sendAssistantMessage(
  conversationId: string,
  input: SendAssistantMessageInput,
): Promise<AssistantMessage> {
  const { data } = await apiClient.post(
    `/assistant/conversations/${conversationId}/messages`,
    input,
  );
  return assistantMessageSchema.parse(data);
}
