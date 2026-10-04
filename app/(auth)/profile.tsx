import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import { getPatientProfile } from "@/features/profile/api";

export default function ProfileScreen() {
  const profileQuery = useQuery({
    queryKey: ["patient-profile"],
    queryFn: getPatientProfile,
  });

  if (profileQuery.isLoading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading profile…</Text></View>;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load your profile</Text>
        <Text style={styles.muted}>{profileQuery.error ? normalizeApiError(profileQuery.error).message : "Profile data is unavailable."}</Text>
        <Pressable onPress={() => void profileQuery.refetch()} style={styles.retry}><Text style={styles.retryText}>Retry</Text></Pressable>
      </View>
    );
  }

  const user = profileQuery.data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>ACCOUNT</Text>
      <Text style={styles.title}>My profile</Text>

      <View style={styles.hero}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user.full_name.charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Account type</Text>
        <Text style={styles.value}>{user.role}</Text>
        <Text style={styles.label}>Account status</Text>
        <Text style={styles.value}>{user.is_active ? "Active" : "Inactive"}</Text>
        <Text style={styles.label}>Member since</Text>
        <Text style={styles.value}>{new Date(user.created_at).toLocaleDateString()}</Text>
      </View>

      <Pressable onPress={() => void profileQuery.refetch()} style={styles.refresh}>
        <Text style={styles.refreshText}>Refresh profile</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:spacing.lg,paddingBottom:spacing.xl},
  back:{color:colors.primary,fontWeight:"800",marginBottom:spacing.lg},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},
  hero:{alignItems:"center",paddingVertical:spacing.xl},
  avatar:{width:72,height:72,borderRadius:36,backgroundColor:colors.primarySoft,alignItems:"center",justifyContent:"center"},
  avatarText:{color:colors.primary,fontSize:28,fontWeight:"800"},
  name:{color:colors.text,fontSize:20,fontWeight:"800",marginTop:spacing.md},
  email:{color:colors.textSecondary,fontSize:14,marginTop:4},
  card:{padding:spacing.lg,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  label:{color:colors.textMuted,fontSize:11,fontWeight:"700",marginTop:spacing.sm},
  value:{color:colors.text,fontSize:15,fontWeight:"700",marginTop:4,textTransform:"capitalize"},
  refresh:{marginTop:spacing.md,alignItems:"center",padding:spacing.md},
  refreshText:{color:colors.primary,fontWeight:"800"},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg},
  muted:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:spacing.xs,textAlign:"center"},
  errorTitle:{color:colors.text,fontSize:18,fontWeight:"800",textAlign:"center"},
  retry:{marginTop:spacing.md,paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,borderRadius:12,backgroundColor:colors.primary},
  retryText:{color:"#fff",fontWeight:"800"},
});
