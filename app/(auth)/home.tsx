import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";
import { useAuthStore } from "@/stores/authStore";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>GOOD TO SEE YOU</Text>
      <Text style={styles.title}>{user?.full_name ?? "Patient"}</Text>
      <Text style={styles.subtitle}>
        Your Helpful-Hearts care dashboard is ready. Doctor discovery and appointments are next.
      </Text>
      <Link href="/(public)" style={styles.link}><Text style={styles.linkText}>Sign out</Text></Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:spacing.xl,backgroundColor:colors.background},
  eyebrow:{color:colors.primary,fontSize:12,fontWeight:"800",letterSpacing:1.2,marginBottom:spacing.sm},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginBottom:spacing.sm},
  subtitle:{color:colors.textSecondary,fontSize:typography.body,lineHeight:24,marginBottom:spacing.xl},
  link:{paddingVertical:spacing.md},linkText:{color:colors.primary,fontWeight:"700"}
});