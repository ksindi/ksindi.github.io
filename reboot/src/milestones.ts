import { Category } from "./types";
import { TECH_TREE } from "./data";
import { GameState } from "./state";

export interface Milestone {
  id: string;
  label: string;
  title: string;
  check: (state: GameState) => boolean;
}

function allCategoryUnlocked(state: GameState, cat: Category): boolean {
  return TECH_TREE.filter(n => n.category === cat).every(n => state.isUnlocked(n.id));
}

function eraWrongCount(state: GameState, era: number): number {
  let wrong = 0;
  for (const node of TECH_TREE) {
    if (node.era !== era) continue;
    if (!state.isUnlocked(node.id)) continue;
    const result = state.techResults[node.id];
    if (result !== undefined && result < 2) wrong += (2 - result);
  }
  return wrong;
}

function eraFullyUnlocked(state: GameState, era: number): boolean {
  return TECH_TREE.filter(n => n.era === era).every(n => state.isUnlocked(n.id));
}

export const MILESTONES: Milestone[] = [
  {
    id: "first_research",
    label: "FIRST LIGHT",
    title: "Research your first technology.",
    check: (s) => s.unlockedCount >= 1,
  },
  {
    id: "era_1",
    label: "NEW HORIZONS",
    title: "Reach the Stability era.",
    check: (s) => s.isEraUnlocked(1),
  },
  {
    id: "era_3",
    label: "INDUSTRIAL DAWN",
    title: "Reach the Industry era.",
    check: (s) => s.isEraUnlocked(3),
  },
  {
    id: "ten_techs",
    label: "SCHOLAR",
    title: "Research 10 technologies.",
    check: (s) => s.unlockedCount >= 10,
  },
  {
    id: "twenty_techs",
    label: "POLYMATH",
    title: "Research 20 technologies.",
    check: (s) => s.unlockedCount >= 20,
  },
  {
    id: "pop_80",
    label: "BOOMTOWN",
    title: "Reach 80+ population.",
    check: (s) => s.population >= 80,
  },
  {
    id: "pop_100",
    label: "METROPOLIS",
    title: "Reach 100+ population.",
    check: (s) => s.population >= 100,
  },
  {
    id: "streak_5",
    label: "ON FIRE",
    title: "Reach a 5-answer streak.",
    check: (s) => s.bestStreak >= 5,
  },
  {
    id: "streak_7",
    label: "UNSTOPPABLE",
    title: "Reach a 7-answer streak.",
    check: (s) => s.bestStreak >= 7,
  },
  {
    id: "survived_crisis",
    label: "AGAINST ALL ODDS",
    title: "Recover from CRISIS to STABLE or better.",
    check: (s) => s.recoveredFromCrisis(),
  },
  {
    id: "master_farmer",
    label: "MASTER FARMER",
    title: "Unlock all food technologies.",
    check: (s) => allCategoryUnlocked(s, "food"),
  },
  {
    id: "era_ace",
    label: "ERA ACE",
    title: "Complete an entire era with no wrong answers.",
    check: (s) => {
      for (let era = 0; era <= 5; era++) {
        if (eraFullyUnlocked(s, era) && eraWrongCount(s, era) === 0) return true;
      }
      return false;
    },
  },
];

export function checkMilestones(state: GameState): Milestone[] {
  const newlyEarned: Milestone[] = [];
  for (const m of MILESTONES) {
    if (state.achievements.includes(m.id)) continue;
    if (m.check(state)) {
      state.addAchievement(m.id);
      newlyEarned.push(m);
    }
  }
  return newlyEarned;
}
