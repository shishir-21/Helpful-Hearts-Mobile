import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getDoctorAvailability } from "@/features/doctors/availability";
import { colors, spacing } from "@/theme";

export default function DoctorAvailabilityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const slots = useQuery({
    queryKey: ["doctor-availability", id],
    queryFn: () => getDoctorAvailability(id!, undefined, 14),
    enabled: Boolean(id),
  });

  if (slots.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
        <Text style={styles.title}>Available slots</Text>
        <Text style={styles.subtitle}>Choose a time that works for you.</Text>
        {slots.isError ? <Text style={styles.error}>Availability could not be loaded.</Text> : null}
        {!slots.isError && !slots.data?.length ? <Text style={styles.empty}>No upcoming slots are available.</Text> : null}
        {slots.data?.map((slot) => (
          <View key={slot.starts_at} style={styles.slot}>
            <View style={styles.slotText}>
              <Text style={styles.date}>{new Date(slot.starts_at).toLocaleDateString()}</Text>
              <Text style={styles.time}>{new Date(slot.starts_at).toLocaleTimeString([], { hour:"numeric", minute:"2-digit" })}</Text>
              <Text style={styles.zone}>{slot.timezone}</Text>
            </View>
            <Text style={styles.available}>Available</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background},
 content:{padding:spacing.lg,paddingBottom:spacing.xl},
 center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"700",fontSize:16,marginBottom:spacing.xl},
 title:{fontSize:28,fontWeight:"800",color:colors.text},
 subtitle:{fontSize:15,color:colors.textSecondary,marginTop:6,marginBottom:spacing.lg},
 slot:{flexDirection:"row",alignItems:"center",padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:14,backgroundColor:colors.surface,marginBottom:spacing.sm},
 slotText:{flex:1},
 date:{fontWeight:"800",color:colors.text,fontSize:15},
 time:{fontWeight:"700",color:colors.primary,fontSize:17,marginTop:3},
 zone:{color:colors.textMuted,fontSize:12,marginTop:3},
 available:{color:colors.success,fontWeight:"700",fontSize:12},
 error:{color:colors.danger},
 empty:{color:colors.textSecondary,marginTop:spacing.lg}
});
