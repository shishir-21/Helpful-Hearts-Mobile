import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  override componentDidCatch(error: Error) {
    if (__DEV__) console.error("Helpful-Hearts application error:", error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            Please restart the app. This screen does not change your account or health data.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:spacing.xl,backgroundColor:colors.background},
  title:{color:colors.text,fontSize:24,fontWeight:"800",marginBottom:spacing.sm},
  message:{color:colors.textSecondary,fontSize:16,lineHeight:24}
});