import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../constants/theme";
import { OnboardingProvider } from "../state/onboarding";

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      />
    </OnboardingProvider>
  );
}
