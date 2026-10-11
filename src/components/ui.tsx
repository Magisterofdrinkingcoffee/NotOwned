import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

// Small shared building blocks so every screen looks the same.

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primary,
        disabled && styles.primaryDisabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.primaryText, disabled && styles.primaryTextDisabled]}>{label}</Text>
    </Pressable>
  );
}

export function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12}>
      <Text style={styles.back}>‹ Back</Text>
    </Pressable>
  );
}

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${(step / total) * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.text,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryDisabled: { backgroundColor: COLORS.card },
  primaryText: { color: COLORS.background, fontSize: 17, fontWeight: "700" },
  primaryTextDisabled: { color: COLORS.textMuted },
  chip: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chipSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.badgeBg },
  chipText: { color: COLORS.text, fontSize: 16 },
  chipTextSelected: { color: COLORS.text, fontWeight: "600" },
  back: { color: COLORS.accent, fontSize: 17 },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.card,
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: { height: 4, backgroundColor: COLORS.accent },
});
