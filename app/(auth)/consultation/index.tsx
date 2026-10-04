import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getConsultationHistory } from "@/features/consultation/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { weekday:"long", month:"long", day:"numeric", hour:"numeric", minute:"2-digit" });
}

export default function ConsultationHistoryScreen() {
  const query = useQuery({ queryKey:["consultation-history"], queryFn:getConsultationHistory });
  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;

  return <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}
  >
    <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
    <Text style={styles.eyebrow}>CONSULTATION</Text>
    <Text style={styles.title}>Consultation history</Text>
    <Text style={styles.subtitle}>Server-backed sessions and saved consultation messages.</Text>
    {query.isError ? <View style={styles.errorCard}><Text style={styles.errorTitle}>Could not load consultation history</Text><Pressable onPress={() => void query.refetch()}><Text style={styles.retry}>Try again</Text></Pressable></View> : null}
    {!query.isError && (query.data ?? []).length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No consultation sessions</Text><Text style={styles.emptyText}>Your consultation will appear here after a waiting room session is created.</Text></View> : null}
    {(query.data ?? []).map((item) => (
      <Pressable key={item.session_id} style={styles.card} onPress={() => router.push(`/(auth)/consultation/chat?sessionId=${item.session_id}`)}>
        <Text style={styles.date}>{formatDate(item.starts_at)}</Text>
        <Text style={styles.reference}>Booking {item.booking_reference}</Text>
        <Text style={styles.status}>{item.status.replace("_"," ")}</Text>
        <Text style={styles.messages}>{item.message_count} saved message{item.message_count === 1 ? "" : "s"}</Text>
        <Text style={styles.action}>Open consultation →</Text>
      </Pressable>
    ))}
  </ScrollView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,paddingBottom:spacing.xl},center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"800",fontSize:16,marginBottom:spacing.lg},eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},title:{color:colors.text,fontSize:28,fontWeight:"800",marginTop:4},subtitle:{color:colors.textSecondary,fontSize:14,lineHeight:21,marginTop:8,marginBottom:spacing.lg},
 card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:spacing.md,marginBottom:spacing.sm},date:{color:colors.text,fontSize:16,fontWeight:"800"},reference:{color:colors.textSecondary,fontSize:13,marginTop:6},status:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm,textTransform:"capitalize"},messages:{color:colors.textSecondary,fontSize:12,marginTop:5},action:{color:colors.primary,fontWeight:"800",marginTop:spacing.md},
 empty:{padding:spacing.lg,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16},emptyTitle:{color:colors.text,fontSize:18,fontWeight:"800"},emptyText:{color:colors.textSecondary,lineHeight:21,marginTop:6},
 errorCard:{padding:spacing.md,backgroundColor:colors.primarySoft,borderRadius:16},errorTitle:{color:colors.danger,fontWeight:"800"},retry:{color:colors.primary,fontWeight:"800",marginTop:spacing.sm},
});
