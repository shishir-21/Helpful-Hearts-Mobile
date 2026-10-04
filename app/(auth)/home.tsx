import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, spacing, typography } from "@/theme";
import { useAuthStore } from "@/stores/authStore";
import { signOut } from "@/features/auth/signOut";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>HELPFUL-HEARTS</Text>
      <Text style={styles.title}>Hello, {firstName}</Text>
      <Text style={styles.subtitle}>Find trusted care and manage your healthcare in one place.</Text>

      <Pressable style={styles.primaryCard} onPress={() => router.push("/(auth)/doctors")}>
        <Text style={styles.cardEyebrow}>CARE DISCOVERY</Text>
        <Text style={styles.cardTitle}>Find a doctor</Text>
        <Text style={styles.cardText}>Search verified doctors by name or specialty and check their availability.</Text>
        <Text style={styles.cardAction}>Browse doctors →</Text>
      </Pressable>

      <Pressable style={styles.assistantCard} onPress={() => router.push("/(auth)/assistant")}>
        <View style={styles.appointmentsText}>
          <Text style={styles.infoTitle}>AI health assistant</Text>
          <Text style={styles.infoText}>Ask general health questions with clear safety boundaries.</Text>
        </View>
        <Text style={styles.appointmentsAction}>Ask →</Text>
      </Pressable>

      <Pressable style={styles.appointmentsCard} onPress={() => router.push("/(auth)/appointments")}>
        <View style={styles.appointmentsText}>
          <Text style={styles.infoTitle}>My appointments</Text>
          <Text style={styles.infoText}>View your upcoming and past bookings.</Text>
        </View>
        <Text style={styles.appointmentsAction}>View →</Text>
      </Pressable>

      <View style={styles.row}>
        <View style={styles.infoCard}><Text style={styles.infoTitle}>Verified doctors</Text><Text style={styles.infoText}>Profiles are shown only after verification.</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoTitle}>Your privacy</Text><Text style={styles.infoText}>Sensitive data stays behind the secure API.</Text></View>
      </View>

      <Pressable onPress={() => void signOut().then(() => router.replace("/(public)"))} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:spacing.lg,paddingTop:spacing.xl,backgroundColor:colors.background},
  eyebrow:{color:colors.primary,fontSize:12,fontWeight:"800",letterSpacing:1.2},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},
  subtitle:{color:colors.textSecondary,fontSize:typography.body,lineHeight:24,marginTop:spacing.sm,marginBottom:spacing.lg},
  primaryCard:{backgroundColor:colors.primary,borderRadius:20,padding:spacing.lg},
  cardEyebrow:{color:"#FDECEC",fontSize:12,fontWeight:"800",letterSpacing:1},
  cardTitle:{color:"#fff",fontSize:24,fontWeight:"800",marginTop:spacing.sm},
  cardText:{color:"#FFF7F7",fontSize:14,lineHeight:21,marginTop:spacing.sm},
  cardAction:{color:"#fff",fontWeight:"800",marginTop:spacing.lg},
  row:{flexDirection:"row",gap:spacing.sm,marginTop:spacing.md},
  infoCard:{flex:1,padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:16,backgroundColor:colors.surface},
  infoTitle:{fontWeight:"800",color:colors.text,fontSize:14},
  infoText:{fontSize:12,color:colors.textSecondary,lineHeight:18,marginTop:6},
  assistantCard:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:spacing.md,padding:spacing.md,borderWidth:1,borderColor:"#F4CACA",borderRadius:16,backgroundColor:colors.primarySoft},
  appointmentsCard:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:spacing.md,padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:16,backgroundColor:colors.surface},
  appointmentsText:{flex:1},
  appointmentsAction:{color:colors.primary,fontWeight:"800",marginLeft:spacing.sm},
  signOut:{marginTop:"auto",paddingVertical:spacing.md,alignItems:"center"},
  signOutText:{color:colors.textSecondary,fontWeight:"700"}
});