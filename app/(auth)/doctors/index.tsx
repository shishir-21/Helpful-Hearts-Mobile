import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { DoctorCard } from "@/components/DoctorCard";
import { searchDoctors } from "@/features/doctors/api";
import { colors, spacing } from "@/theme";

export default function DoctorsScreen() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const doctors = useQuery({
    queryKey: ["doctors", submitted],
    queryFn: () => searchDoctors({ q: submitted || undefined, page: 1, page_size: 20 }),
  });

  const submitSearch = () => setSubmitted(query.trim());
  const retrySearch = () => void doctors.refetch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a doctor</Text>
      <Text style={styles.subtitle}>Search verified doctors by name or specialty.</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. cardiologist"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={submitSearch}
        />
        <Pressable style={styles.button} onPress={submitSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>

      {doctors.isLoading ? <ActivityIndicator style={styles.loader} /> : null}

      {doctors.isError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>We could not load doctors.</Text>
          <Text style={styles.errorText}>Please check your connection and try again.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry doctor search"
            style={styles.retryButton}
            onPress={retrySearch}
            disabled={doctors.isRefetching}
          >
            {doctors.isRefetching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.retryText}>Try again</Text>
            )}
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={doctors.data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={doctors.isRefetching}
            onRefresh={() => void doctors.refetch()}
          />
        }
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={() => router.push(`/(auth)/doctors/${item.id}`)} />
        )}
        ListEmptyComponent={
          !doctors.isLoading && !doctors.isError ? (
            <Text style={styles.empty}>No verified doctors found.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 6, marginBottom: spacing.md },
  searchRow: { flexDirection: "row", gap: spacing.sm },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  button: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800" },
  loader: { marginTop: spacing.lg },
  errorCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  errorTitle: { color: colors.danger, fontWeight: "800" },
  errorText: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    minWidth: 92,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { color: "#fff", fontWeight: "800" },
  empty: { color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  list: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
});
