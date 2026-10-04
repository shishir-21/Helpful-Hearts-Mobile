import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "@/features/appointments/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppointmentsScreen() {
  const appointments = useQuery({
    queryKey: ["appointments"],
    queryFn: getMyAppointments,
  });

  if (appointments.isLoading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={appointments.isRefetching} onRefresh={() => void appointments.refetch()} />}
    >
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.title}>My appointments</Text>
      <Text style={styles.subtitle}>Your booked healthcare appointments.</Text>

      {appointments.isError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not load appointments</Text>
          <Text style={styles.errorText}>Please check your connection and try again.</Text>
          <Pressable style={styles.retry} onPress={() => void appointments.refetch()}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!appointments.isError && appointments.data?.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.emptyText}>Choose a verified doctor and book an available slot.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push("/(auth)/doctors")}>
            <Text style={styles.primaryButtonText}>Find a doctor</Text>
          </Pressable>
        </View>
      ) : null}

      {appointments.data?.map((appointment) => (
        <Pressable
          key={appointment.id}
          style={styles.card}
          onPress={() => router.push(`/(auth)/appointments/${appointment.id}`)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{formatDate(appointment.starts_at)}</Text>
            <Text style={styles.status}>{appointment.status}</Text>
          </View>
          <Text style={styles.reference}>Booking {appointment.booking_reference}</Text>
          {appointment.reason ? <Text style={styles.reason} numberOfLines={2}>{appointment.reason}</Text> : null}
          <Text style={styles.action}>View details →</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:spacing.lg,paddingBottom:spacing.xl},
  center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background},
  back:{color:colors.primary,fontWeight:"700",fontSize:16,marginBottom:spacing.xl},
  title:{fontSize:28,fontWeight:"800",color:colors.text},
  subtitle:{fontSize:15,color:colors.textSecondary,marginTop:6,marginBottom:spacing.lg},
  card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.md,marginBottom:spacing.sm},
  cardHeader:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:spacing.sm},
  date:{fontSize:16,fontWeight:"800",color:colors.text,flex:1},
  status:{fontSize:12,fontWeight:"800",color:colors.success,textTransform:"capitalize"},
  reference:{fontSize:13,color:colors.textSecondary,marginTop:6},
  reason:{fontSize:14,color:colors.textSecondary,lineHeight:20,marginTop:spacing.sm},
  action:{fontSize:14,fontWeight:"800",color:colors.primary,marginTop:spacing.md},
  emptyCard:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.lg},
  emptyTitle:{fontSize:19,fontWeight:"800",color:colors.text},
  emptyText:{fontSize:14,color:colors.textSecondary,lineHeight:21,marginTop:6},
  primaryButton:{marginTop:spacing.md,backgroundColor:colors.primary,borderRadius:12,padding:spacing.md,alignItems:"center"},
  primaryButtonText:{color:"#fff",fontWeight:"800"},
  errorCard:{backgroundColor:colors.primarySoft,borderRadius:16,padding:spacing.md,marginBottom:spacing.md},
  errorTitle:{fontSize:16,fontWeight:"800",color:colors.danger},
  errorText:{fontSize:14,color:colors.textSecondary,marginTop:4},
  retry:{marginTop:spacing.sm,alignSelf:"flex-start"},
  retryText:{fontWeight:"800",color:colors.primary},
});
