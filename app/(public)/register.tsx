import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { register as registerUser } from "@/features/auth/api";
import { secureTokenStorage } from "@/lib/auth/secureStorage";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing, typography } from "@/theme";

export default function RegisterScreen() {
  const [serverError, setServerError] = useState("");
  const setSession = useAuthStore((state) => state.setSession);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema), defaultValues: { full_name: "", email: "", password: "" },
  });
  const onSubmit = async (input: RegisterInput) => {
    setServerError("");
    try {
      const result = await registerUser(input);
      await secureTokenStorage.setAccessToken(result.access_token);
      setSession(result.user);
      router.replace("/(auth)/home");
    } catch {
      setServerError("We could not create your account. Please verify your details and try again.");
    }
  };
  return <View style={styles.container}>
    <Text style={styles.title}>Create your account</Text>
    <Text style={styles.subtitle}>Start with a patient account and manage your care in one place.</Text>
    <Controller control={control} name="full_name" render={({field})=><Field label="Full name" value={field.value} onChangeText={field.onChange} error={errors.full_name?.message}/>} />
    <Controller control={control} name="email" render={({field})=><Field label="Email" value={field.value} onChangeText={field.onChange} error={errors.email?.message} autoCapitalize="none" keyboardType="email-address"/>} />
    <Controller control={control} name="password" render={({field})=><Field label="Password" value={field.value} onChangeText={field.onChange} error={errors.password?.message} secureTextEntry/>} />
    {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
    <Pressable disabled={isSubmitting} onPress={handleSubmit(onSubmit)} style={styles.button}>{isSubmitting?<ActivityIndicator color="#FFFFFF"/>:<Text style={styles.buttonText}>Create account</Text>}</Pressable>
  </View>;
}
function Field(props:{label:string;value:string;onChangeText:(v:string)=>void;error?:string;secureTextEntry?:boolean;autoCapitalize?: "none"|"sentences";keyboardType?: "email-address"|"default"}) {
  return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput {...props} style={styles.input} placeholder={props.label}/>{props.error?<Text style={styles.error}>{props.error}</Text>:null}</View>;
}
const styles=StyleSheet.create({
  container:{flex:1,padding:spacing.xl,justifyContent:"center",backgroundColor:colors.background},
  title:{fontSize:typography.title,fontWeight:"800",color:colors.text,marginBottom:spacing.sm},
  subtitle:{fontSize:typography.body,lineHeight:24,color:colors.textSecondary,marginBottom:spacing.xl},
  field:{marginBottom:spacing.md},label:{fontSize:typography.small,fontWeight:"700",color:colors.text,marginBottom:spacing.xs},
  input:{borderWidth:1,borderColor:colors.border,borderRadius:12,paddingHorizontal:spacing.md,paddingVertical:14,backgroundColor:colors.surface,color:colors.text},
  error:{color:colors.danger,fontSize:12,marginTop:spacing.xs},button:{marginTop:spacing.sm,borderRadius:12,backgroundColor:colors.primary,paddingVertical:15,alignItems:"center"},buttonText:{color:"#FFFFFF",fontSize:16,fontWeight:"700"}
});