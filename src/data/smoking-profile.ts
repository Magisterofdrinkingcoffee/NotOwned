import type { SmokingAnswers } from "../state/onboarding";
import {
  labelFor,
  NO_ONE,
  RESTART_REASON_OPTIONS,
  SMOKERS_AROUND_OPTIONS,
  TRIGGER_OPTIONS,
} from "./smoking-onboarding";

const DAYS_PER_MONTH = 30.4;

export function monthlySpend(a: SmokingAnswers): number {
  if (a.cigsPerPack <= 0) return 0;
  return (a.cigsPerDay / a.cigsPerPack) * a.packPrice * DAYS_PER_MONTH;
}

export function yearlySpend(a: SmokingAnswers): number {
  return monthlySpend(a) * 12;
}

// Heaviness of Smoking Index (HSI): a standard 2-question measure of
// nicotine dependence, scored 0-6 from cigarettes per day and
// time to the first cigarette after waking.
export type Dependence = { score: number; level: "Low" | "Moderate" | "High" };

export function dependence(a: SmokingAnswers): Dependence {
  let cpdScore = 0;
  if (a.cigsPerDay >= 31) cpdScore = 3;
  else if (a.cigsPerDay >= 21) cpdScore = 2;
  else if (a.cigsPerDay >= 11) cpdScore = 1;

  const firstCigScore: Record<string, number> = { "5min": 3, "30min": 2, "60min": 1, later: 0 };
  const score = cpdScore + (firstCigScore[a.firstCigarette] ?? 0);

  const level = score <= 1 ? "Low" : score <= 4 ? "Moderate" : "High";
  return { score, level };
}

// Risk moments to show the user, in plain words.
export function riskMoments(a: SmokingAnswers): string[] {
  const moments = a.triggers.map((id) => labelFor(TRIGGER_OPTIONS, id));

  const around = a.smokersAround.filter((id) => id !== NO_ONE);
  if (around.length > 0) {
    const who = around.map((id) => labelFor(SMOKERS_AROUND_OPTIONS, id).toLowerCase());
    moments.push(`Being around smokers (${who.join(", ")})`);
  }
  return moments;
}

export function pastRelapseReasons(a: SmokingAnswers): string[] {
  return a.restartReasons.map((id) => labelFor(RESTART_REASON_OPTIONS, id));
}

export function formatRM(value: number): string {
  return `RM ${Math.round(value).toLocaleString("en-US")}`;
}
