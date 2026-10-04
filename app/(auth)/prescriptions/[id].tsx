import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import {
  explainPrescription,
  getPrescription,
  reviewPrescriptionOcr,
} from "@/features/prescriptions/api";

export default function PrescriptionDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const queryClient = useQueryClient();
  const [ocrText, setOcrText] = useState("");

  const prescriptionQuery = useQuery({
    queryKey: ["prescriptions", id],
    queryFn: () => getPrescription(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (prescriptionQuery.data) {
      setOcrText(prescriptionQuery.data.ocr_text ?? "");
    }
  }, [prescriptionQuery.data]);

  const reviewMutation = useMutation({
    mutationFn: () => reviewPrescriptionOcr(id, { ocr_text: ocrText }),
    onSuccess: async (prescription) => {
      await queryClient.setQueryData(["prescriptions", id], prescription);
      await queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  const explanationMutation = useMutation({
    mutationFn: () => explainPrescription(id),
    onSuccess: async (prescription) => {
      await queryClient.setQueryData(["prescriptions", id], prescription);
      await queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  if (prescriptionQuery.isLoading) {
    return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Loading prescription…</Text></View>;
  }

  if (prescriptionQuery.isError || !prescriptionQuery.data) {
    const message = prescriptionQuery.error
      ? normalizeApiError(prescriptionQuery.error).message
      : "Prescription not found.";
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>{message}</Text>
        <Pressable style={styles.primaryButton} onPress={() => prescriptionQuery.refetch()}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const prescription = prescriptionQuery.data;
  const error = reviewMutation.error ?? explanationMutation.error;
  const isReviewRequired = prescription.ocr_status === "review_required";
  const isReviewed = prescription.ocr_status === "reviewed";
  const isExplained = prescription.ocr_status === "explained";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Back to prescriptions</Text>
      </Pressable>

      <Text style={styles.eyebrow}>PRESCRIPTION REVIEW</Text>
      <Text style={styles.title}>{prescription.filename}</Text>
      <Text style={styles.meta}>{prescription.content_type}</Text>

      <View style={styles.safety}>
        <Text style={styles.safetyTitle}>Review before explanation</Text>
        <Text style={styles.safetyText}>
          Check the OCR text carefully. The AI explanation is educational only and does not diagnose, prescribe, or change medicines.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>OCR text</Text>
      <TextInput
        value={ocrText}
        onChangeText={setOcrText}
        multiline
        editable={isReviewRequired || isReviewed}
        placeholder="OCR text will appear here when available."
        placeholderTextColor={colors.textMuted}
        style={styles.ocrInput}
        maxLength={30000}
      />

      {isReviewRequired || isReviewed ? (
        <Pressable
          disabled={!ocrText.trim() || reviewMutation.isPending}
          onPress={() => reviewMutation.mutate()}
          style={[styles.primaryButton, (!ocrText.trim() || reviewMutation.isPending) && styles.disabled]}
        >
          {reviewMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save OCR review</Text>}
        </Pressable>
      ) : null}

      {isReviewed ? (
        <Pressable
          disabled={explanationMutation.isPending}
          onPress={() => explanationMutation.mutate()}
          style={[styles.secondaryButton, explanationMutation.isPending && styles.disabled]}
        >
          {explanationMutation.isPending ? <ActivityIndicator /> : <Text style={styles.secondaryButtonText}>Explain prescription</Text>}
        </Pressable>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{normalizeApiError(error).message}</Text>
        </View>
      ) : null}

      {isExplained ? (
        <View style={styles.explanation}>
          <Text style={styles.sectionTitle}>AI explanation</Text>
          <Text style={styles.explanationText}>{prescription.explanation}</Text>
          <Text style={styles.disclaimer}>
            Educational information only. Follow your licensed clinician's instructions and ask them before changing any medicine.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{padding:spacing.lg,paddingBottom:spacing.xxl,backgroundColor:colors.background},
  back:{color:colors.primary,fontWeight:"800",marginBottom:spacing.lg},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:spacing.xs},
  meta:{color:colors.textMuted,fontSize:12,marginTop:4},
  safety:{marginTop:spacing.lg,padding:spacing.md,borderRadius:16,backgroundColor:colors.primarySoft,borderWidth:1,borderColor:"#F4CACA"},
  safetyTitle:{color:colors.primary,fontWeight:"800"},
  safetyText:{color:colors.textSecondary,fontSize:12,lineHeight:18,marginTop:4},
  sectionTitle:{color:colors.text,fontSize:18,fontWeight:"800",marginTop:spacing.lg,marginBottom:spacing.sm},
  ocrInput:{minHeight:220,borderWidth:1,borderColor:colors.border,borderRadius:14,padding:spacing.md,color:colors.text,backgroundColor:colors.surface,textAlignVertical:"top",lineHeight:21},
  primaryButton:{minHeight:48,borderRadius:14,backgroundColor:colors.primary,alignItems:"center",justifyContent:"center",paddingHorizontal:spacing.lg,marginTop:spacing.md},
  primaryButtonText:{color:"#fff",fontWeight:"800"},
  secondaryButton:{minHeight:48,borderRadius:14,borderWidth:1,borderColor:colors.primary,alignItems:"center",justifyContent:"center",paddingHorizontal:spacing.lg,marginTop:spacing.sm},
  secondaryButtonText:{color:colors.primary,fontWeight:"800"},
  disabled:{opacity:0.5},
  errorBox:{marginTop:spacing.md,padding:spacing.md,borderRadius:12,backgroundColor:"#FFF1F0"},
  errorText:{color:colors.danger,fontSize:13},
  explanation:{marginTop:spacing.md,padding:spacing.md,borderRadius:16,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border},
  explanationText:{color:colors.text,fontSize:15,lineHeight:23},
  disclaimer:{color:colors.textSecondary,fontSize:12,lineHeight:18,marginTop:spacing.md},
  center:{flex:1,justifyContent:"center",alignItems:"center",padding:spacing.xl,backgroundColor:colors.background},
  errorTitle:{color:colors.danger,fontWeight:"800",textAlign:"center"},
  muted:{color:colors.textSecondary,marginTop:spacing.sm},
});
