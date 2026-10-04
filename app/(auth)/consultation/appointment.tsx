import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyAppointment } from "@/features/appointments/api";
import { getConsultationSessionState } from "@/features/consultation/types";
import { getOrCreateConsultationSession } from "@/features/consultation/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { weekday:"long", month:"long", day:"numeric", hour:"numeric", minute:"2-digit" });
}

export default function ConsultationWaitingRoomScreen() {
  const params=useLocalSearchParams<{appointmentId:string}>();
  const appointmentId=Array.isArray(params.appointmentId) ? params.appointmentId[0] : params.appointmentId;
  const query=useQuery({queryKey:["appointment",appointmentId],queryFn:()=>getMyAppointment(appointmentId),enabled:Boolean(appointmentId)});
  const sessionMutation=useMutation({mutationFn:()=>getOrCreateConsultationSession(appointmentId)});

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (query.isError || !query.data) return <View style={styles.center}><Text style={styles.error}>Could not load the appointment.</Text><Pressable onPress={()=>void query.refetch()}><Text style={styles.retry}>Retry</Text></Pressable></View>;

  const item=query.data;
  const state=getConsultationSessionState(item);

  return <View style={styles.container}>
    <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
    <Text style={styles.eyebrow}>WAITING ROOM</Text>
    <Text style={styles.title}>Consultation</Text>
    <View style={styles.card}><Text style={styles.label}>Appointment</Text><Text style={styles.value}>{formatDate(item.starts_at)}</Text><Text style={styles.label}>Booking</Text><Text style={styles.value}>{item.booking_reference}</Text></View>

    {state==="upcoming" ? <View style={styles.info}><Text style={styles.infoTitle}>Your waiting room is not open yet</Text><Text style={styles.infoText}>Return about 15 minutes before your appointment. The consultation session opens automatically during the waiting window.</Text></View> : null}
    {state==="completed" ? <View style={styles.info}><Text style={styles.infoTitle}>Appointment completed</Text><Text style={styles.infoText}>Open consultation history to review the saved session and messages.</Text><Pressable style={styles.secondary} onPress={()=>router.push("/(auth)/consultation")}><Text style={styles.secondaryText}>Open history</Text></Pressable></View> : null}
    {state==="unavailable" ? <View style={styles.info}><Text style={styles.infoTitle}>Consultation unavailable</Text><Text style={styles.infoText}>This appointment is not currently eligible for a consultation session.</Text></View> : null}
    {state==="ready" ? <View style={styles.ready}>
      <Text style={styles.infoTitle}>You are ready to join</Text>
      <Text style={styles.infoText}>Camera and microphone access are required for video/audio. Live chat is saved to this consultation.</Text>
      {sessionMutation.isError ? <Text style={styles.error}>{sessionMutation.error instanceof Error ? sessionMutation.error.message : "Could not create the session."}</Text> : null}
      <Pressable
        style={styles.primary}
        disabled={sessionMutation.isPending}
        onPress={async()=>{const session=await sessionMutation.mutateAsync(); router.push(`/(auth)/consultation/video?sessionId=${session.id}`);}}
      >
        {sessionMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Join video consultation</Text>}
      </Pressable>
      <Pressable
        style={styles.chatButton}
        disabled={sessionMutation.isPending}
        onPress={async()=>{const session=await sessionMutation.mutateAsync(); router.push(`/(auth)/consultation/chat?sessionId=${session.id}`);}}
      >
        <Text style={styles.chatText}>Open live chat</Text>
      </Pressable>
    </View> : null}
  </View>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background,padding:spacing.lg},center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg,backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"800",fontSize:16,marginBottom:spacing.xl},eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},title:{color:colors.text,fontSize:32,fontWeight:"800",marginTop:4},
 card:{marginTop:spacing.lg,padding:spacing.lg,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},label:{color:colors.textMuted,fontSize:11,fontWeight:"800",textTransform:"uppercase",marginTop:spacing.sm},value:{color:colors.text,fontSize:16,fontWeight:"700",marginTop:4},
 info:{marginTop:spacing.lg,padding:spacing.lg,borderRadius:16,backgroundColor:colors.primarySoft,borderWidth:1,borderColor:"#F4CACA"},ready:{marginTop:spacing.lg,padding:spacing.lg,borderRadius:16,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border},
 infoTitle:{color:colors.primary,fontSize:18,fontWeight:"800"},infoText:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:spacing.sm},primary:{marginTop:spacing.lg,backgroundColor:colors.primary,borderRadius:12,padding:spacing.md,alignItems:"center"},primaryText:{color:"#fff",fontWeight:"800"},chatButton:{marginTop:spacing.sm,borderWidth:1,borderColor:colors.primary,borderRadius:12,padding:spacing.md,alignItems:"center"},chatText:{color:colors.primary,fontWeight:"800"},secondary:{marginTop:spacing.md,alignSelf:"flex-start",padding:spacing.sm},secondaryText:{color:colors.primary,fontWeight:"800"},error:{color:colors.danger,fontWeight:"800",marginTop:spacing.sm},retry:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},
});
