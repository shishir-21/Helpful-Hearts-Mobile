import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}><Text style={styles.badgeText}>HELPFUL-HEARTS</Text></View>
      <Text style={styles.title}>Healthcare, made easier.</Text>
      <Text style={styles.subtitle}>
        Find trusted care, manage appointments, and get clear health information in one place.
      </Text>
      <Link href="/(public)/login" style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Get started</Text>
      </Link>
      <Link href="/(public)/register" style={styles.registerLink}><Text style={styles.registerText}>Create a patient account</Text></Link>
      <Text style={styles.disclaimer}>
        Health information is educational and does not replace professional medical advice.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:spacing.xl,backgroundColor:colors.background},
  badge:{alignSelf:"flex-start",borderRadius:999,backgroundColor:colors.primarySoft,paddingHorizontal:spacing.md,paddingVertical:spacing.xs,marginBottom:spacing.lg},
  badgeText:{color:colors.primary,fontSize:12,fontWeight:"700",letterSpacing:1.2},
  title:{color:colors.text,fontSize:typography.display,lineHeight:44,fontWeight:"800",marginBottom:spacing.md},
  subtitle:{color:colors.textSecondary,fontSize:typography.body,lineHeight:24,marginBottom:spacing.xl},
  primaryButton:{alignSelf:"stretch",backgroundColor:colors.primary,borderRadius:14,paddingVertical:spacing.md,alignItems:"center"},
  primaryButtonText:{color:"#FFFFFF",fontSize:typography.body,fontWeight:"700"},
  registerLink:{marginTop: spacing.md},
  registerText:{color:colors.primary,fontWeight:"700",textAlign:"center"},
  disclaimer:{marginTop:spacing.lg,color:colors.textMuted,fontSize:12,lineHeight:18}
});