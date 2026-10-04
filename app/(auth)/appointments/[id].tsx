import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  cancelAppointment,
  getDoctorAvailability,
  getMyAppointment,
  rescheduleAppointment,
  type AvailabilitySlot,
} from "@/features/appointments/api";
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

function localDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getMyAppointment(id!),
    enabled: Boolean(id),
  });

  const cancellation = useMutation({
    mutationFn: () => cancelAppointment(id!),
    onSuccess: () => void appointment.refetch(),
    onError: () => Alert.alert("Cancellation failed", "We could not cancel this appointment. Please try again."),
  });

  const reschedule = useMutation({
    mutationFn: (slot: AvailabilitySlot) => rescheduleAppointment(id!, appointment.data!.doctor_id, slot.starts_at),
    onSuccess: () => {
      void appointment.refetch();
      Alert.alert("Appointment rescheduled", "Your appointment time has been updated.");
    },
    onError: () => Alert.alert("Rescheduling failed", "That slot is no longer available. Please choose another slot."),
  });

  const availability = useQuery({
    queryKey: ["doctor-availability", appointment.data?.doctor_id],
    queryFn: () => getDoctorAvailability(appointment.data!.doctor_id, localDate(new Date())),
    enabled: appointment.data?.status === "confirmed",
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
  const selectableSlots = (availability.data ?? [])
    .filter((slot) => new Date(slot.starts_at).getTime() !== new Date(item.starts_at).getTime())
    .slice(0, 12);

  const confirmCancellation = () => {
    Alert.alert(
      "Cancel appointment?",
      "This appointment will be marked as cancelled and will remain in your appointment history.",
      [
        { text: "Keep appointment", style: "cancel" },
        { text: "Cancel appointment", style: "destructive", onPress: () => cancellation.mutate() },
      ],
    );
  };

  const confirmReschedule = (slot: AvailabilitySlot) => {
    Alert.alert(
      "Reschedule appointment?",
      `Move your appointment to ${formatDate(slot.starts_at)}?`,
      [
        { text: "Keep current time", style: "cancel" },
        { text: "Reschedule", onPress: () => reschedule.mutate(slot) },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.title}>Appointment details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.status, item.status === "cancelled" && styles.cancelledStatus]}>{item.status}</Text>
        <Text style={styles.label}>Date and time</Text>
        <Text style={styles.value}>{formatDate(item.starts_at)}</Text>
        <Text style={styles.label}>Booking reference</Text>
        <Text style={styles.value}>{item.booking_reference}</Text>
        {item.reason ? <><Text style={styles.label}>Reason</Text><Text style={styles.value}>{item.reason}</Text></> : null}

        {item.status === "confirmed" ? (
          <>
            <Pressable
              style={styles.consultationButton}
              onPress={() => router.push(`/(auth)/consultation/appointment?appointmentId=${item.id}`)}
            >
              <Text style={styles.consultationButtonText}>Open waiting room</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Reschedule</Text>
            {availability.isLoading ? <ActivityIndicator /> : null}
            {availability.isError ? <Text style={styles.error}>Available slots could not be loaded.</Text> : null}
            {!availability.isLoading && !availability.isError && selectableSlots.length === 0
              ? <Text style={styles.muted}>No other slots are currently available.</Text>
              : null}
            {selectableSlots.map((slot) => (
              <Pressable
                key={slot.starts_at}
                style={styles.slotButton}
                onPress={() => confirmReschedule(slot)}
                disabled={reschedule.isPending}
              >
                <Text style={styles.slotText}>{formatDate(slot.starts_at)}</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.cancelButton}
              onPress={confirmCancellation}
              disabled={cancellation.isPending || reschedule.isPending}
            >
              {cancellation.isPending
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.cancelButtonText}>Cancel appointment</Text>}
            </Pressable>
          </>
        ) : null}
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
  cancelledStatus:{color:colors.danger},
  error:{color:colors.danger,fontSize:14,textAlign:"center",marginBottom:spacing.md},
  muted:{color:colors.textMuted,fontSize:14,marginTop:spacing.sm},
  sectionTitle:{fontSize:18,fontWeight:"800",color:colors.text,marginTop:spacing.xl,marginBottom:spacing.sm},
  consultationButton:{marginTop:spacing.lg,backgroundColor:colors.primary,borderRadius:12,padding:spacing.md,alignItems:"center"},
  consultationButtonText:{color:"#fff",fontWeight:"800"},
  slotButton:{borderWidth:1,borderColor:colors.border,borderRadius:12,padding:spacing.md,marginTop:spacing.sm,backgroundColor:colors.background},
  slotText:{color:colors.text,fontWeight:"700"},
  cancelButton:{marginTop:spacing.lg,backgroundColor:colors.danger,borderRadius:12,padding:spacing.md,alignItems:"center"},
  cancelButtonText:{color:"#fff",fontWeight:"800"},
});
