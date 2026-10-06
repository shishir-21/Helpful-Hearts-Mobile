import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, spacing, typography } from "@/theme";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getHealthDashboardSummary } from "@/features/health-dashboard/api";
import { signOut } from "@/features/auth/signOut";
import DoctorHomeScreen from "./doctor/index";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const isDoctor = user?.role === "doctor";
  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const dashboardQuery = useQuery({
    queryKey: ["health-dashboard"],
    queryFn: getHealthDashboardSummary,
    enabled: !isDoctor,
  });

  if (isDoctor) return <DoctorHomeScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}><View style={styles.headerCopy}><Text style={styles.eyebrow}>HELPFUL-HEARTS</Text><Text style={styles.title}>Hello, {firstName}</Text></View><Pressable style={styles.profileButton} onPress={() => router.push("/(auth)/profile")}><Text style={styles.profileText}>Profile</Text></Pressable></View>
      <Text style={styles.subtitle}>Find trusted care and manage your healthcare in one place.</Text>
      <View style={styles.dashboardCard}>
        <View style={styles.dashboardHeader}>
          <View style={styles.dashboardCopy}>
            <Text style={styles.infoTitle}>Health overview</Text>
            <Text style={styles.infoText}>A quick view of your current healthcare activity.</Text>
          </View>
          <Pressable onPress={() => router.push("/(auth)/health-timeline")}>
            <Text style={styles.dashboardAction}>Timeline →</Text>
          </Pressable>
        </View>
        {dashboardQuery.isLoading ? (
          <View style={styles.dashboardState}><ActivityIndicator /><Text style={styles.infoText}>Loading health data…</Text></View>
        ) : dashboardQuery.isError ? (
          <View style={styles.dashboardState}>
            <Text style={styles.infoText}>Could not load your health overview.</Text>
            <Pressable onPress={() => void dashboardQuery.refetch()}><Text style={styles.dashboardAction}>Retry</Text></Pressable>
          </View>
        ) : (
          <View>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={styles.statValue}>{dashboardQuery.data?.medicalRecordCount ?? 0}</Text><Text style={styles.statLabel}>Records</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>{dashboardQuery.data?.prescriptionCount ?? 0}</Text><Text style={styles.statLabel}>Prescriptions</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>{dashboardQuery.data?.upcomingAppointment ? "1" : "0"}</Text><Text style={styles.statLabel}>Upcoming</Text></View>
            </View>
            <Text style={styles.latestLabel}>Latest activity</Text>
            <Text style={styles.latestText} numberOfLines={1}>
              {dashboardQuery.data?.latestActivity?.title ?? "No health activity yet"}
            </Text>
            {dashboardQuery.data?.upcomingAppointment ? (
              <Pressable onPress={() => router.push("/(auth)/appointments")} style={styles.upcoming}>
                <Text style={styles.upcomingTitle}>Next appointment</Text>
                <Text style={styles.upcomingText}>{new Date(dashboardQuery.data.upcomingAppointment.starts_at).toLocaleString()}</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </View>
      <Pressable style={styles.primaryCard} onPress={() => router.push("/(auth)/doctors")}><Text style={styles.cardEyebrow}>CARE DISCOVERY</Text><Text style={styles.cardTitle}>Find a doctor</Text><Text style={styles.cardText}>Search verified doctors by name or specialty and check their availability.</Text><Text style={styles.cardAction}>Browse doctors →</Text></Pressable>
      <Pressable style={styles.assistantCard} onPress={() => router.push("/(auth)/assistant")}><View style={styles.appointmentsText}><Text style={styles.infoTitle}>AI health assistant</Text><Text style={styles.infoText}>Ask general health questions with clear safety boundaries.</Text></View><Text style={styles.appointmentsAction}>Ask →</Text></Pressable>
      <Pressable style={styles.prescriptionsCard} onPress={() => router.push("/(auth)/health-timeline")}><View style={styles.appointmentsText}><Text style={styles.infoTitle}>Health timeline</Text><Text style={styles.infoText}>See appointments, prescriptions, and medical records in chronological order.</Text></View><Text style={styles.appointmentsAction}>Open →</Text></Pressable>
      <Pressable style={styles.prescriptionsCard} onPress={() => router.push("/(auth)/consultation")}><View style={styles.appointmentsText}><Text style={styles.infoTitle}>Consultation history</Text><Text style={styles.infoText}>View completed appointments and consultation status.</Text></View><Text style={styles.appointmentsAction}>Open →</Text></Pressable>
      <Pressable style={styles.prescriptionsCard} onPress={() => router.push("/(auth)/prescriptions")}><View style={styles.appointmentsText}><Text style={styles.infoTitle}>My prescriptions</Text><Text style={styles.infoText}>Upload, review OCR, and request an educational explanation.</Text></View><Text style={styles.appointmentsAction}>Open →</Text></Pressable>
      <Pressable style={styles.prescriptionsCard} onPress={() => router.push("/(auth)/medical-records")}><View style={styles.appointmentsText}><Text style={styles.infoTitle}>Medical records</Text><Text style={styles.infoText}>View your healthcare records and open individual record details.</Text></View><Text style={styles.appointmentsAction}>Open →</Text></Pressable>
      <Pressable style={styles.appointmentsCard} onPress={() => router.push("/(auth)/appointments")}><View style={styles.appointmentsText}><Text style={styles.infoTitle}>My appointments</Text><Text style={styles.infoText}>View your upcoming and past bookings.</Text></View><Text style={styles.appointmentsAction}>View →</Text></Pressable>
      <View style={styles.row}><View style={styles.infoCard}><Text style={styles.infoTitle}>Verified doctors</Text><Text style={styles.infoText}>Profiles are shown only after verification.</Text></View><View style={styles.infoCard}><Text style={styles.infoTitle}>Your privacy</Text><Text style={styles.infoText}>Sensitive data stays behind the secure API.</Text></View></View>
      <Pressable onPress={() => void signOut().then(() => router.replace("/(public)"))} style={styles.signOut}><Text style={styles.signOutText}>Sign out</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
container:{flex:1,padding:spacing.lg,paddingTop:spacing.xl,backgroundColor:colors.background},dashboardCard:{marginTop:spacing.md,padding:spacing.md,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},dashboardHeader:{flexDirection:"row",alignItems:"center"},dashboardCopy:{flex:1},dashboardAction:{color:colors.primary,fontWeight:"800",marginLeft:spacing.sm},dashboardState:{flexDirection:"row",alignItems:"center",gap:spacing.sm,marginTop:spacing.md},statsRow:{flexDirection:"row",gap:spacing.sm,marginTop:spacing.md},stat:{flex:1,padding:spacing.sm,borderRadius:12,backgroundColor:colors.background,alignItems:"center"},statValue:{color:colors.text,fontSize:18,fontWeight:"800"},statLabel:{color:colors.textSecondary,fontSize:10,fontWeight:"700",marginTop:2},latestLabel:{color:colors.textMuted,fontSize:10,fontWeight:"700",marginTop:spacing.md,textTransform:"uppercase"},latestText:{color:colors.text,fontSize:13,fontWeight:"700",marginTop:3},upcoming:{marginTop:spacing.sm,padding:spacing.sm,borderRadius:12,backgroundColor:colors.primarySoft},upcomingTitle:{color:colors.primary,fontSize:11,fontWeight:"800"},upcomingText:{color:colors.textSecondary,fontSize:12,marginTop:3},topRow:{flexDirection:"row",alignItems:"center"},headerCopy:{flex:1},profileButton:{paddingHorizontal:spacing.md,paddingVertical:spacing.sm,borderRadius:12,backgroundColor:colors.primarySoft},profileText:{color:colors.primary,fontWeight:"800"},eyebrow:{color:colors.primary,fontSize:12,fontWeight:"800",letterSpacing:1.2},title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},subtitle:{color:colors.textSecondary,fontSize:typography.body,lineHeight:24,marginTop:spacing.sm,marginBottom:spacing.lg},primaryCard:{backgroundColor:colors.primary,borderRadius:20,padding:spacing.lg},cardEyebrow:{color:"#FDECEC",fontSize:12,fontWeight:"800",letterSpacing:1},cardTitle:{color:"#fff",fontSize:24,fontWeight:"800",marginTop:spacing.sm},cardText:{color:"#FFF7F7",fontSize:14,lineHeight:21,marginTop:spacing.sm},cardAction:{color:"#fff",fontWeight:"800",marginTop:spacing.lg},row:{flexDirection:"row",gap:spacing.sm,marginTop:spacing.md},infoCard:{flex:1,padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:16,backgroundColor:colors.surface},infoTitle:{fontWeight:"800",color:colors.text,fontSize:14},infoText:{fontSize:12,color:colors.textSecondary,lineHeight:18,marginTop:6},assistantCard:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:spacing.md,padding:spacing.md,borderWidth:1,borderColor:"#F4CACA",borderRadius:16,backgroundColor:colors.primarySoft},appointmentsCard:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:spacing.md,padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:16,backgroundColor:colors.surface},prescriptionsCard:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:spacing.md,padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:16,backgroundColor:colors.surface},appointmentsText:{flex:1},appointmentsAction:{color:colors.primary,fontWeight:"800",marginLeft:spacing.sm},signOut:{marginTop:"auto",paddingVertical:spacing.md,alignItems:"center"},signOutText:{color:colors.textSecondary,fontWeight:"700"}});