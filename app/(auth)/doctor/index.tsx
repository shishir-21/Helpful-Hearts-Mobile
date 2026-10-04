import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  decideDoctorAppointment,
  getDoctorAppointments,
} from "@/features/doctor/api";
import { colors, spacing } from "@/theme";

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DoctorHomeScreen() {
  const client = useQueryClient();

  const pendingQuery = useQuery({
    queryKey: ["doctor-appointments", "requests"],
    queryFn: () => getDoctorAppointments({ status: "requested" }),
  });

  const upcomingQuery = useQuery({
    queryKey: ["doctor-appointments", "upcoming"],
    queryFn: () => getDoctorAppointments({ upcomingOnly: true }),
  });

  const decisionMutation = useMutation({
    mutationFn: ({
      appointmentId,
      decision,
    }: {
      appointmentId: string;
      decision: "confirmed" | "rejected";
    }) => decideDoctorAppointment(appointmentId, decision),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["doctor-appointments", "requests"] }),
        client.invalidateQueries({ queryKey: ["doctor-appointments", "upcoming"] }),
        client.invalidateQueries({ queryKey: ["doctor-appointments"] }),
      ]);
    },
  });

  const decide = (appointmentId: string, decision: "confirmed" | "rejected") => {
    const label = decision === "confirmed" ? "Accept appointment" : "Reject appointment";
    const action = decision === "confirmed" ? "accept" : "reject";

    Alert.alert(label, `Are you sure you want to ${action} this appointment request?`, [
      { text: "Keep", style: "cancel" },
      {
        text: "Confirm",
        style: decision === "rejected" ? "destructive" : "default",
        onPress: () => decisionMutation.mutate({ appointmentId, decision }),
      },
    ]);
  };

  const renderAppointment = (appointment: {
    id: string;
    starts_at: string;
    status: string;
    patient_name: string;
    reason: string | null;
    booking_reference: string;
  }) => (
    <Pressable
      key={appointment.id}
      style={styles.card}
      onPress={() => router.push(`/(auth)/doctor/appointments/${appointment.id}`)}
    >
      <View style={styles.row}>
        <Text style={styles.date}>{formatDate(appointment.starts_at)}</Text>
        <Text style={styles.status}>{appointment.status.replace("_", " ")}</Text>
      </View>
      <Text style={styles.patient}>{appointment.patient_name}</Text>
      <Text style={styles.reason} numberOfLines={2}>
        {appointment.reason ?? "No reason provided"}
      </Text>
      <Text style={styles.reference}>Booking {appointment.booking_reference}</Text>
      {appointment.status === "requested" ? (
        <View style={styles.decisionRow}>
          <Pressable
            style={styles.acceptButton}
            disabled={decisionMutation.isPending}
            onPress={(event) => {
              event.stopPropagation();
              decide(appointment.id, "confirmed");
            }}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
          <Pressable
            style={styles.rejectButton}
            disabled={decisionMutation.isPending}
            onPress={(event) => {
              event.stopPropagation();
              decide(appointment.id, "rejected");
            }}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.action}>Open appointment →</Text>
      )}
    </Pressable>
  );

  const pending = pendingQuery.data ?? [];
  const upcoming = (upcomingQuery.data ?? []).filter(
    (appointment) => appointment.status !== "requested",
  );

  const isLoading = pendingQuery.isLoading || upcomingQuery.isLoading;
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const hasError = pendingQuery.isError || upcomingQuery.isError;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={pendingQuery.isRefetching || upcomingQuery.isRefetching}
          onRefresh={() => {
            void Promise.all([pendingQuery.refetch(), upcomingQuery.refetch()]);
          }}
        />
      }
    >
      <Text style={styles.eyebrow}>DOCTOR PORTAL</Text>
      <Text style={styles.title}>Today’s care</Text>
      <Text style={styles.subtitle}>
        Review new appointment requests and manage your upcoming consultations.
      </Text>

      {hasError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not load your appointments</Text>
          <Text style={styles.errorText}>Please check your connection and try again.</Text>
          <Pressable
            onPress={() => {
              void Promise.all([pendingQuery.refetch(), upcomingQuery.refetch()]);
            }}
          >
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!hasError ? (
        <>
          <Text style={styles.sectionTitle}>Pending appointment requests</Text>
          {pending.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No pending requests</Text>
              <Text style={styles.emptyText}>
                New appointment requests will appear here.
              </Text>
            </View>
          ) : (
            pending.map(renderAppointment)
          )}

          <Text style={styles.sectionTitle}>Upcoming appointments</Text>
          {upcoming.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No upcoming appointments</Text>
              <Text style={styles.emptyText}>
                Accepted appointments and consultations will appear here.
              </Text>
            </View>
          ) : (
            upcoming.map(renderAppointment)
          )}
        </>
      ) : null}

      {decisionMutation.isError ? (
        <Text style={styles.error}>
          Could not update the appointment request. Please try again.
        </Text>
      ) : null}
      {decisionMutation.isSuccess ? (
        <Text style={styles.success}>Appointment request updated.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  title: { color: colors.text, fontSize: 30, fontWeight: "800", marginTop: 4 },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  date: { color: colors.text, fontSize: 16, fontWeight: "800", flex: 1 },
  status: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  patient: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: spacing.sm },
  reason: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 4 },
  reference: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  action: { color: colors.primary, fontWeight: "800", marginTop: spacing.md },
  decisionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
  },
  acceptText: { color: "#fff", fontWeight: "800" },
  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
  },
  rejectText: { color: colors.danger, fontWeight: "800" },
  empty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  emptyText: { color: colors.textSecondary, fontSize: 14, marginTop: 6 },
  errorCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorTitle: { color: colors.danger, fontWeight: "800" },
  errorText: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  retry: { color: colors.primary, fontWeight: "800", marginTop: spacing.sm },
  error: { color: colors.danger, fontWeight: "800", marginTop: spacing.md },
  success: { color: colors.primary, fontWeight: "800", marginTop: spacing.md },
});
