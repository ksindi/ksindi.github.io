import { describe, test, expect } from "bun:test";
import { TECH_TREE, CONNECTIONS } from "./data";
import { TechId, Category } from "./types";
import { GameState } from "./state";

// Mock localStorage for GameState constructor
const storage = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => { storage.set(k, v); },
  removeItem: (k: string) => { storage.delete(k); },
  clear: () => storage.clear(),
  get length() { return storage.size; },
  key: (_i: number) => null,
};

const CATEGORY_TO_RESOURCE: Record<Category, keyof typeof RESOURCE_MAX> = {
  food: "food", energy: "power", materials: "defense", chemical: "defense",
  medicine: "health", comm: "comms", science: "knowledge",
};
const RESOURCE_MAX = { food: 6, power: 7, defense: 9, health: 6, comms: 4, knowledge: 4 };
const ERA_STRENGTH_GATE: Record<number, number> = { 0: 0, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21 };

function freshState(): GameState {
  storage.clear();
  return new GameState();
}

function unlockWithResult(state: GameState, id: TechId, correct: 0 | 1 | 2) {
  state.recordTechResult(id, correct);
  state.unlock(id, correct);
}

function buildValidOrder(): TechId[] {
  const s = freshState();
  const order: TechId[] = [];
  let safety = 0;
  while (s.unlockedCount < TECH_TREE.length && safety++ < 100) {
    const avail = TECH_TREE.filter(n => s.isResearchable(n.id));
    if (avail.length === 0) break;
    const tech = avail[0];
    s.recordTechResult(tech.id, 2);
    s.unlock(tech.id, 2);
    order.push(tech.id);
  }
  return order;
}

// ═══════════════════════════════════════════
// DATA INTEGRITY
// ═══════════════════════════════════════════

describe("data integrity", () => {
  const ids = new Set(TECH_TREE.map(n => n.id));

  test("all TechIds in TECH_TREE are unique", () => {
    expect(ids.size).toBe(TECH_TREE.length);
  });

  test("every prereq references a valid TechId", () => {
    for (const node of TECH_TREE) {
      for (const p of node.prereqs) {
        expect(ids.has(p)).toBe(true);
      }
    }
  });

  test("every connection references valid from/to TechIds", () => {
    for (const c of CONNECTIONS) {
      expect(ids.has(c.from)).toBe(true);
      expect(ids.has(c.to)).toBe(true);
    }
  });

  test("every prereq relationship has a matching connection", () => {
    const connSet = new Set(CONNECTIONS.map(c => `${c.from}->${c.to}`));
    for (const node of TECH_TREE) {
      for (const p of node.prereqs) {
        expect(connSet.has(`${p}->${node.id}`)).toBe(true);
      }
    }
  });

  test("no solid connection without a prereq relationship", () => {
    const prereqSet = new Set<string>();
    for (const node of TECH_TREE) {
      for (const p of node.prereqs) prereqSet.add(`${p}->${node.id}`);
    }
    for (const c of CONNECTIONS) {
      if (!c.dashed) {
        expect(prereqSet.has(`${c.from}->${c.to}`)).toBe(true);
      }
    }
  });

  test("no circular dependencies", () => {
    function hasCycle(id: TechId, visited: Set<TechId>, stack: Set<TechId>): boolean {
      visited.add(id); stack.add(id);
      const node = TECH_TREE.find(n => n.id === id);
      if (!node) return false;
      for (const p of node.prereqs) {
        if (!visited.has(p)) { if (hasCycle(p, visited, stack)) return true; }
        else if (stack.has(p)) return true;
      }
      stack.delete(id);
      return false;
    }
    const visited = new Set<TechId>();
    for (const n of TECH_TREE) {
      if (!visited.has(n.id)) {
        expect(hasCycle(n.id, visited, new Set())).toBe(false);
      }
    }
  });

  test("prereqs are from same or earlier era", () => {
    for (const node of TECH_TREE) {
      for (const p of node.prereqs) {
        const pNode = TECH_TREE.find(n => n.id === p)!;
        expect(pNode.era).toBeLessThanOrEqual(node.era);
      }
    }
  });

  test("every tech has exactly 2 decisions with 4 choices and valid answer", () => {
    for (const node of TECH_TREE) {
      expect(node.decisions.length).toBe(2);
      for (const d of node.decisions) {
        expect(d.choices.length).toBe(4);
        expect(d.answer).toBeGreaterThanOrEqual(0);
        expect(d.answer).toBeLessThanOrEqual(3);
      }
    }
  });

  test("resource counts match or exceed RESOURCE_MAX", () => {
    const counts: Record<string, number> = {};
    for (const n of TECH_TREE) {
      const r = CATEGORY_TO_RESOURCE[n.category];
      counts[r] = (counts[r] || 0) + 1;
    }
    for (const [res, max] of Object.entries(RESOURCE_MAX)) {
      expect(counts[res] || 0).toBeGreaterThanOrEqual(max);
    }
  });
});

// ═══════════════════════════════════════════
// ERA GATING
// ═══════════════════════════════════════════

describe("era gating", () => {
  test("era 0 is always unlocked", () => {
    const s = freshState();
    expect(s.isEraUnlocked(0)).toBe(true);
  });

  test("era 1 requires 3 resource points", () => {
    const s = freshState();
    expect(s.isEraUnlocked(1)).toBe(false);
    unlockWithResult(s, "Food", 2);
    unlockWithResult(s, "Fuel", 2);
    expect(s.isEraUnlocked(1)).toBe(false);
    unlockWithResult(s, "Meds", 2);
    expect(s.isEraUnlocked(1)).toBe(true);
  });

  test("each era gate is reachable from prior eras", () => {
    for (let era = 1; era <= 5; era++) {
      const required = ERA_STRENGTH_GATE[era];
      const priorTechs = TECH_TREE.filter(n => n.era < era);
      let maxPoints = 0;
      const rCounts: Record<string, number> = {};
      for (const n of priorTechs) {
        const r = CATEGORY_TO_RESOURCE[n.category];
        rCounts[r] = (rCounts[r] || 0) + 1;
      }
      for (const [res, cnt] of Object.entries(rCounts)) {
        maxPoints += Math.min(cnt, RESOURCE_MAX[res as keyof typeof RESOURCE_MAX]);
      }
      expect(maxPoints).toBeGreaterThanOrEqual(required);
    }
  });
});

// ═══════════════════════════════════════════
// RESOURCE CALCULATION
// ═══════════════════════════════════════════

describe("resource calculation", () => {
  test("0-correct techs do not grant resources", () => {
    const s = freshState();
    unlockWithResult(s, "Food", 0);
    expect(s.resources.food).toBe(0);
    expect(s.getTotalResourcePoints()).toBe(0);
  });

  test("0-correct resource penalty is permanent across subsequent unlocks", () => {
    const s = freshState();
    unlockWithResult(s, "Food", 0);
    unlockWithResult(s, "Fuel", 2);
    expect(s.resources.food).toBe(0);
    expect(s.resources.power).toBe(1);
  });

  test("1-correct and 2-correct techs grant resources", () => {
    const s = freshState();
    unlockWithResult(s, "Food", 1);
    expect(s.resources.food).toBe(1);
    unlockWithResult(s, "Fuel", 2);
    expect(s.resources.power).toBe(1);
  });

  test("resources cap at RESOURCE_MAX", () => {
    const s = freshState();
    const order = buildValidOrder();
    for (const id of order) {
      unlockWithResult(s, id, 2);
    }
    expect(s.resources.food).toBeLessThanOrEqual(RESOURCE_MAX.food);
    expect(s.resources.power).toBeLessThanOrEqual(RESOURCE_MAX.power);
    expect(s.resources.defense).toBeLessThanOrEqual(RESOURCE_MAX.defense);
    expect(s.resources.health).toBeLessThanOrEqual(RESOURCE_MAX.health);
    expect(s.resources.comms).toBeLessThanOrEqual(RESOURCE_MAX.comms);
    expect(s.resources.knowledge).toBeLessThanOrEqual(RESOURCE_MAX.knowledge);
  });

  test("isResourceAtMax returns true at cap", () => {
    const s = freshState();
    expect(s.isResourceAtMax("comm")).toBe(false);
    const order = buildValidOrder();
    for (const id of order) {
      unlockWithResult(s, id, 2);
    }
    expect(s.isResourceAtMax("comm")).toBe(true);
  });
});

// ═══════════════════════════════════════════
// NODE STATE TRANSITIONS
// ═══════════════════════════════════════════

describe("node state transitions", () => {
  test("era 0 techs start as researchable", () => {
    const s = freshState();
    for (const n of TECH_TREE.filter(n => n.era === 0)) {
      expect(s.getNodeState(n.id)).toBe("researchable");
    }
  });

  test("era 1+ techs start as locked", () => {
    const s = freshState();
    for (const n of TECH_TREE.filter(n => n.era > 0)) {
      expect(s.getNodeState(n.id)).toBe("locked");
    }
  });

  test("unlocked tech reports as unlocked", () => {
    const s = freshState();
    unlockWithResult(s, "Food", 2);
    expect(s.getNodeState("Food")).toBe("unlocked");
  });

  test("tech becomes researchable when prereqs met and era unlocked", () => {
    const s = freshState();
    expect(s.getNodeState("Farming")).toBe("locked");
    unlockWithResult(s, "Food", 2);
    unlockWithResult(s, "Shelter", 2);
    unlockWithResult(s, "Fuel", 2);
    expect(s.isEraUnlocked(1)).toBe(true);
    expect(s.getNodeState("Farming")).toBe("researchable");
  });

  test("within-era prereqs work (Lime requires Charcoal)", () => {
    const order = buildValidOrder();
    const limeIdx = order.indexOf("Lime");
    const charcoalIdx = order.indexOf("Charcoal");
    expect(charcoalIdx).toBeLessThan(limeIdx);

    const s2 = freshState();
    for (let i = 0; i < order.length; i++) {
      const id = order[i];
      if (id === "Lime") break;
      if (id === "Charcoal") continue;
      unlockWithResult(s2, id, 2);
    }
    expect(s2.getNodeState("Lime")).toBe("locked");
    unlockWithResult(s2, "Charcoal", 2);
    if (s2.isEraUnlocked(2)) {
      expect(s2.getNodeState("Lime")).toBe("researchable");
    }
  });

  test("browse mode shows all techs as unlocked", () => {
    const s = freshState();
    s.browseMode = true;
    for (const n of TECH_TREE) {
      expect(s.getNodeState(n.id)).toBe("unlocked");
    }
  });
});

// ═══════════════════════════════════════════
// UNLOCK FLOW
// ═══════════════════════════════════════════

describe("unlock flow", () => {
  test("popGain uses pre-recalc resources (display consistency)", () => {
    const s = freshState();
    const foodBefore = s.resources.food;
    const expectedGain = 2 + foodBefore + (s.population >= 70 ? 1 : 0);
    const popBefore = s.population;
    unlockWithResult(s, "Food", 2);
    expect(s.population).toBe(Math.min(popBefore + expectedGain, s.getPopCap()));
  });

  test("population capped at popCap", () => {
    const s = freshState();
    const order = buildValidOrder();
    for (const id of order) unlockWithResult(s, id, 2);
    expect(s.population).toBeLessThanOrEqual(s.getPopCap());
  });

  test("0-correct unlock gives exactly 1 population (capped)", () => {
    const s = freshState();
    const popBefore = s.population;
    unlockWithResult(s, "Radio", 0);
    expect(s.population).toBe(Math.min(popBefore + 1, s.getPopCap()));
  });

  test("unlock sets startTime on first unlock", () => {
    const s = freshState();
    expect(s.startTime).toBeNull();
    unlockWithResult(s, "Food", 2);
    expect(s.startTime).not.toBeNull();
  });
});

// ═══════════════════════════════════════════
// POPULATION MECHANICS
// ═══════════════════════════════════════════

describe("population mechanics", () => {
  test("wrong answer reduces population", () => {
    const s = freshState();
    const before = s.population;
    const result = s.recordWrongAnswer("Food");
    if (!result.blocked) {
      expect(s.population).toBeLessThan(before);
    }
  });

  test("population never goes below 0", () => {
    const s = freshState();
    s.population = 2;
    s.recordWrongAnswer("Food");
    expect(s.population).toBeGreaterThanOrEqual(0);
  });

  test("game over at population <= 1", () => {
    const s = freshState();
    s.population = 1;
    expect(s.isGameOver).toBe(true);
    s.population = 0;
    expect(s.isGameOver).toBe(true);
    s.population = 2;
    expect(s.isGameOver).toBe(false);
  });

  test("health regen does not exceed pop cap", () => {
    const s = freshState();
    unlockWithResult(s, "Meds", 2);
    unlockWithResult(s, "Shelter", 2);
    unlockWithResult(s, "Food", 2);
    s.recordTechResult("Water", 2);
    s.unlock("Water", 2);
    s.population = s.getPopCap();
    expect(s.tryHealthRegen()).toBe(false);
  });

  test("health regen blocked at population <= 1", () => {
    const s = freshState();
    s.population = 1;
    expect(s.tryHealthRegen()).toBe(false);
  });

  test("tier thresholds are correct", () => {
    const s = freshState();
    s.population = 70;
    expect(s.getPopTier().name).toBe("THRIVING");
    s.population = 50;
    expect(s.getPopTier().name).toBe("STABLE");
    s.population = 30;
    expect(s.getPopTier().name).toBe("STRUGGLING");
    s.population = 15;
    expect(s.getPopTier().name).toBe("CRISIS");
    s.population = 2;
    expect(s.getPopTier().name).toBe("LAST STAND");
    s.population = 1;
    expect(s.getPopTier().name).toBe("FALLEN");
  });
});

// ═══════════════════════════════════════════
// SCOUTING LOGIC (simulated)
// ═══════════════════════════════════════════

describe("scouting logic", () => {
  function getScoutedTechs(state: GameState): TechId[] {
    const reveals = state.getCommsReveals();
    if (reveals <= 0 || state.browseMode) return [];
    const scouted: TechId[] = [];
    for (let era = 1; era <= 5 && scouted.length < reveals; era++) {
      const candidates = TECH_TREE.filter(
        n => n.era === era && state.getNodeState(n.id) === "locked"
      );
      for (let i = 0; i < candidates.length && scouted.length < reveals; i++) {
        scouted.push(candidates[i].id);
      }
    }
    return scouted;
  }

  test("no scouting with 0 comms", () => {
    const s = freshState();
    expect(getScoutedTechs(s)).toEqual([]);
  });

  test("scouting reveals locked techs from earliest era", () => {
    const s = freshState();
    unlockWithResult(s, "Radio", 2);
    expect(s.resources.comms).toBe(1);
    const scouted = getScoutedTechs(s);
    expect(scouted.length).toBe(1);
    const scoutedNode = TECH_TREE.find(n => n.id === scouted[0])!;
    expect(scoutedNode.era).toBeGreaterThanOrEqual(1);
  });

  test("scouting does not jump when first tech in new era is unlocked", () => {
    const s = freshState();
    unlockWithResult(s, "Radio", 2);
    unlockWithResult(s, "Food", 2);
    unlockWithResult(s, "Fuel", 2);
    unlockWithResult(s, "Meds", 2);
    expect(s.isEraUnlocked(1)).toBe(true);

    getScoutedTechs(s);

    unlockWithResult(s, "Shelter", 2);
    s.recordTechResult("Farming", 2);
    s.unlock("Farming", 2);

    const scoutedAfter = getScoutedTechs(s);
    const scoutedErasAfter = new Set(scoutedAfter.map(id => TECH_TREE.find(n => n.id === id)!.era));

    for (const era of scoutedErasAfter) {
      expect(era).toBeGreaterThanOrEqual(1);
    }
  });

  test("scouted techs are always in locked state", () => {
    const s = freshState();
    unlockWithResult(s, "Radio", 2);
    const scouted = getScoutedTechs(s);
    for (const id of scouted) {
      expect(s.getNodeState(id)).toBe("locked");
    }
  });

  test("no scouting in browse mode", () => {
    const s = freshState();
    unlockWithResult(s, "Radio", 2);
    s.browseMode = true;
    expect(getScoutedTechs(s)).toEqual([]);
  });

  test("scouted count never exceeds comms resource", () => {
    const s = freshState();
    unlockWithResult(s, "Radio", 2);
    expect(getScoutedTechs(s).length).toBeLessThanOrEqual(s.resources.comms);
  });
});

// ═══════════════════════════════════════════
// MILESTONE: RECOVERED FROM CRISIS
// ═══════════════════════════════════════════

describe("recoveredFromCrisis milestone", () => {
  test("detects recovery from CRISIS to STABLE via unlock pop gain", () => {
    const s = freshState();
    s.population = 20;
    s.recordWrongAnswer("Food");
    expect(s.getPopTier().name).toBe("CRISIS");

    s.population = 55;
    expect(s.recoveredFromCrisis()).toBe(true);
  });

  test("does not fire when tier unchanged", () => {
    const s = freshState();
    s.population = 50;
    s.recordWrongAnswer("Food");
    expect(s.recoveredFromCrisis()).toBe(false);
  });

  test("does not fire for decline (STABLE to CRISIS)", () => {
    const s = freshState();
    expect(s.getPopTier().name).toBe("STABLE");
    s.population = 15;
    expect(s.recoveredFromCrisis()).toBe(false);
  });

  test("unlock does not clobber prevTierName before milestone check", () => {
    const s = freshState();
    s.population = 20;
    s.recordWrongAnswer("Food");
    const tierAfterWrong = s.getPopTier().name;
    expect(tierAfterWrong).toBe("CRISIS");

    s.recordTechResult("Fuel", 2);
    s.unlock("Fuel", 2);
    expect(s.recoveredFromCrisis()).toBe(s.getPopTier().name === "STABLE" || s.getPopTier().name === "THRIVING");
  });
});

// ═══════════════════════════════════════════
// FULL PLAYTHROUGH
// ═══════════════════════════════════════════

describe("full playthrough", () => {
  test("all-correct playthrough unlocks all 37 techs", () => {
    const s = freshState();
    const order = buildValidOrder();
    expect(order.length).toBe(37);
    for (const id of order) unlockWithResult(s, id, 2);
    expect(s.isComplete).toBe(true);
    expect(s.unlockedCount).toBe(37);
  });

  test("all-correct playthrough reaches max resources", () => {
    const s = freshState();
    const order = buildValidOrder();
    for (const id of order) unlockWithResult(s, id, 2);
    expect(s.resources.food).toBe(RESOURCE_MAX.food);
    expect(s.resources.power).toBe(RESOURCE_MAX.power);
    expect(s.resources.defense).toBe(RESOURCE_MAX.defense);
    expect(s.resources.health).toBe(RESOURCE_MAX.health);
    expect(s.resources.comms).toBe(RESOURCE_MAX.comms);
    expect(s.resources.knowledge).toBe(RESOURCE_MAX.knowledge);
  });

  test("all-correct population reaches cap (110)", () => {
    const s = freshState();
    const order = buildValidOrder();
    for (const id of order) unlockWithResult(s, id, 2);
    expect(s.population).toBe(110);
    expect(s.getPopCap()).toBe(110);
  });

  test("all-wrong playthrough gets stuck at era 0", () => {
    const s = freshState();
    const era0 = TECH_TREE.filter(n => n.era === 0);
    for (const n of era0) unlockWithResult(s, n.id, 0);
    expect(s.getTotalResourcePoints()).toBe(0);
    expect(s.isEraUnlocked(1)).toBe(false);
    const researchable = TECH_TREE.filter(n => s.isResearchable(n.id));
    expect(researchable.length).toBe(0);
  });

  test("mixed playthrough (1-correct) can complete the game", () => {
    const s = freshState();
    const order = buildValidOrder();
    for (const id of order) unlockWithResult(s, id, 1);
    expect(s.isComplete).toBe(true);
  });

  test("valid unlock order never attempts non-researchable tech", () => {
    const s = freshState();
    const order = buildValidOrder();
    for (const id of order) {
      expect(s.isResearchable(id)).toBe(true);
      unlockWithResult(s, id, 2);
    }
  });
});

// ═══════════════════════════════════════════
// SAVE / LOAD
// ═══════════════════════════════════════════

describe("save and load", () => {
  test("export/import round-trip preserves state", () => {
    const s = freshState();
    unlockWithResult(s, "Food", 2);
    unlockWithResult(s, "Fuel", 1);
    unlockWithResult(s, "Radio", 0);
    const json = s.exportSave();

    const s2 = freshState();
    expect(s2.importSave(json)).toBe(true);
    expect(s2.unlockedCount).toBe(3);
    expect(s2.resources.food).toBe(1);
    expect(s2.resources.power).toBe(1);
    expect(s2.resources.comms).toBe(0);
  });

  test("import rejects invalid JSON", () => {
    const s = freshState();
    expect(s.importSave("not json")).toBe(false);
    expect(s.importSave('{"unlocked":[]}')).toBe(false);
  });

  test("reset clears all state", () => {
    const s = freshState();
    unlockWithResult(s, "Food", 2);
    s.reset();
    expect(s.unlockedCount).toBe(0);
    expect(s.population).toBe(50);
    expect(s.score).toBe(0);
    expect(s.getTotalResourcePoints()).toBe(0);
  });
});

// ═══════════════════════════════════════════
// STREAK + SCORE
// ═══════════════════════════════════════════

describe("streak and scoring", () => {
  test("streak increments on correct and tracks best", () => {
    const s = freshState();
    s.incrementStreak();
    s.incrementStreak();
    s.incrementStreak();
    expect(s.streak).toBe(3);
    expect(s.bestStreak).toBe(3);
    s.resetStreak();
    expect(s.streak).toBe(0);
    expect(s.bestStreak).toBe(3);
  });

  test("streak bonuses at 3, 5, 7", () => {
    const s = freshState();
    s.streak = 2; expect(s.getStreakBonus()).toBe(0);
    s.streak = 3; expect(s.getStreakBonus()).toBe(3);
    s.streak = 4; expect(s.getStreakBonus()).toBe(0);
    s.streak = 5; expect(s.getStreakBonus()).toBe(5);
    s.streak = 7; expect(s.getStreakBonus()).toBe(8);
  });

  test("golden age at streak >= 5", () => {
    const s = freshState();
    s.streak = 4; expect(s.isGoldenAge()).toBe(false);
    s.streak = 5; expect(s.isGoldenAge()).toBe(true);
  });

  test("score multiplier scales with knowledge", () => {
    const s = freshState();
    expect(s.getScoreMultiplier()).toBe(1);
    const order = buildValidOrder();
    for (const id of order) {
      const node = TECH_TREE.find(n => n.id === id)!;
      if (node.category === "science") {
        unlockWithResult(s, id, 2);
        break;
      } else {
        unlockWithResult(s, id, 2);
      }
    }
    expect(s.getScoreMultiplier()).toBeGreaterThan(1);
  });
});
