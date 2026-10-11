import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";

type Addiction = {
  id: string;
  title: string;
  subtitle: string;
  available: boolean;
};

// All 5 addictions are shown, but only smoking works in version 0
const ADDICTIONS: Addiction[] = [
  { id: "smoking", title: "Smoking", subtitle: "Cigarettes", available: true },
  { id: "vaping", title: "Vaping", subtitle: "E-cigarettes, pods", available: false },
  { id: "alcohol", title: "Alcohol", subtitle: "Drinking", available: false },
  { id: "gambling", title: "Gambling", subtitle: "Betting, casinos", available: false },
  { id: "porn", title: "Porn & masturbation", subtitle: "Compulsive use", available: false },
];

export default function ChooseAddictionScreen() {
  function handlePress(item: Addiction) {
    if (item.available) {
      router.push("/smoking");
    } else {
      router.push({ pathname: "/coming-soon", params: { title: item.title } });
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>
          <Text style={styles.logoBold}>not</Text>owned
        </Text>

        <Text style={styles.title}>What do you want to quit?</Text>
        <Text style={styles.subtitle}>Pick one to start. You can add more later.</Text>

        {ADDICTIONS.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              styles.card,
              !item.available && styles.cardLocked,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            {item.available ? (
              <Text style={styles.arrow}>›</Text>
            ) : (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Soon</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 24, paddingBottom: 48 },
  logo: { color: COLORS.accent, fontSize: 22, marginBottom: 32 },
  logoBold: { color: COLORS.text, fontWeight: "700" },
  title: { color: COLORS.text, fontSize: 30, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: COLORS.textMuted, fontSize: 16, marginBottom: 28 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  cardLocked: { opacity: 0.55 },
  cardPressed: { opacity: 0.8 },
  cardText: { flex: 1 },
  cardTitle: { color: COLORS.text, fontSize: 18, fontWeight: "600" },
  cardSubtitle: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  arrow: { color: COLORS.accent, fontSize: 28, marginLeft: 12 },
  badge: {
    backgroundColor: COLORS.badgeBg,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  badgeText: { color: COLORS.accent, fontSize: 13, fontWeight: "600" },
});
