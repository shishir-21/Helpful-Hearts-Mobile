import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import { getMedicalRecords } from "@/features/medical-records/api";
import type { MedicalRecord } from "@/features/medical-records/types";
import { sortLabReports, type LabReportSort } from "@/features/medical-records/labReportSort";
import { searchLabReports } from "@/features/medical-records/labReportSearch";
import { filterLabReportsByDate, type LabReportDateFilter } from "@/features/medical-records/labReportDateFilter";
import { hasActiveLabReportFilters } from "@/features/medical-records/labReportFilters";

function isLabReport(record: MedicalRecord) {
  return record.category.trim().toLowerCase() === "lab";
}

export default function LabReportsScreen() {
  const [sort, setSort] = useState<LabReportSort>("newest");
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<LabReportDateFilter>("all");
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

  const labReports = (recordsQuery.data ?? []).filter(isLabReport);
  const reports = sortLabReports(
    filterLabReportsByDate(searchLabReports(labReports, query), dateFilter),
    sort,
  );
  const hasActiveFilters = hasActiveLabReportFilters(query, dateFilter, sort);

  const clearFilters = () => {
    setQuery("");
    setDateFilter("all");
    setSort("newest");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>MY HEALTH</Text>
          <Text style={styles.title}>Lab reports</Text>
        </View>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear filters</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.subtitle}>Lab reports available in your medical records.</Text>

      <TextInput value={query} onChangeText={setQuery} placeholder="Search lab reports" placeholderTextColor={colors.textMuted} accessibilityLabel="Search lab reports" style={styles.search} />

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Date</Text>
        {(["all", "7d", "30d"] as const).map((filter) => (
          <Pressable key={filter} accessibilityRole="button" accessibilityState={{ selected: dateFilter === filter }} onPress={() => setDateFilter(filter)} style={[styles.filterChip, dateFilter === filter && styles.filterChipActive]}>
            <Text style={[styles.filterText, dateFilter === filter && styles.filterTextActive]}>
              {filter === "all" ? "All time" : filter === "7d" ? "Last 7 days" : "Last 30 days"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort</Text>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: sort === "newest" }} onPress={() => setSort("newest")} style={[styles.sortChip, sort === "newest" && styles.sortChipActive]}>
          <Text style={[styles.sortText, sort === "newest" && styles.sortTextActive]}>Newest</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: sort === "oldest" }} onPress={() => setSort("oldest")} style={[styles.sortChip, sort === "oldest" && styles.sortChipActive]}>
          <Text style={[styles.sortText, sort === "oldest" && styles.sortTextActive]}>Oldest</Text>
        </Pressable>
      </View>

      <FlatList
        data={reports}
        refreshing={recordsQuery.isRefetching}
        onRefresh={() => void recordsQuery.refetch()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={reports.length ? styles.list : styles.emptyList}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{query.trim() ? "No matching lab reports" : "No lab reports yet"}</Text>
            <Text style={styles.muted}>
              {query.trim()
                ? "Try a different report title or date range."
                : dateFilter !== "all"
                  ? "No lab reports match the selected date range."
                  : "Lab records will appear here when your healthcare data includes a Lab category."}
            </Text>
          </View>
        }
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
  headerRow:{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between",gap:spacing.sm},
  headerCopy:{flex:1},
  clearButton:{paddingHorizontal:spacing.sm,paddingVertical:spacing.xs,borderRadius:10,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  clearText:{color:colors.primary,fontSize:12,fontWeight:"800"},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},
  subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:spacing.sm,marginBottom:spacing.md},
  search:{borderWidth:1,borderColor:colors.border,borderRadius:12,backgroundColor:colors.surface,color:colors.text,paddingHorizontal:spacing.md,paddingVertical:spacing.sm,marginBottom:spacing.md},
  filterRow:{flexDirection:"row",alignItems:"center",gap:spacing.xs,marginBottom:spacing.sm,flexWrap:"wrap"},
  filterLabel:{color:colors.textSecondary,fontSize:13,fontWeight:"700",marginRight:spacing.xs},
  filterChip:{paddingHorizontal:spacing.md,paddingVertical:spacing.xs,borderRadius:999,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  filterChipActive:{backgroundColor:colors.primary,borderColor:colors.primary},
  filterText:{color:colors.textSecondary,fontSize:12,fontWeight:"700"},
  filterTextActive:{color:"#fff"},
  sortRow:{flexDirection:"row",alignItems:"center",gap:spacing.xs,marginBottom:spacing.md},
  sortLabel:{color:colors.textSecondary,fontSize:13,fontWeight:"700",marginRight:spacing.xs},
  sortChip:{paddingHorizontal:spacing.md,paddingVertical:spacing.xs,borderRadius:999,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  sortChipActive:{backgroundColor:colors.primary,borderColor:colors.primary},
  sortText:{color:colors.textSecondary,fontSize:12,fontWeight:"700"},
  sortTextActive:{color:"#fff"},
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