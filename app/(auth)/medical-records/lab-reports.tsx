import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import { getMedicalRecords } from "@/features/medical-records/api";
import type { MedicalRecord } from "@/features/medical-records/types";
import { filterLabReportsByCategory, getLabReportCategories } from "@/features/medical-records/labReportFilter";

function isLabReport(record: MedicalRecord) {
  return record.category.trim().toLowerCase() === "lab";
}

export default function LabReportsScreen() {
  const [category, setCategory] = useState("all");
  const recordsQuery = useQuery({ queryKey: ["medical-records"], queryFn: getMedicalRecords });

  if (recordsQuery.isLoading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading lab reports…</Text></View>;
  }

  if (recordsQuery.isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load lab reports</Text>
        <Text style={styles.muted}>{normalizeApiError(recordsQuery.error).message}</Text>
        <Pressable onPress={() => void recordsQuery.refetch()} style={styles.retry}><Text style={styles.retryText}>Retry</Text></Pressable>
      </View>
    );
  }

  const reports = (recordsQuery.data ?? []).filter(isLabReport);
  const categories = getLabReportCategories(reports);
  const filteredReports = filterLabReportsByCategory(reports, category);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>MY HEALTH</Text>
      <Text style={styles.title}>Lab reports</Text>
      <Text style={styles.subtitle}>Lab reports available in your medical records.</Text>

      {reports.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {["all", ...categories].map((value) => (
            <Pressable key={value} onPress={() => setCategory(value)} style={[styles.filterChip, category === value && styles.filterChipActive]}>
              <Text style={[styles.filterText, category === value && styles.filterTextActive]}>{value === "all" ? "All" : value}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredReports.length ? styles.list : styles.emptyList}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{reports.length ? "No matching lab reports" : "No lab reports yet"}</Text><Text style={styles.muted}>{reports.length ? "Try another category." : "Lab records will appear here when your healthcare data includes a Lab category."}</Text></View>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/(auth)/medical-records/${item.id}`)}>
            <View style={styles.copy}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.meta}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.open}>Open →</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background,padding:spacing.lg},
  back:{color:colors.primary,fontWeight:"800",marginBottom:spacing.lg},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},
  subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:spacing.sm,marginBottom:spacing.md},
  filters:{gap:spacing.sm,paddingBottom:spacing.md},
  filterChip:{paddingHorizontal:spacing.md,paddingVertical:spacing.sm,borderRadius:999,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  filterChipActive:{backgroundColor:colors.primary,borderColor:colors.primary},
  filterText:{color:colors.textSecondary,fontSize:12,fontWeight:"700"},
  filterTextActive:{color:"#fff"},
  list:{gap:spacing.sm,paddingBottom:spacing.xl},
  emptyList:{flexGrow:1,justifyContent:"center"},
  card:{padding:spacing.md,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  copy:{flex:1,marginRight:spacing.sm},
  cardTitle:{color:colors.text,fontWeight:"800",fontSize:15},
  meta:{color:colors.textMuted,fontSize:12,marginTop:4},
  open:{color:colors.primary,fontWeight:"800"},
  empty:{alignItems:"center",padding:spacing.xl},
  emptyTitle:{color:colors.text,fontSize:18,fontWeight:"800"},
  center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg},
  muted:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:spacing.xs,textAlign:"center"},
  errorTitle:{color:colors.text,fontSize:18,fontWeight:"800",textAlign:"center"},
  retry:{marginTop:spacing.md,paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,borderRadius:12,backgroundColor:colors.primary},
  retryText:{color:"#fff",fontWeight:"800"},
});
