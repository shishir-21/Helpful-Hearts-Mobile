import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getHealthTimeline } from "@/features/health-timeline/api";
import { filterHealthTimeline, type HealthTimelineFilter } from "@/features/health-timeline/filter";
import { colors, spacing, typography } from "@/theme";

export default function HealthTimelineScreen() {
  const [filter, setFilter] = useState<HealthTimelineFilter>("all");
  const query = useQuery({ queryKey: ["health-timeline"], queryFn: getHealthTimeline });

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading your health timeline…</Text></View>;
  if (query.isError) return <View style={styles.center}><Text style={styles.errorTitle}>Could not load your timeline</Text><Text style={styles.muted}>Please check your connection and try again.</Text><Pressable onPress={() => void query.refetch()} style={styles.retry}><Text style={styles.retryText}>Retry</Text></Pressable></View>;

  const items = query.data ?? [];
  const filteredItems = filterHealthTimeline(items, filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>MY HEALTH</Text>
      <Text style={styles.title}>Health timeline</Text>
      <Text style={styles.subtitle}>A chronological view of your appointments, prescriptions, and medical records.</Text>

      {items.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {([
            ["all", "All"],
            ["appointment", "Appointments"],
            ["prescription", "Prescriptions"],
            ["medical-record", "Medical records"],
          ] as const).map(([value, label]) => (
            <Pressable key={value} onPress={() => setFilter(value)} style={[styles.filterChip, filter === value && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {filteredItems.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyTitle}>{items.length === 0 ? "No health activity yet" : "No matching activity"}</Text><Text style={styles.muted}>{items.length === 0 ? "Your appointments, prescriptions, and medical records will appear here." : "Try another timeline filter."}</Text></View>
      ) : (
        <View style={styles.timeline}>
          {filteredItems.map((item) => (
            <Pressable key={item.id} style={styles.item} onPress={() => {
              if (item.kind === "appointment") router.push(`/(auth)/appointments/${item.appointment.id}`);
              else if (item.kind === "prescription") router.push(`/(auth)/prescriptions/${item.prescription.id}`);
              else router.push(`/(auth)/medical-records/${item.record.id}`);
            }}>
              <View style={styles.dot} />
              <View style={styles.itemBody}>
                <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                <Text style={styles.open}>Open →</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,paddingBottom:spacing.xl},
  back:{color:colors.primary,fontWeight:"800",marginBottom:spacing.lg},eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.sm},subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:spacing.sm,marginBottom:spacing.md},
  filters:{gap:spacing.sm,paddingBottom:spacing.lg},filterChip:{paddingHorizontal:spacing.md,paddingVertical:spacing.sm,borderRadius:999,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  filterChipActive:{backgroundColor:colors.primary,borderColor:colors.primary},filterText:{color:colors.textSecondary,fontSize:12,fontWeight:"700"},filterTextActive:{color:"#fff"},
  timeline:{gap:spacing.md},item:{flexDirection:"row",gap:spacing.md,paddingBottom:spacing.sm},dot:{width:12,height:12,borderRadius:6,backgroundColor:colors.primary,marginTop:5},
  itemBody:{flex:1,padding:spacing.md,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface},
  date:{color:colors.textMuted,fontSize:11,fontWeight:"700"},itemTitle:{color:colors.text,fontSize:16,fontWeight:"800",marginTop:4},itemSubtitle:{color:colors.textSecondary,fontSize:13,marginTop:4},
  open:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.lg},
  muted:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:spacing.xs,textAlign:"center"},errorTitle:{color:colors.text,fontSize:18,fontWeight:"800",textAlign:"center"},
  retry:{marginTop:spacing.md,paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,borderRadius:12,backgroundColor:colors.primary},retryText:{color:"#fff",fontWeight:"800"},
  empty:{padding:spacing.lg,borderRadius:18,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,alignItems:"center"},emptyTitle:{color:colors.text,fontSize:17,fontWeight:"800"}
});
