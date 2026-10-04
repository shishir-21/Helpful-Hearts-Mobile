import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getDoctorAppointments } from "@/features/doctor/api";
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

export default function DoctorHomeScreen() {
  const query = useQuery({
    queryKey: ["doctor-appointments", "upcoming"],
    queryFn: () => getDoctorAppointments({ upcomingOnly: true }),
  });

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}
    >
      <Text style={styles.eyebrow}>DOCTOR PORTAL</Text>
      <Text style={styles.title}>Today’s care</Text>
      <Text style={styles.subtitle}>Manage your upcoming appointments and consultations.</Text>

      {query.isError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not load your appointments</Text>
          <Text style={styles.errorText}>Please check your connection and try again.</Text>
          <Pressable onPress={() => void query.refetch()}><Text style={styles.retry}>Try again</Text></Pressable>
        </View>
      ) : null}

      {!query.isError && (query.data ?? []).length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No upcoming appointments</Text>
          <Text style={styles.emptyText}>New patient bookings will appear here.</Text>
        </View>
      ) : null}

      {(query.data ?? []).map((appointment) => (
        <Pressable
          key={appointment.id}
          style={styles.card}
          onPress={() => router.push(`/(auth)/doctor/appointments/${appointment.id}`)}
        >
          <View style={styles.row}>
            <Text style={styles.date}>{formatDate(appointment.starts_at)}</Text>
            <Text style={styles.status}>{appointment.status.replace("_", " ")}</Text>
          </View>
          <Text style={styles.patient}>{appointment.patient_name}</Text>
          <Text style={styles.reason} numberOfLines={2}>{appointment.reason ?? "No reason provided"}</Text>
          <Text style={styles.reference}>Booking {appointment.booking_reference}</Text>
          <Text style={styles.action}>Open appointment →</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:spacing.lg,paddingBottom:spacing.xl},
  center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:30,fontWeight:"800",marginTop:4},
  subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:8,marginBottom:spacing.lg},
  card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.md,marginBottom:spacing.sm},
  row:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:spacing.sm},
  date:{color:colors.text,fontSize:16,fontWeight:"800",flex:1},
  status:{color:colors.primary,fontSize:12,fontWeight:"800",textTransform:"capitalize"},
  patient:{color:colors.text,fontSize:18,fontWeight:"800",marginTop:spacing.sm},
  reason:{color:colors.textSecondary,fontSize:14,lineHeight:20,marginTop:4},
  reference:{color:colors.textMuted,fontSize:12,marginTop:spacing.sm},
  action:{color:colors.primary,fontWeight:"800",marginTop:spacing.md},
  empty:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.lg},
  emptyTitle:{color:colors.text,fontSize:18,fontWeight:"800"},
  emptyText:{color:colors.textSecondary,fontSize:14,marginTop:6},
  errorCard:{backgroundColor:colors.primarySoft,borderRadius:16,padding:spacing.md},
  errorTitle:{color:colors.danger,fontWeight:"800"},
  errorText:{color:colors.textSecondary,fontSize:14,marginTop:4},
  retry:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},
});
