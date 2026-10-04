import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import { getMedicalRecords } from "@/features/medical-records/api";
import { filterMedicalRecords } from "@/features/medical-records/search";
import type { MedicalRecord } from "@/features/medical-records/types";

export default function MedicalRecordsScreen() {
  const [query, setQuery] = useState("");
  const recordsQuery = useQuery({ queryKey: ["medical-records"], queryFn: getMedicalRecords });

  if (recordsQuery.isLoading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading medical records…</Text></View>;
  if (recordsQuery.isError) return <View style={styles.center}><Text style={styles.errorTitle}>Could not load medical records</Text><Text style={styles.muted}>{normalizeApiError(recordsQuery.error).message}</Text><Pressable onPress={() => void recordsQuery.refetch()} style={styles.retry}><Text style={styles.retryText}>Retry</Text></Pressable></View>;

  const records = recordsQuery.data ?? [];
  const filteredRecords = useMemo(() => filterMedicalRecords(records, query), [records, query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable><View style={styles.headerCopy}><Text style={styles.eyebrow}>MY HEALTH</Text><Text style={styles.title}>Medical records</Text></View></View>
      <Text style={styles.subtitle}>Keep your healthcare history available when you need it.</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search by title or category" placeholderTextColor={colors.textMuted} style={styles.search} accessibilityLabel="Search medical records" />
      <Pressable style={styles.labButton} onPress={() => router.push("/(auth)/medical-records/lab-reports")}><View style={styles.labCopy}><Text style={styles.labTitle}>Lab reports</Text><Text style={styles.labText}>View records categorized as lab reports.</Text></View><Text style={styles.open}>Open →</Text></Pressable>
      <FlatList data={filteredRecords} keyExtractor={(item) => item.id} contentContainerStyle={filteredRecords.length ? styles.list : styles.emptyList}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{query.trim() ? "No matching records" : "No medical records yet"}</Text><Text style={styles.muted}>{query.trim() ? "Try a different title or category." : "Your medical records will appear here when they are available."}</Text></View>}
        renderItem={({ item }: { item: MedicalRecord }) => <Pressable style={styles.card} onPress={() => router.push(`/(auth)/medical-records/${item.id}`)}><View style={styles.cardCopy}><Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text><Text style={styles.meta}>{item.category}</Text><Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text></View><Text style={styles.open}>Open →</Text></Pressable>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
container:{flex:1,backgroundColor:colors.background,padding:spacing.lg},header:{flexDirection:"row",alignItems:"center",gap:spacing.md},back:{color:colors.primary,fontWeight:"800"},headerCopy:{flex:1},eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:2},subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:spacing.md,marginBottom:spacing.md},search:{height:48,borderWidth:1,borderColor:colors.border,borderRadius:14,paddingHorizontal:spacing.md,color:colors.text,backgroundColor:colors.surface,marginBottom:spacing.md},labButton:{padding:spacing.md,borderRadius:16,borderWidth:1,borderColor:"#F4CACA",backgroundColor:colors.primarySoft,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:spacing.md},labCopy:{flex:1,marginRight:spacing.sm},labTitle:{color:colors.primary,fontWeight:"800",fontSize:15},labText:{color:colors.textSecondary,fontSize:12,lineHeight:18,marginTop:4},list:{gap:spacing.sm,paddingBottom:spacing.xl},emptyList:{flexGrow:1,justifyContent:"center"},card:{padding:spacing.md,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},cardCopy:{flex:1,marginRight:spacing.sm},cardTitle:{color:colors.text,fontWeight:"800",fontSize:15},meta:{color:colors.primary,fontSize:12,fontWeight:"700",marginTop:5},date:{color:colors.textMuted,fontSize:12,marginTop:3},open:{color:colors.primary,fontWeight:"800"},center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg},muted:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:spacing.xs,textAlign:"center"},errorTitle:{color:colors.text,fontSize:18,fontWeight:"800",textAlign:"center"},retry:{marginTop:spacing.md,paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,borderRadius:12,backgroundColor:colors.primary},retryText:{color:"#fff",fontWeight:"800"},empty:{alignItems:"center",padding:spacing.xl},emptyTitle:{color:colors.text,fontSize:18,fontWeight:"800"}
});