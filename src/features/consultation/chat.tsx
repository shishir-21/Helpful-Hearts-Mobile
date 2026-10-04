import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getConsultationMessages, getConsultationSession } from "./api";
import type { ConsultationMessage } from "./types";
import { secureTokenStorage } from "@/lib/auth/secureStorage";
import { env } from "@/config/env";
import { colors, spacing } from "@/theme";

export default function ConsultationChatScreen() {
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const messagesQuery = useQuery({
    queryKey: ["consultation-messages", sessionId],
    queryFn: () => getConsultationMessages(sessionId),
    enabled: Boolean(sessionId),
  });
  const sessionQuery = useQuery({
    queryKey: ["consultation-session", sessionId],
    queryFn: () => getConsultationSession(sessionId),
    enabled: Boolean(sessionId),
  });
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (messagesQuery.data) setMessages(messagesQuery.data);
  }, [messagesQuery.data]);

  useEffect(() => {
    if (!sessionQuery.data || !sessionId) return;
    let disposed = false;

    const connect = async () => {
      const token = await secureTokenStorage.getAccessToken();
      if (!token || disposed) return;
      const baseUrl = env.EXPO_PUBLIC_API_URL.replace(/^http/, "ws");
      const ws = new WebSocket(
        `${baseUrl}${sessionQuery.data.signaling_path}?token=${encodeURIComponent(token)}`,
      );
      socketRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data) as {
          type?: string;
          message?: ConsultationMessage;
        };
        if (payload.type !== "chat_message" || !payload.message) return;
        setMessages((current) =>
          current.some((item) => item.id === payload.message?.id)
            ? current
            : [...current, payload.message as ConsultationMessage],
        );
      };
    };

    void connect();
    return () => {
      disposed = true;
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [sessionQuery.data, sessionId]);

  const send = () => {
    const content = draft.trim();
    if (!content || socketRef.current?.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: "chat", content }));
    setDraft("");
  };

  const title = useMemo(() => {
    if (!sessionQuery.data) return "Consultation chat";
    return sessionQuery.data.status === "completed" ? "Consultation chat — completed" : "Consultation chat";
  }, [sessionQuery.data]);

  if (messagesQuery.isLoading || sessionQuery.isLoading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <View style={styles.header}>
        <View><Text style={styles.title}>{title}</Text><Text style={styles.status}>{connected ? "Live" : "Reconnecting…"}</Text></View>
      </View>
      {messagesQuery.isError ? <Text style={styles.error}>Could not load previous messages.</Text> : null}
      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={messages.length === 0 ? styles.empty : styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.time}>{new Date(item.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages yet. Your consultation messages will be saved securely.</Text>}
      />
      {sessionQuery.data?.status !== "completed" ? (
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={4000}
          />
          <Pressable style={styles.send} onPress={send}><Text style={styles.sendText}>Send</Text></Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background,padding:spacing.lg},
  center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background},
  back:{color:colors.primary,fontWeight:"800",fontSize:16,marginBottom:spacing.md},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:spacing.md},
  title:{color:colors.text,fontSize:24,fontWeight:"800"}, status:{color:colors.success,fontSize:12,fontWeight:"800",marginTop:4},
  list:{flex:1},listContent:{paddingBottom:spacing.md},empty:{flexGrow:1,alignItems:"center",justifyContent:"center",padding:spacing.lg},emptyText:{color:colors.textSecondary,textAlign:"center",lineHeight:21},
  message:{alignSelf:"flex-start",maxWidth:"88%",padding:spacing.md,borderRadius:16,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,marginBottom:spacing.sm},
  messageText:{color:colors.text,fontSize:15,lineHeight:21},time:{color:colors.textMuted,fontSize:10,marginTop:5},
  composer:{flexDirection:"row",alignItems:"flex-end",gap:spacing.sm,paddingTop:spacing.sm},input:{flex:1,minHeight:44,maxHeight:110,borderWidth:1,borderColor:colors.border,borderRadius:14,paddingHorizontal:spacing.md,paddingVertical:spacing.sm,color:colors.text,backgroundColor:colors.surface},
  send:{backgroundColor:colors.primary,borderRadius:14,paddingHorizontal:spacing.md,paddingVertical:spacing.md},sendText:{color:"#fff",fontWeight:"800"},error:{color:colors.danger,marginBottom:spacing.sm},
});
