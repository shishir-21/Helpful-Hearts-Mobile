import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import {
  createConversation,
  getConversationMessages,
  getConversations,
  sendAssistantMessage,
} from "@/features/assistant/api";
import { SAFETY_NOTICE, type AssistantMessage } from "@/features/assistant/types";

const conversationKeys = ["assistant", "conversations"] as const;

export default function AssistantScreen() {
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [draft, setDraft] = useState("");

  const conversationsQuery = useQuery({
    queryKey: conversationKeys,
    queryFn: getConversations,
  });

  useEffect(() => {
    if (!selectedConversationId && conversationsQuery.data?.[0]) {
      setSelectedConversationId(conversationsQuery.data[0].id);
    }
  }, [conversationsQuery.data, selectedConversationId]);

  const messagesQuery = useQuery({
    queryKey: ["assistant", "messages", selectedConversationId],
    queryFn: () => getConversationMessages(selectedConversationId!),
    enabled: Boolean(selectedConversationId),
  });

  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: async (conversation) => {
      setSelectedConversationId(conversation.id);
      await queryClient.invalidateQueries({ queryKey: conversationKeys });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const content = draft.trim();
      if (!content || !selectedConversationId) {
        throw new Error("Choose a conversation and enter a message.");
      }
      return sendAssistantMessage(selectedConversationId, { content });
    },
    onSuccess: async () => {
      setDraft("");
      await queryClient.invalidateQueries({
        queryKey: ["assistant", "messages", selectedConversationId],
      });
      await queryClient.invalidateQueries({ queryKey: conversationKeys });
    },
  });

  const messages = useMemo(() => messagesQuery.data ?? [], [messagesQuery.data]);
  const error = conversationsQuery.error ?? messagesQuery.error ?? sendMutation.error ?? createMutation.error;
  const errorMessage = error ? normalizeApiError(error).message : null;

  function startConversation() {
    createMutation.mutate();
  }

  function sendMessage() {
    if (!selectedConversationId && draft.trim()) {
      createMutation.mutate();
      return;
    }
    sendMutation.mutate();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>AI HEALTH ASSISTANT</Text>
          <Text style={styles.title}>How can I help?</Text>
        </View>
        <Pressable
          onPress={startConversation}
          disabled={createMutation.isPending}
          style={styles.newButton}
        >
          <Text style={styles.newButtonText}>New</Text>
        </Pressable>
      </View>

      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>Important</Text>
        <Text style={styles.safetyText}>{SAFETY_NOTICE}</Text>
      </View>

      {conversationsQuery.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading conversation history…</Text>
        </View>
      ) : conversationsQuery.isError ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>We could not load the assistant.</Text>
          <Text style={styles.muted}>{errorMessage}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => conversationsQuery.refetch()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            horizontal
            data={conversationsQuery.data ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.history}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.historyEmpty}>No previous conversations</Text>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedConversationId(item.id)}
                style={[
                  styles.historyItem,
                  item.id === selectedConversationId && styles.historyItemActive,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.historyText,
                    item.id === selectedConversationId && styles.historyTextActive,
                  ]}
                >
                  {item.title?.trim() || "Conversation"}
                </Text>
              </Pressable>
            )}
          />

          <FlatList
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
            data={messages}
            keyExtractor={(item) => item.id}
            inverted
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyTitle}>Start a health conversation</Text>
                <Text style={styles.muted}>
                  Ask a general health-information question. Do not share unnecessary personal or prescription details.
                </Text>
              </View>
            }
            renderItem={({ item }: { item: AssistantMessage }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.role === "user" ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.role === "user" && styles.userMessageText,
                  ]}
                >
                  {item.content}
                </Text>
              </View>
            )}
          />

          {messagesQuery.isFetching && !messagesQuery.isLoading ? (
            <ActivityIndicator style={styles.messageLoading} />
          ) : null}

          {sendMutation.isError ? (
            <View style={styles.sendError}>
              <Text style={styles.sendErrorText}>
                {normalizeApiError(sendMutation.error).message}
              </Text>
              <Pressable onPress={sendMessage}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask a general health question…"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={4000}
              style={styles.input}
              editable={!sendMutation.isPending && !createMutation.isPending}
            />
            <Pressable
              onPress={sendMessage}
              disabled={!draft.trim() || sendMutation.isPending || createMutation.isPending}
              style={[
                styles.sendButton,
                (!draft.trim() || sendMutation.isPending || createMutation.isPending) &&
                  styles.sendButtonDisabled,
              ]}
            >
              {sendMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendText}>Send</Text>
              )}
            </Pressable>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: { paddingRight: spacing.sm, paddingVertical: spacing.xs },
  backText: { color: colors.primary, fontWeight: "800" },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  title: { color: colors.text, fontSize: typography.heading, fontWeight: "800", marginTop: 2 },
  newButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  newButtonText: { color: colors.text, fontWeight: "800" },
  safetyCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: "#F4CACA",
  },
  safetyTitle: { color: colors.primary, fontWeight: "800" },
  safetyText: { color: colors.text, fontSize: 12, lineHeight: 18, marginTop: 4 },
  history: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  historyItem: {
    maxWidth: 180,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyItemActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  historyText: { color: colors.textSecondary, fontWeight: "700" },
  historyTextActive: { color: "#fff" },
  historyEmpty: { color: colors.textMuted, paddingVertical: spacing.sm },
  messages: { flex: 1 },
  messagesContent: { padding: spacing.md, gap: spacing.sm },
  messageBubble: {
    maxWidth: "86%",
    padding: spacing.md,
    borderRadius: 16,
    marginVertical: 3,
  },
  userBubble: { alignSelf: "flex-end", backgroundColor: colors.primary },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  userMessageText: { color: "#fff" },
  emptyChat: { padding: spacing.xl, transform: [{ scaleY: -1 }] },
  emptyTitle: { color: colors.text, fontWeight: "800", fontSize: 18, marginBottom: spacing.sm },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  errorTitle: { color: colors.danger, fontWeight: "800", fontSize: 17 },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: { color: colors.primary, fontWeight: "800" },
  messagesContent: { padding: spacing.md, gap: spacing.sm },
  messageLoading: { marginBottom: spacing.sm },
  sendError: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendErrorText: { flex: 1, color: colors.danger, fontSize: 12, marginRight: spacing.sm },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    backgroundColor: colors.background,
  },
  sendButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendText: { color: "#fff", fontWeight: "800" },
});
