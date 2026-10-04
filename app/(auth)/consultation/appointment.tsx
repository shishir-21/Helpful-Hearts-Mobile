import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMyAppointment } from "@/features/appointments/api";
import { getConsultationSessionState } from "@/features/consultation/types";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { weekday:"long", month:"long", day:"numeric", hour:"numeric", minute:"2-digit" });
}

export default function ConsultationWaitingRoomScreen() {
  const params=useLocalSearchParams<{appointmentId:string}>();
  const appointmentId=Array.isArray(params.appointmentId) ? params.appointmentId[0] : params.appointmentId;
  const query=useQuery({queryKey:["appointment",appointmentId],queryFn:()=>getMyAppointment(appointmentId),enabled:Boolean(appointmentId)});

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (query.isError || !query.data) return <View style={styles.center}><Text style={styles.error}>Could not load the appointment.</Text><Pressable onPress={()=>void query.refetch()}><Text style={styles.retry}>Retry</Text></Pressable></View>;

  const item=query.data;
  const state=getConsultationSessionState(item);

  return <View style={styles.container}>
    <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
    <Text style={styles.eyebrow}>WAITING ROOM</Text>
    <Text style={styles.title}>Consultation</Text>
    <View style={styles.card}>
      <Text style={styles.label}>Appointment</Text><Text style={styles.value}>{formatDate(item.starts_at)}</Text>
      <Text style={styles.label}>Booking</Text><Text style={styles.value}>{item.booking_reference}</Text>
    </View>
    {state==="upcoming" ? <View style={styles.info}><Text style={styles.infoTitle}>Your waiting room is not open yet</Text><Text style={styles.infoText}>Return about 15 minutes before your appointment. The consultation session will appear here when the backend supports it.</Text></View> : null}
    {state==="ready" ? <View style={styles.info}><Text style={styles.infoTitle}>You are ready</Text><Text style={styles.infoText}>Your appointment is within the waiting-room window. Video, audio, and live chat are not enabled yet because the backend does not currently provide a consultation session.</Text></View> : null}
    {state==="completed" ? <View style={styles.info}><Text style={styles.infoTitle}>Appointment completed</Text><Text style={styles.infoText}>This appointment is now part of your consultation history. Detailed consultation records will be added when supported by the backend.</Text></View> : null}
    {state==="unavailable" ? <View style={styles.info}><Text style={styles.infoTitle}>Consultation unavailable</Text><Text style={styles.infoText}>This appointment is not currently eligible for a consultation session.</Text></View> : null}
  </View>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background,padding:spacing.lg},
 center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg,backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"800",fontSize:16,marginBottom:spacing.xl},
 eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
 title:{color:colors.text,fontSize:32,fontWeight:"800",marginTop:4},
 card:{marginTop:spacing.lg,padding:spacing.lg,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
 label:{color:colors.textMuted,fontSize:11,fontWeight:"800",textTransform:"uppercase",marginTop:spacing.sm},
 value:{color:colors.text,fontSize:16,fontWeight:"700",marginTop:4},
 info:{marginTop:spacing.lg,padding:spacing.lg,borderRadius:16,backgroundColor:colors.primarySoft,borderWidth:1,borderColor:"#F4CACA"},
 infoTitle:{color:colors.primary,fontSize:18,fontWeight:"800"},
 infoText:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:spacing.sm},
 error:{color:colors.danger,fontWeight:"800",textAlign:"center"},
 retry:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},
});