import { createContext, ReactNode, useContext, useState } from "react";

// Answers from the smoking onboarding.
// For now they live only in memory (lost when the app restarts).
// Next step: save them to Supabase so we keep testers' data for the trigger model.
export type SmokingAnswers = {
  cigsPerDay: number;
  packPrice: number; // RM
  cigsPerPack: number;
  firstCigarette: string;
  triggers: string[];
  smokersAround: string[];
  triedBefore: string;
  restartReasons: string[];
  quitReasons: string[];
  ownReason: string;
};

type OnboardingContextValue = {
  answers: SmokingAnswers | null;
  saveAnswers: (answers: SmokingAnswers) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<SmokingAnswers | null>(null);
  return (
    <OnboardingContext.Provider value={{ answers, saveAnswers: setAnswers }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const value = useContext(OnboardingContext);
  if (!value) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }
  return value;
}
