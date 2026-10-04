import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>
        Authentication is the next feature phase. The route is intentionally in place so navigation
        remains stable while the auth domain is implemented.
      </Text>
      <Link href="/(public)" style={styles.link}><Text style={styles.linkText}>Back to welcome</Text></Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:spacing.xl,backgroundColor:colors.background},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginBottom:spacing.sm},
  subtitle:{color:colors.textSecondary,fontSize:typography.body,lineHeight:24,marginBottom:spacing.lg},
  link:{paddingVertical:spacing.md},
  linkText:{color:colors.primary,fontWeight:"700"}
});