import { TechId, Category, SaveData, NodeState, Resources } from "./types";
import { TECH_TREE } from "./data";

const STORAGE_KEY = "techtree_save";
const POINTS_PER_CORRECT = 10;


const BASE_POP_GAIN = 2;
const STARTING_POP = 50;

const ERA_BASE_COST: Record<number, number> = {
  0: 2, 1: 2, 2: 3, 3: 3, 4: 5, 5: 5,
};

const ERA_STRENGTH_GATE: Record<number, number> = {
  0: 0, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21,
};

const CATEGORY_TO_RESOURCE: Record<Category, keyof Resources> = {
  food: "food",
  energy: "power",
  materials: "defense",
  chemical: "defense",
  medicine: "health",
  comm: "comms",
  science: "knowledge",
};

const RESOURCE_MAX: Resources = {
  food: 6, power: 7, defense: 9, health: 6, comms: 4, knowledge: 4,
};

export interface PopTier {
  name: string;
  multiplier: number;
  regenEnabled: boolean;
  bonusPopPerUnlock: number;
}

const POP_TIERS: Array<{ minPop: number; tier: PopTier }> = [
  { minPop: 70, tier: { name: "THRIVING", multiplier: 1.0, regenEnabled: true, bonusPopPerUnlock: 1 } },
  { minPop: 50, tier: { name: "STABLE", multiplier: 1.0, regenEnabled: true, bonusPopPerUnlock: 0 } },
  { minPop: 30, tier: { name: "STRUGGLING", multiplier: 0.75, regenEnabled: true, bonusPopPerUnlock: 0 } },
  { minPop: 15, tier: { name: "CRISIS", multiplier: 0.5, regenEnabled: false, bonusPopPerUnlock: 0 } },
  { minPop: 2, tier: { name: "LAST STAND", multiplier: 0, regenEnabled: false, bonusPopPerUnlock: 0 } },
];

function emptyResources(): Resources {
  return { food: 0, power: 0, defense: 0, health: 0, comms: 0, knowledge: 0 };
}

export class GameState {
  unlocked: Set<TechId>;
  unlockOrder: TechId[];
  score: number;
  population: number;
  resources: Resources;
  startTime: number | null;
  elapsed: number;
  tutorialSeen: boolean;
  wrongAnswers: number;
  browseMode = false;

  private listeners: Array<() => void> = [];

  constructor() {
    this.unlocked = new Set();
    this.unlockOrder = [];
    this.score = 0;
    this.population = STARTING_POP;
    this.resources = emptyResources();
    this.startTime = null;
    this.elapsed = 0;
    this.tutorialSeen = false;
    this.wrongAnswers = 0;
    this.load();
    this.recalcResources();
  }

  onChange(fn: () => void): void {
    this.listeners.push(fn);
  }

  private notify(): void {
    for (const fn of this.listeners) fn();
  }

  private recalcResources(): void {
    const r = emptyResources();
    for (const id of this.unlocked) {
      const node = TECH_TREE.find(n => n.id === id);
      if (!node) continue;
      const res = CATEGORY_TO_RESOURCE[node.category];
      r[res] = Math.min(r[res] + 1, RESOURCE_MAX[res]);
    }
    this.resources = r;
  }

  getPopTier(): PopTier {
    for (const entry of POP_TIERS) {
      if (this.population >= entry.minPop) return entry.tier;
    }
    return { name: "FALLEN", multiplier: 0, regenEnabled: false, bonusPopPerUnlock: 0 };
  }

  getPopCap(): number {
    return STARTING_POP + this.resources.food * 10;
  }

  getPopGainPerUnlock(): number {
    const tier = this.getPopTier();
    return BASE_POP_GAIN + this.resources.food + tier.bonusPopPerUnlock;
  }

  getWrongAnswerCost(era: number): number {
    const base = ERA_BASE_COST[era] ?? 3;
    const tier = this.getPopTier();
    const powerReduction = Math.floor(this.resources.power / 2);
    const effectiveReduction = Math.round(powerReduction * tier.multiplier);
    return Math.max(1, base - effectiveReduction);
  }

  rollDefenseBlock(): boolean {
    const tier = this.getPopTier();
    const chance = this.resources.defense * 0.08 * tier.multiplier;
    return Math.random() < chance;
  }

  getScoreMultiplier(): number {
    const tier = this.getPopTier();
    const base = 1 + this.resources.knowledge * 0.25;
    return 1 + (base - 1) * tier.multiplier;
  }

  getHealthRegenInterval(): number {
    const tier = this.getPopTier();
    if (!tier.regenEnabled) return 0;
    if (this.resources.health === 0) return 0;
    const base = (30 - this.resources.health * 3) * 1000;
    if (tier.name === "THRIVING") return Math.round(base / 2);
    return base;
  }

  getCommsReveals(): number {
    return this.resources.comms;
  }

  isUnlocked(id: TechId): boolean {
    return this.unlocked.has(id);
  }

  isResearchable(id: TechId): boolean {
    if (this.unlocked.has(id)) return false;
    const node = TECH_TREE.find(n => n.id === id);
    if (!node) return false;
    if (!node.prereqs.every(p => this.unlocked.has(p))) return false;
    if (node.era > 0 && !this.isEraUnlocked(node.era)) return false;
    return true;
  }

  getNodeState(id: TechId): NodeState {
    if (this.browseMode) return "unlocked";
    if (this.unlocked.has(id)) return "unlocked";
    if (this.isResearchable(id)) return "researchable";
    return "locked";
  }

  isEraUnlocked(era: number): boolean {
    if (era <= 0) return true;
    const required = ERA_STRENGTH_GATE[era] ?? 0;
    if (required === 0) return true;
    return this.getTotalResourcePoints() >= required;
  }

  getTotalResourcePoints(): number {
    const r = this.resources;
    return r.food + r.power + r.defense + r.health + r.comms + r.knowledge;
  }

  getUnlockedCountForEra(era: number): number {
    let count = 0;
    for (const id of this.unlocked) {
      const node = TECH_TREE.find(n => n.id === id);
      if (node && node.era === era) count++;
    }
    return count;
  }

  getEraGateInfo(era: number): { required: number; have: number; met: boolean } | null {
    if (era <= 0) return null;
    const required = ERA_STRENGTH_GATE[era] ?? 0;
    if (required === 0) return null;
    const have = this.getTotalResourcePoints();
    return { required, have, met: have >= required };
  }

  toggleBrowseMode(): void {
    this.browseMode = !this.browseMode;
    this.notify();
  }

  unlock(id: TechId): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
    this.unlocked.add(id);
    if (!this.unlockOrder.includes(id)) {
      this.unlockOrder.push(id);
    }

    this.recalcResources();

    const popGain = this.getPopGainPerUnlock();
    this.population = Math.min(this.population + popGain, this.getPopCap());

    this.save();
    this.notify();
  }

  addScore(points: number): void {
    const mult = this.getScoreMultiplier();
    this.score += Math.round(points * mult);
    this.save();
    this.notify();
  }

  correctAnswerPoints(): number {
    return POINTS_PER_CORRECT;
  }

  recordWrongAnswer(id: TechId): { dead: number; gameOver: boolean; blocked: boolean } {
    const node = TECH_TREE.find(n => n.id === id);
    const era = node?.era ?? 0;
    this.wrongAnswers++;

    if (this.rollDefenseBlock()) {
      this.save();
      this.notify();
      return { dead: 0, gameOver: false, blocked: true };
    }

    const cost = this.getWrongAnswerCost(era);
    this.population = Math.max(0, this.population - cost);

    this.save();
    this.notify();

    return { dead: cost, gameOver: this.population <= 1, blocked: false };
  }

  tryHealthRegen(): boolean {
    const tier = this.getPopTier();
    if (!tier.regenEnabled) return false;
    if (this.resources.health === 0) return false;
    if (this.population >= this.getPopCap()) return false;
    if (this.population <= 1) return false;
    this.population = Math.min(this.population + 1, this.getPopCap());
    this.save();
    this.notify();
    return true;
  }

  getElapsedSeconds(): number {
    if (this.startTime === null) return 0;
    return Math.floor(this.elapsed + (Date.now() - this.startTime) / 1000);
  }

  snapshotElapsed(): void {
    if (this.startTime !== null) {
      this.elapsed += (Date.now() - this.startTime) / 1000;
      this.startTime = Date.now();
      this.save();
    }
  }

  get totalTechs(): number {
    return TECH_TREE.length;
  }

  persistTutorialSeen(): void {
    this.save();
  }

  get unlockedCount(): number {
    return this.unlocked.size;
  }

  get highestEra(): number {
    let max = 0;
    for (const id of this.unlocked) {
      const node = TECH_TREE.find(n => n.id === id);
      if (node && node.era > max) max = node.era;
    }
    return max;
  }

  get isComplete(): boolean {
    return this.unlocked.has("SciMethod");
  }

  get isGameOver(): boolean {
    return this.population <= 1;
  }

  reset(): void {
    this.unlocked.clear();
    this.unlockOrder = [];
    this.score = 0;
    this.population = STARTING_POP;
    this.resources = emptyResources();
    this.startTime = null;
    this.elapsed = 0;
    this.tutorialSeen = false;
    this.wrongAnswers = 0;
    this.save();
    this.notify();
  }

  exportSave(): string {
    this.snapshotElapsed();
    const data: SaveData = {
      unlocked: Array.from(this.unlocked),
      unlockOrder: this.unlockOrder,
      score: this.score,
      population: this.population,
      resources: this.resources,
      startTime: this.startTime,
      elapsed: this.elapsed,
      tutorialSeen: this.tutorialSeen,
      wrongAnswers: this.wrongAnswers,
    };
    return JSON.stringify(data, null, 2);
  }

  importSave(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data.unlocked) || typeof data.score !== "number" || typeof data.population !== "number") {
        return false;
      }
      this.unlocked = new Set(data.unlocked);
      this.unlockOrder = Array.isArray(data.unlockOrder) ? data.unlockOrder : Array.from(this.unlocked);
      this.score = data.score;
      this.population = data.population;
      this.startTime = data.startTime ?? null;
      this.elapsed = data.elapsed ?? 0;
      this.tutorialSeen = data.tutorialSeen ?? true;
      this.wrongAnswers = data.wrongAnswers ?? 0;
      this.recalcResources();
      this.save();
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  private save(): void {
    try {
      const data: SaveData = {
        unlocked: Array.from(this.unlocked),
        unlockOrder: this.unlockOrder,
        score: this.score,
        population: this.population,
        resources: this.resources,
        startTime: this.startTime,
        elapsed: this.elapsed,
        tutorialSeen: this.tutorialSeen,
        wrongAnswers: this.wrongAnswers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.unlocked)) {
        this.unlocked = new Set(data.unlocked);
      }
      this.unlockOrder = Array.isArray(data.unlockOrder) ? data.unlockOrder : Array.from(this.unlocked);
      if (typeof data.score === "number") this.score = data.score;
      if (typeof data.population === "number" && data.population > 1) this.population = data.population;
      this.startTime = data.startTime ?? null;
      this.elapsed = typeof data.elapsed === "number" ? data.elapsed : 0;
      this.tutorialSeen = data.tutorialSeen ?? false;
      this.wrongAnswers = typeof data.wrongAnswers === "number" ? data.wrongAnswers : 0;
    } catch {
      // corrupted save
    }
  }
}
