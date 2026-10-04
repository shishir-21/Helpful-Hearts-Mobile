import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import { getMedicalRecord } from "@/features/medical-records/api";

export default function MedicalRecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recordQuery = useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => getMedicalRecord(id),
    enabled: Boolean(id),
  });

  if (recordQuery.isLoading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading record…</Text></View>;
  }

  if (recordQuery.isError || !recordQuery.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load this record</Text>
        <Text style={styles.muted}>{recordQuery.error ? normalizeApiError(recordQuery.error).message : "The requested record was not found."}</Text>
        <Pressable onPress={() => void recordQuery.refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const record = recordQuery.data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>MEDICAL RECORD</Text>
      <Text style={styles.title}>{record.title}</Text>
      <View style={styles.metaCard}>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{record.category}</Text>
        <Text style={styles.label}>Created</Text>
        <Text style={styles.value}>{new Date(record.created_at).toLocaleDateString()}</Text>
        <Text style={styles.label}>Updated</Text>
        <Text style={styles.value}>{new Date(record.updated_at).toLocaleDateString()}</Text>
      </View>
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Record details</Text>
        <Text style={styles.body}>{record.content ?? "No additional details are available for this record."}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:spacing.lg,paddingBottom:spacing.xl},
  back:{color:colors.primary,fontWeight:"800",marginBottom:spacing.lg},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},
  metaCard:{marginTop:spacing.lg,padding:spacing.md,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  label:{color:colors.textMuted,fontSize:11,fontWeight:"700",marginTop:spacing.sm},
  value:{color:colors.text,fontSize:14,fontWeight:"700",marginTop:3},
  contentCard:{marginTop:spacing.md,padding:spacing.md,borderRadius:16,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border},
  sectionTitle:{color:colors.text,fontSize:16,fontWeight:"800"},
  body:{color:colors.textSecondary,fontSize:14,lineHeight:22,marginTop:spacing.sm},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg},
  muted:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:spacing.xs,textAlign:"center"},
  errorTitle:{color:colors.text,fontSize:18,fontWeight:"800",textAlign:"center"},
  retryButton:{marginTop:spacing.md,paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,borderRadius:12,backgroundColor:colors.primary},
  retryText:{color:"#fff",fontWeight:"800"},
});
