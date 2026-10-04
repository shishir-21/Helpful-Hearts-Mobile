import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDoctor } from "@/features/doctors/api";
import { createAppointment } from "@/features/appointments/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookAppointmentScreen() {
  const { id, startsAt } = useLocalSearchParams<{ id: string; startsAt: string }>();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");

  const doctor = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctor(id!),
    enabled: Boolean(id),
  });

  const booking = useMutation({
    mutationFn: () => createAppointment({
      doctor_id: id!,
      starts_at: startsAt!,
      reason: reason.trim() || undefined,
    }),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.replace(`/(auth)/appointments/${appointment.id}`);
    },
  });

  if (doctor.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;

  if (doctor.isError || !doctor.data || !startsAt) {
    return <View style={styles.center}><Text style={styles.error}>Booking information could not be loaded.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.title}>Confirm appointment</Text>
      <View style={styles.summary}>
        <Text style={styles.doctor}>{doctor.data.full_name}</Text>
        <Text style={styles.specialty}>{doctor.data.specialty}</Text>
        <Text style={styles.date}>{formatDate(startsAt)}</Text>
      </View>

      <Text style={styles.label}>Reason for visit (optional)</Text>
      <TextInput
        value={reason}
        onChangeText={setReason}
        placeholder="Briefly describe why you need an appointment"
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={2000}
        style={styles.textarea}
      />

      {booking.isError ? <Text style={styles.error}>This slot may no longer be available. Please go back and choose another slot.</Text> : null}

      <Pressable
        style={[styles.button, booking.isPending && styles.buttonDisabled]}
        disabled={booking.isPending}
        onPress={() => booking.mutate()}
      >
        {booking.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm booking</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background},
 content:{padding:spacing.lg,paddingBottom:spacing.xl},
 center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg,backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"700",fontSize:16,marginBottom:spacing.xl},
 title:{fontSize:28,fontWeight:"800",color:colors.text},
 summary:{marginTop:spacing.lg,padding:spacing.lg,borderRadius:16,backgroundColor:colors.primarySoft},
 doctor:{fontSize:20,fontWeight:"800",color:colors.text},
 specialty:{fontSize:15,fontWeight:"700",color:colors.primary,marginTop:4},
 date:{fontSize:15,color:colors.textSecondary,lineHeight:22,marginTop:spacing.md},
 label:{fontSize:14,fontWeight:"800",color:colors.text,marginTop:spacing.xl,marginBottom:spacing.sm},
 textarea:{minHeight:120,borderWidth:1,borderColor:colors.border,borderRadius:14,padding:spacing.md,backgroundColor:colors.surface,color:colors.text,textAlignVertical:"top",fontSize:15},
 error:{color:colors.danger,fontSize:14,lineHeight:21,marginTop:spacing.md},
 button:{marginTop:spacing.lg,minHeight:52,borderRadius:14,backgroundColor:colors.primary,alignItems:"center",justifyContent:"center"},
 buttonDisabled:{opacity:0.65},
 buttonText:{color:"#fff",fontSize:16,fontWeight:"800"},
});
