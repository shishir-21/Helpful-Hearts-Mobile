import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getDoctor } from "@/features/doctors/api";
import { colors, spacing } from "@/theme";

export default function DoctorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useQuery({ queryKey: ["doctor", id], queryFn: () => getDoctor(id!), enabled: Boolean(id) });

  if (doctor.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (doctor.isError || !doctor.data) return <View style={styles.center}><Text style={styles.error}>Doctor profile could not be loaded.</Text></View>;

  const item = doctor.data;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <View style={styles.avatar}><Text style={styles.avatarText}>{item.full_name.slice(0,1).toUpperCase()}</Text></View>
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.specialty}>{item.specialty}</Text>
      {item.hospital_name ? <Text style={styles.meta}>{item.hospital_name}</Text> : null}
      {item.years_experience !== null ? <Text style={styles.meta}>{item.years_experience} years experience</Text> : null}
      {item.languages ? <Text style={styles.meta}>Languages: {item.languages}</Text> : null}
      {item.biography ? <><Text style={styles.heading}>About</Text><Text style={styles.body}>{item.biography}</Text></> : null}
      {item.credentials.length ? <><Text style={styles.heading}>Credentials</Text>{item.credentials.map((credential) => <Text key={credential.id} style={styles.body}>• {credential.degree}{credential.institution ? ` — ${credential.institution}` : ""}</Text>)}</> : null}
      <Pressable style={styles.cta} onPress={() => router.push(`/(auth)/doctors/${item.id}/availability`)}>
        <Text style={styles.ctaText}>View available slots</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:colors.background},
 content:{padding:spacing.lg,paddingBottom:spacing.xl},
 center:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.xl,backgroundColor:colors.background},
 back:{color:colors.primary,fontWeight:"700",fontSize:16,marginBottom:spacing.xl},
 avatar:{width:88,height:88,borderRadius:44,backgroundColor:colors.primarySoft,alignItems:"center",justifyContent:"center",alignSelf:"center"},
 avatarText:{fontSize:34,fontWeight:"800",color:colors.primary},
 name:{fontSize:28,fontWeight:"800",color:colors.text,textAlign:"center",marginTop:spacing.md},
 specialty:{fontSize:17,fontWeight:"700",color:colors.primary,textAlign:"center",marginTop:4},
 meta:{fontSize:14,color:colors.textSecondary,textAlign:"center",marginTop:4},
 heading:{fontSize:20,fontWeight:"800",color:colors.text,marginTop:spacing.xl,marginBottom:spacing.sm},
 body:{fontSize:15,color:colors.textSecondary,lineHeight:23},
 cta:{marginTop:spacing.xl,backgroundColor:colors.primary,borderRadius:14,padding:spacing.md,alignItems:"center"},
 ctaText:{color:"#fff",fontSize:16,fontWeight:"800"},
 error:{color:colors.danger}
});
