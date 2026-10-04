import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "@/features/appointments/api";
import { getConsultationSessionState } from "@/features/consultation/types";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function ConsultationHistoryScreen() {
  const query = useQuery({ queryKey: ["consultations"], queryFn: getMyAppointments });
  const items = (query.data ?? []).filter((item) => new Date(item.ends_at) <= new Date() || item.status === "completed");

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}
    >
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>CONSULTATION</Text>
      <Text style={styles.title}>Consultation history</Text>
      <Text style={styles.subtitle}>Your completed appointment history. Detailed consultation records will appear here when the backend supports them.</Text>

      {query.isError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not load consultation history</Text>
          <Pressable onPress={() => void query.refetch()}><Text style={styles.retry}>Try again</Text></Pressable>
        </View>
      ) : null}

      {!query.isError && items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No completed consultations</Text>
          <Text style={styles.emptyText}>Completed appointments will be listed here.</Text>
        </View>
      ) : null}

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.date}>{formatDate(item.starts_at)}</Text>
          <Text style={styles.reference}>Booking {item.booking_reference}</Text>
          <Text style={styles.status}>Completed</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background},
 content:{padding:spacing.lg,paddingBottom:spacing.xl},
 center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"800",fontSize:16,marginBottom:spacing.lg},
 eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
 title:{color:colors.text,fontSize:28,fontWeight:"800",marginTop:4},
 subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:8,marginBottom:spacing.lg},
 card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.md,marginBottom:spacing.sm},
 date:{color:colors.text,fontSize:16,fontWeight:"800"},
 reference:{color:colors.textSecondary,fontSize:13,marginTop:6},
 status:{color:colors.success,fontWeight:"800",marginTop:spacing.sm},
 empty:{padding:spacing.lg,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16},
 emptyTitle:{color:colors.text,fontSize:18,fontWeight:"800"},
 emptyText:{color:colors.textSecondary,lineHeight:21,marginTop:6},
 errorCard:{padding:spacing.md,backgroundColor:colors.primarySoft,borderRadius:16},
 errorTitle:{color:colors.danger,fontWeight:"800"},
 retry:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},
});
