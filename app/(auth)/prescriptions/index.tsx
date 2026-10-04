import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colors, spacing, typography } from "@/theme";
import { normalizeApiError } from "@/lib/api/apiError";
import { getPrescriptions, uploadPrescription } from "@/features/prescriptions/api";
import {
  PRESCRIPTION_TYPE_LABELS,
  type Prescription,
} from "@/features/prescriptions/types";

const prescriptionKeys = ["prescriptions"] as const;

function statusLabel(status: string) {
  if (status === "review_required") return "Review OCR";
  if (status === "reviewed") return "Ready for explanation";
  if (status === "explained") return "Explained";
  return status;
}

export default function PrescriptionsScreen() {
  const queryClient = useQueryClient();
  const [pickerError, setPickerError] = useState<string | null>(null);

  const prescriptionsQuery = useQuery({
    queryKey: prescriptionKeys,
    queryFn: getPrescriptions,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadPrescription,
    onSuccess: async (prescription) => {
      await queryClient.invalidateQueries({ queryKey: prescriptionKeys });
      router.push(`/(auth)/prescriptions/${prescription.id}`);
    },
  });

  async function pickPrescription() {
    setPickerError(null);
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/jpeg", "image/png", "application/pdf"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset) {
      setPickerError("No file was selected.");
      return;
    }

    const type = asset.mimeType ?? "application/octet-stream";
    if (!["image/jpeg", "image/png", "application/pdf"].includes(type)) {
      setPickerError(`Please select a ${PRESCRIPTION_TYPE_LABELS} file.`);
      return;
    }

    uploadMutation.mutate({
      uri: asset.uri,
      name: asset.name,
      type,
    });
  }

  const error = prescriptionsQuery.error ?? uploadMutation.error;
  const errorMessage = error ? normalizeApiError(error).message : pickerError;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>PRESCRIPTIONS</Text>
          <Text style={styles.title}>Your prescriptions</Text>
        </View>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Private health document</Text>
        <Text style={styles.noticeText}>
          Upload only prescriptions you need help reviewing. Your file is sent to the secure API and is not stored in local app state.
        </Text>
      </View>

      <Pressable
        onPress={() => void pickPrescription()}
        disabled={uploadMutation.isPending}
        style={styles.uploadButton}
      >
        {uploadMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.uploadTitle}>Upload prescription</Text>
            <Text style={styles.uploadText}>{PRESCRIPTION_TYPE_LABELS}</Text>
          </>
        )}
      </Pressable>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {prescriptionsQuery.isError ? (
            <Pressable onPress={() => prescriptionsQuery.refetch()}>
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {prescriptionsQuery.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading prescriptions…</Text>
        </View>
      ) : (
        <FlatList
          data={prescriptionsQuery.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No prescriptions yet</Text>
              <Text style={styles.muted}>
                Upload a prescription to review its OCR text and request an explanation.
              </Text>
            </View>
          }
          renderItem={({ item }: { item: Prescription }) => (
            <Pressable
              onPress={() => router.push(`/(auth)/prescriptions/${item.id}`)}
              style={styles.card}
            >
              <View style={styles.cardCopy}>
                <Text style={styles.fileName} numberOfLines={1}>{item.filename}</Text>
                <Text style={styles.meta}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.status}>{statusLabel(item.ocr_status)}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background,padding:spacing.lg},
  header:{flexDirection:"row",alignItems:"center",gap:spacing.md,marginBottom:spacing.md},
  back:{color:colors.primary,fontWeight:"800"},
  headerCopy:{flex:1},
  eyebrow:{color:colors.primary,fontSize:11,fontWeight:"800",letterSpacing:1},
  title:{color:colors.text,fontSize:typography.title,fontWeight:"800",marginTop:2},
  notice:{padding:spacing.md,borderRadius:16,backgroundColor:colors.primarySoft,borderWidth:1,borderColor:"#F4CACA"},
  noticeTitle:{color:colors.primary,fontWeight:"800"},
  noticeText:{color:colors.textSecondary,fontSize:12,lineHeight:18,marginTop:4},
  uploadButton:{marginTop:spacing.md,minHeight:76,padding:spacing.md,borderRadius:16,backgroundColor:colors.primary,justifyContent:"center",alignItems:"center"},
  uploadTitle:{color:"#fff",fontWeight:"800",fontSize:16},
  uploadText:{color:"#FFF7F7",fontSize:12,marginTop:4},
  errorBox:{marginTop:spacing.md,padding:spacing.md,borderRadius:12,backgroundColor:"#FFF1F0",flexDirection:"row",justifyContent:"space-between",gap:spacing.sm},
  errorText:{flex:1,color:colors.danger,fontSize:13},
  retry:{color:colors.primary,fontWeight:"800"},
  list:{paddingTop:spacing.md,gap:spacing.sm,paddingBottom:spacing.xl},
  card:{padding:spacing.md,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  cardCopy:{flex:1,marginRight:spacing.sm},
  fileName:{color:colors.text,fontWeight:"800"},
  meta:{color:colors.textMuted,fontSize:12,marginTop:4},
  status:{color:colors.primary,fontSize:12,fontWeight:"800"},
  center:{flex:1,alignItems:"center",justifyContent:"center"},
  muted:{color:colors.textSecondary,fontSize:13,lineHeight:19,marginTop:spacing.xs},
  empty:{padding:spacing.xl,alignItems:"center"},
  emptyTitle:{color:colors.text,fontSize:18,fontWeight:"800"},
});
