import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { normalizeApiError } from "@/lib/api/apiError";
import { secureTokenStorage } from "@/lib/auth/secureStorage";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing, typography } from "@/theme";

export default function LoginScreen() {
  const [serverError, setServerError] = useState("");
  const setSession = useAuthStore((state) => state.setSession);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (input: LoginInput) => {
    setServerError("");

    try {
      const result = await login(input);
      await secureTokenStorage.setAccessToken(result.access_token);
      setSession(result.user);
      router.replace("/(auth)/home");
    } catch (error) {
      setServerError(normalizeApiError(error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>
        Sign in to manage your appointments, healthcare records, and consultations.
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Field
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Field
            label="Password"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />
        )}
      />


      {serverError ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{serverError}</Text>
          <Text style={styles.retryHint}>Check your details and try signing in again.</Text>
        </View>
      ) : null}

      <Pressable
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </Pressable>

      <Link href="/(public)/register" asChild>
        <Pressable style={styles.registerLink}>
          <Text style={styles.registerText}>Create a patient account</Text>
        </Pressable>
      </Link>

      <Link href="/(public)" asChild>
        <Pressable style={styles.backLink}>
          <Text style={styles.backText}>Back to welcome</Text>
        </Pressable>
      </Link>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences";
  keyboardType?: "email-address" | "default";
  autoComplete?: "email" | "password";
};

function Field(props: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        style={styles.input}
        placeholder={props.label}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.autoCapitalize}
        keyboardType={props.keyboardType}
        autoComplete={props.autoComplete}
        editable
      />
      {props.error ? <Text style={styles.error}>{props.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  retryHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  registerLink: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  registerText: {
    color: colors.primary,
    fontWeight: "700",
  },
  backLink: {
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  backText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
});
