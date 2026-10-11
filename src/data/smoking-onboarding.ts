// Questions for the smoking onboarding.
// The choices come from relapse research: coffee, alcohol, stress,
// other smokers around and "just one" are the most common triggers.

export type Option = { id: string; label: string };

export const FIRST_CIGARETTE_OPTIONS: Option[] = [
  { id: "5min", label: "Within 5 minutes" },
  { id: "30min", label: "6–30 minutes" },
  { id: "60min", label: "31–60 minutes" },
  { id: "later", label: "After 60 minutes" },
];

export const TRIGGER_OPTIONS: Option[] = [
  { id: "coffee", label: "With coffee" },
  { id: "meals", label: "After meals" },
  { id: "breaks", label: "On breaks (uni / work)" },
  { id: "friends", label: "With friends" },
  { id: "alcohol", label: "When drinking" },
  { id: "stress", label: "When stressed" },
  { id: "boredom", label: "When bored" },
  { id: "commute", label: "Walking / driving" },
  { id: "sleep", label: "Before sleep" },
];

export const NO_ONE = "no_one";
export const SMOKERS_AROUND_OPTIONS: Option[] = [
  { id: "friends", label: "Friends" },
  { id: "family", label: "Family" },
  { id: "roommate", label: "Roommate" },
  { id: "partner", label: "Partner" },
  { id: "colleagues", label: "Classmates / colleagues" },
  { id: NO_ONE, label: "No one" },
];

export const TRIED_BEFORE_OPTIONS: Option[] = [
  { id: "never", label: "Never" },
  { id: "once", label: "Once" },
  { id: "few", label: "2–3 times" },
  { id: "many", label: "Many times" },
];

export const RESTART_REASON_OPTIONS: Option[] = [
  { id: "cravings", label: "Cravings were too strong" },
  { id: "stress", label: "A stressful moment" },
  { id: "friends", label: "Friends were smoking" },
  { id: "alcohol", label: "While drinking" },
  { id: "just_one", label: '"Just one" turned into more' },
  { id: "boredom", label: "Boredom" },
  { id: "weight", label: "Worried about weight" },
];

export const QUIT_REASON_OPTIONS: Option[] = [
  { id: "health", label: "My health" },
  { id: "money", label: "Save money" },
  { id: "family", label: "Family / people I love" },
  { id: "fitness", label: "Sport and fitness" },
  { id: "smell", label: "Smell and looks" },
  { id: "freedom", label: "Be free, not controlled" },
];

export function labelFor(options: Option[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}
