import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMyAppointment } from "@/features/appointments/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getMyAppointment(id!),
    enabled: Boolean(id),
  });

  if (appointment.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;

  if (appointment.isError || !appointment.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Appointment details could not be loaded.</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>Go back</Text></Pressable>
      </View>
    );
  }

  const item = appointment.data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.title}>Appointment details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{item.status}</Text>
        <Text style={styles.label}>Date and time</Text>
        <Text style={styles.value}>{formatDate(item.starts_at)}</Text>
        <Text style={styles.label}>Booking reference</Text>
        <Text style={styles.value}>{item.booking_reference}</Text>
        {item.reason ? <><Text style={styles.label}>Reason</Text><Text style={styles.value}>{item.reason}</Text></> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:spacing.lg,paddingBottom:spacing.xl},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg,backgroundColor:colors.background},
  back:{color:colors.primary,fontWeight:"700",fontSize:16,marginBottom:spacing.xl},
  title:{fontSize:28,fontWeight:"800",color:colors.text,marginBottom:spacing.lg},
  card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.lg},
  label:{fontSize:12,fontWeight:"800",color:colors.textMuted,textTransform:"uppercase",letterSpacing:0.6,marginTop:spacing.md},
  value:{fontSize:16,color:colors.text,lineHeight:24,marginTop:4},
  status:{fontSize:18,fontWeight:"800",color:colors.success,textTransform:"capitalize",marginTop:4},
  error:{color:colors.danger,fontSize:16,textAlign:"center",marginBottom:spacing.md},
});
