import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDoctorAppointment, updateDoctorAppointmentStatus } from "@/features/doctor/api";
import { getOrCreateConsultationSession } from "@/features/consultation/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    weekday:"long",
    month:"long",
    day:"numeric",
    hour:"numeric",
    minute:"2-digit",
  });
}

export default function DoctorAppointmentDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const appointmentId = Array.isArray(params.id) ? params.id[0] : params.id;
  const client = useQueryClient();

  const query = useQuery({
    queryKey:["doctor-appointment", appointmentId],
    queryFn:() => getDoctorAppointment(appointmentId),
    enabled:Boolean(appointmentId),
  });

  const statusMutation = useMutation({
    mutationFn:(status:"completed"|"cancelled"|"no_show") =>
      updateDoctorAppointmentStatus(appointmentId, status),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey:["doctor-appointment", appointmentId] }),
        client.invalidateQueries({ queryKey:["doctor-appointments"] }),
      ]);
    },
  });

  const consultationMutation = useMutation({
    mutationFn:() => getOrCreateConsultationSession(appointmentId),
  });

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (query.isError || !query.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Could not load this appointment.</Text>
        <Pressable onPress={() => void query.refetch()}><Text style={styles.retry}>Retry</Text></Pressable>
      </View>
    );
  }

  const item = query.data;
  const canManage = item.status === "confirmed";

  const changeStatus = (status:"completed"|"cancelled"|"no_show", label:string) => {
    Alert.alert(label, `Change this appointment to "${status.replace("_"," ")}"?`, [
      { text:"Keep", style:"cancel" },
      { text:"Confirm", style:"destructive", onPress:() => statusMutation.mutate(status) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>PATIENT APPOINTMENT</Text>
      <Text style={styles.title}>{item.patient_name}</Text>
      <Text style={styles.date}>{formatDate(item.starts_at)}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Patient email</Text>
        <Text style={styles.value}>{item.patient_email}</Text>
        <Text style={styles.label}>Reason</Text>
        <Text style={styles.value}>{item.reason ?? "No reason provided"}</Text>
        <Text style={styles.label}>Booking reference</Text>
        <Text style={styles.value}>{item.booking_reference}</Text>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{item.status.replace("_"," ")}</Text>
      </View>

      {statusMutation.isError ? <Text style={styles.error}>Could not update appointment. Please try again.</Text> : null}
      {consultationMutation.isError ? <Text style={styles.error}>Could not open the consultation.</Text> : null}

      {canManage ? (
        <>
          <Pressable
            style={styles.primary}
            disabled={consultationMutation.isPending}
            onPress={async () => {
              try {
                const session = await consultationMutation.mutateAsync();
                router.push(`/(auth)/consultation/video?sessionId=${session.id}`);
              } catch {}
            }}
          >
            {consultationMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Start consultation</Text>}
          </Pressable>

          <View style={styles.actions}>
            <Pressable style={styles.secondary} disabled={statusMutation.isPending} onPress={() => changeStatus("completed","Complete appointment")}>
              <Text style={styles.secondaryText}>Mark completed</Text>
            </Pressable>
            <Pressable style={styles.secondary} disabled={statusMutation.isPending} onPress={() => changeStatus("no_show","Mark no-show")}>
              <Text style={styles.secondaryText}>Mark no-show</Text>
            </Pressable>
            <Pressable style={styles.danger} disabled={statusMutation.isPending} onPress={() => changeStatus("cancelled","Cancel appointment")}>
              <Text style={styles.dangerText}>Cancel appointment</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:spacing.lg,paddingBottom:spacing.xl},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg,backgroundColor:colors.background},
  back:{color:colors.primary,fontWeight:"800",fontSize:16,marginBottom:spacing.lg},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:30,fontWeight:"800",marginTop:4},
  date:{color:colors.textSecondary,fontSize:15,marginTop:6},
  card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.lg,marginTop:spacing.lg},
  label:{color:colors.textMuted,fontSize:11,fontWeight:"800",textTransform:"uppercase",marginTop:spacing.sm},
  value:{color:colors.text,fontSize:15,lineHeight:21,marginTop:4},
  status:{color:colors.primary,fontSize:16,fontWeight:"800",marginTop:4,textTransform:"capitalize"},
  primary:{backgroundColor:colors.primary,borderRadius:12,padding:spacing.md,alignItems:"center",marginTop:spacing.md},
  primaryText:{color:"#fff",fontWeight:"800"},
  actions:{gap:spacing.sm,marginTop:spacing.sm},
  secondary:{borderWidth:1,borderColor:colors.border,borderRadius:12,padding:spacing.md,alignItems:"center"},
  secondaryText:{color:colors.primary,fontWeight:"800"},
  danger:{borderWidth:1,borderColor:colors.danger,borderRadius:12,padding:spacing.md,alignItems:"center"},
  dangerText:{color:colors.danger,fontWeight:"800"},
  error:{color:colors.danger,fontWeight:"800",marginTop:spacing.md},
  retry:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},
});
