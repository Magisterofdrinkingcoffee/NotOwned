import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";

export default function ComingSoonScreen() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const [notified, setNotified] = useState(false);

  // Later: save this sign-up to Supabase so we can count demand per addiction
  function handleNotify() {
    setNotified(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.title}>{title ?? "This program"} is coming soon</Text>
          <Text style={styles.text}>
            We're starting with smoking and building the other programs step by step.
            Want us to tell you when it's ready?
          </Text>

          <Pressable
            onPress={handleNotify}
            disabled={notified}
            style={({ pressed }) => [
              styles.button,
              notified && styles.buttonDone,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.buttonText, notified && styles.buttonTextDone]}>
              {notified ? "Thanks, we'll let you know" : "Notify me"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 24 },
  back: { color: COLORS.accent, fontSize: 17 },
  center: { flex: 1, justifyContent: "center" },
  title: { color: COLORS.text, fontSize: 28, fontWeight: "700", marginBottom: 12 },
  text: { color: COLORS.textMuted, fontSize: 16, lineHeight: 24, marginBottom: 32 },
  button: {
    backgroundColor: COLORS.text,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDone: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder },
  buttonText: { color: COLORS.background, fontSize: 17, fontWeight: "700" },
  buttonTextDone: { color: COLORS.accent },
});
