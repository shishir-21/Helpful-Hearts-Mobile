import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import type { Doctor } from "@/features/doctors/types";

type Props = { doctor: Doctor; onPress: () => void };

export function DoctorCard({ doctor, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{doctor.full_name.slice(0, 1).toUpperCase()}</Text></View>
      <View style={styles.content}>
        <Text style={styles.name}>{doctor.full_name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        {doctor.hospital_name ? <Text style={styles.meta}>{doctor.hospital_name}</Text> : null}
        {doctor.years_experience !== null ? <Text style={styles.meta}>{doctor.years_experience} years experience</Text> : null}
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:{flexDirection:"row",alignItems:"center",padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:18,backgroundColor:colors.surface,marginBottom:spacing.md},
  pressed:{opacity:0.75},
  avatar:{width:52,height:52,borderRadius:26,backgroundColor:colors.primarySoft,alignItems:"center",justifyContent:"center",marginRight:spacing.md},
  avatarText:{fontSize:20,fontWeight:"800",color:colors.primary},
  content:{flex:1},
  name:{fontSize:17,fontWeight:"800",color:colors.text},
  specialty:{fontSize:14,fontWeight:"600",color:colors.primary,marginTop:3},
  meta:{fontSize:13,color:colors.textSecondary,marginTop:3},
  arrow:{fontSize:28,color:colors.textMuted,marginLeft:spacing.sm},
});
