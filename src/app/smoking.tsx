import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";

// Placeholder: the smoking onboarding questions come here next
export default function SmokingStartScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.title}>Let's get you free from smoking</Text>
          <Text style={styles.text}>A few short questions are coming here next.</Text>
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
  text: { color: COLORS.textMuted, fontSize: 16, lineHeight: 24 },
});
