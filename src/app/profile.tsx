import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/ui";
import { COLORS } from "../constants/theme";
import { labelFor, QUIT_REASON_OPTIONS } from "../data/smoking-onboarding";
import {
  dependence,
  formatRM,
  monthlySpend,
  pastRelapseReasons,
  riskMoments,
  yearlySpend,
} from "../data/smoking-profile";
import { useOnboarding } from "../state/onboarding";

const DEPENDENCE_TEXT = {
  Low: "Your body depends on nicotine only a little. The habit and your triggers will be the main fight.",
  Moderate: "Your body is used to nicotine. Expect cravings in the first days — they peak and pass.",
  High: "Your body is strongly used to nicotine. The first week will be the hardest, so we'll support you more then. Talking to a pharmacist or doctor about nicotine replacement can also help.",
};

export default function ProfileScreen() {
  const { answers } = useOnboarding();

  // Answers are kept in memory only for now: after a reload, start again
  if (!answers) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.title}>No answers yet</Text>
          <PrimaryButton label="Start the questions" onPress={() => router.replace("/smoking")} />
        </View>
      </SafeAreaView>
    );
  }

  const dep = dependence(answers);
  const moments = riskMoments(answers);
  const relapses = pastRelapseReasons(answers);
  const reasons = answers.quitReasons.map((id) => labelFor(QUIT_REASON_OPTIONS, id));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Your profile</Text>
        <Text style={styles.title}>Here's what we learned</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Smoking costs you</Text>
          <Text style={styles.big}>{formatRM(monthlySpend(answers))} / month</Text>
          <Text style={styles.muted}>That's about {formatRM(yearlySpend(answers))} a year.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Nicotine dependence</Text>
          <Text style={styles.big}>{dep.level}</Text>
          <Text style={styles.muted}>{DEPENDENCE_TEXT[dep.level]}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your risk moments</Text>
          {moments.map((m) => (
            <Text key={m} style={styles.listItem}>• {m}</Text>
          ))}
          {relapses.length > 0 ? (
            <>
              <Text style={[styles.cardLabel, styles.spaced]}>What broke past attempts</Text>
              {relapses.map((r) => (
                <Text key={r} style={styles.listItem}>• {r}</Text>
              ))}
            </>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Why you're quitting</Text>
          {reasons.map((r) => (
            <Text key={r} style={styles.listItem}>• {r}</Text>
          ))}
          {answers.ownReason ? <Text style={styles.quote}>“{answers.ownReason}”</Text> : null}
        </View>

        <View style={styles.footer}>
          {/* Next step: quit day screen */}
          <PrimaryButton label="Set my quit day (coming next)" onPress={() => {}} disabled />
          <Text style={styles.footnote}>
            This is not medical advice. Dependence is estimated with a standard 2-question score.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingBottom: 48 },
  empty: { flex: 1, padding: 24, justifyContent: "center", gap: 24 },
  kicker: { color: COLORS.accent, fontSize: 15, fontWeight: "600", marginBottom: 6 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  cardLabel: { color: COLORS.textMuted, fontSize: 14, marginBottom: 8 },
  spaced: { marginTop: 16 },
  big: { color: COLORS.text, fontSize: 24, fontWeight: "700", marginBottom: 6 },
  muted: { color: COLORS.textMuted, fontSize: 15, lineHeight: 22 },
  listItem: { color: COLORS.text, fontSize: 16, lineHeight: 26 },
  quote: { color: COLORS.accent, fontSize: 16, fontStyle: "italic", marginTop: 10, lineHeight: 22 },
  footer: { marginTop: 12 },
  footnote: { color: COLORS.textMuted, fontSize: 12, marginTop: 12, textAlign: "center" },
});
