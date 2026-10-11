import { router } from "expo-router";
import { ReactNode, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, OptionChip, PrimaryButton, ProgressBar } from "../components/ui";
import { COLORS } from "../constants/theme";
import {
  FIRST_CIGARETTE_OPTIONS,
  NO_ONE,
  Option,
  QUIT_REASON_OPTIONS,
  RESTART_REASON_OPTIONS,
  SMOKERS_AROUND_OPTIONS,
  TRIED_BEFORE_OPTIONS,
  TRIGGER_OPTIONS,
} from "../data/smoking-onboarding";
import { useOnboarding } from "../state/onboarding";

type StepId =
  | "perDay"
  | "price"
  | "firstCig"
  | "triggers"
  | "around"
  | "tried"
  | "restart"
  | "reasons";

function toNumber(text: string): number {
  const n = parseFloat(text.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export default function SmokingOnboardingScreen() {
  const { saveAnswers } = useOnboarding();

  const [stepIndex, setStepIndex] = useState(0);
  const [perDay, setPerDay] = useState("");
  const [packPrice, setPackPrice] = useState("");
  const [perPack, setPerPack] = useState(20);
  const [firstCig, setFirstCig] = useState("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [around, setAround] = useState<string[]>([]);
  const [tried, setTried] = useState("");
  const [restart, setRestart] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [ownReason, setOwnReason] = useState("");

  // "What made you start again?" only makes sense if they tried before
  const steps: StepId[] = [
    "perDay",
    "price",
    "firstCig",
    "triggers",
    "around",
    "tried",
    ...(tried && tried !== "never" ? (["restart"] as StepId[]) : []),
    "reasons",
  ];
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const canContinue: Record<StepId, boolean> = {
    perDay: toNumber(perDay) > 0,
    price: toNumber(packPrice) > 0,
    firstCig: firstCig !== "",
    triggers: triggers.length > 0,
    around: around.length > 0,
    tried: tried !== "",
    restart: true, // optional
    reasons: reasons.length > 0 || ownReason.trim().length > 0,
  };

  function goBack() {
    if (stepIndex === 0) router.back();
    else setStepIndex(stepIndex - 1);
  }

  function goNext() {
    if (!isLast) {
      setStepIndex(stepIndex + 1);
      return;
    }
    saveAnswers({
      cigsPerDay: toNumber(perDay),
      packPrice: toNumber(packPrice),
      cigsPerPack: perPack,
      firstCigarette: firstCig,
      triggers,
      smokersAround: around,
      triedBefore: tried,
      restartReasons: tried === "never" ? [] : restart,
      quitReasons: reasons,
      ownReason: ownReason.trim(),
    });
    router.replace("/profile");
  }

  function toggleAround(id: string) {
    // "No one" can't be combined with the others
    if (id === NO_ONE) setAround(around.includes(NO_ONE) ? [] : [NO_ONE]);
    else setAround(toggle(around.filter((x) => x !== NO_ONE), id));
  }

  function singleChoice(options: Option[], value: string, onChange: (id: string) => void) {
    return options.map((o) => (
      <OptionChip key={o.id} label={o.label} selected={value === o.id} onPress={() => onChange(o.id)} />
    ));
  }

  function multiChoice(options: Option[], values: string[], onToggle: (id: string) => void) {
    return options.map((o) => (
      <OptionChip key={o.id} label={o.label} selected={values.includes(o.id)} onPress={() => onToggle(o.id)} />
    ));
  }

  let title = "";
  let hint = "";
  let body: ReactNode = null;

  switch (step) {
    case "perDay":
      title = "How many cigarettes do you smoke a day?";
      hint = "A rough number is fine.";
      body = (
        <TextInput
          value={perDay}
          onChangeText={setPerDay}
          keyboardType="number-pad"
          placeholder="e.g. 10"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          autoFocus
        />
      );
      break;
    case "price":
      title = "How much does a pack cost?";
      hint = "We use this to show how much money you save.";
      body = (
        <>
          <View style={styles.inputRow}>
            <Text style={styles.inputPrefix}>RM</Text>
            <TextInput
              value={packPrice}
              onChangeText={setPackPrice}
              keyboardType="decimal-pad"
              placeholder="e.g. 17"
              placeholderTextColor={COLORS.textMuted}
              style={[styles.input, styles.inputFlex]}
              autoFocus
            />
          </View>
          <Text style={styles.label}>Cigarettes in a pack</Text>
          <View style={styles.row}>
            {[10, 20].map((n) => (
              <View key={n} style={styles.rowItem}>
                <OptionChip label={`${n}`} selected={perPack === n} onPress={() => setPerPack(n)} />
              </View>
            ))}
          </View>
        </>
      );
      break;
    case "firstCig":
      title = "How soon after waking up do you have your first cigarette?";
      body = singleChoice(FIRST_CIGARETTE_OPTIONS, firstCig, setFirstCig);
      break;
    case "triggers":
      title = "When do you usually smoke?";
      hint = "Pick all that apply.";
      body = multiChoice(TRIGGER_OPTIONS, triggers, (id) => setTriggers(toggle(triggers, id)));
      break;
    case "around":
      title = "Who around you smokes?";
      hint = "Pick all that apply.";
      body = multiChoice(SMOKERS_AROUND_OPTIONS, around, toggleAround);
      break;
    case "tried":
      title = "Have you tried to quit before?";
      body = singleChoice(TRIED_BEFORE_OPTIONS, tried, setTried);
      break;
    case "restart":
      title = "What made you start again?";
      hint = "Pick all that apply, or skip.";
      body = multiChoice(RESTART_REASON_OPTIONS, restart, (id) => setRestart(toggle(restart, id)));
      break;
    case "reasons":
      title = "Why do you want to quit now?";
      hint = "We'll remind you of this on hard days.";
      body = (
        <>
          {multiChoice(QUIT_REASON_OPTIONS, reasons, (id) => setReasons(toggle(reasons, id)))}
          <TextInput
            value={ownReason}
            onChangeText={setOwnReason}
            placeholder="In your own words (optional)"
            placeholderTextColor={COLORS.textMuted}
            style={[styles.input, styles.inputMultiline]}
            multiline
          />
        </>
      );
      break;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <BackButton onPress={goBack} />
          <ProgressBar step={stepIndex + 1} total={steps.length} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{title}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
          <View style={styles.body}>{body}</View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={isLast ? "See my profile" : step === "restart" && restart.length === 0 ? "Skip" : "Continue"}
            onPress={goNext}
            disabled={!canContinue[step]}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 8 },
  content: { padding: 24, paddingBottom: 32 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "700", lineHeight: 32 },
  hint: { color: COLORS.textMuted, fontSize: 15, marginTop: 8 },
  body: { marginTop: 24 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8 },
  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    color: COLORS.text,
    fontSize: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputFlex: { flex: 1 },
  inputMultiline: { fontSize: 16, minHeight: 90, textAlignVertical: "top", marginTop: 6 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  inputPrefix: { color: COLORS.textMuted, fontSize: 20, fontWeight: "600" },
  label: { color: COLORS.textMuted, fontSize: 15, marginTop: 24, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10 },
  rowItem: { flex: 1 },
});
