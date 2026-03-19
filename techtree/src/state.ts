import { TechId, Category, SaveData, NodeState, Resources } from "./types";
import { TECH_TREE } from "./data";

const STORAGE_KEY = "techtree_save";
const POINTS_PER_CORRECT = 10;
const BONUS_PER_TECH = 25;
const BASE_POP_GAIN = 2;
const STARTING_POP = 50;
const MAX_RETRIES = 3;
const COOLDOWN_MS = 10_000;

const ERA_BASE_COST: Record<number, number> = {
  0: 2, 1: 2, 2: 3, 3: 3, 4: 5, 5: 5,
};

const ERA_GATE: Record<number, number> = {
  0: 0, 1: 3, 2: 3, 3: 4, 4: 3, 5: 4,
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
  browseMode = false;

  private techRetries: Map<TechId, number> = new Map();
  private cooldowns: Map<TechId, number> = new Map();
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

  getPopCap(): number {
    return STARTING_POP + this.resources.food * 10;
  }

  getPopGainPerUnlock(): number {
    return BASE_POP_GAIN + this.resources.food;
  }

  getWrongAnswerCost(era: number): number {
    const base = ERA_BASE_COST[era] ?? 3;
    const reduction = Math.floor(this.resources.power / 2);
    return Math.max(1, base - reduction);
  }

  rollDefenseBlock(): boolean {
    const chance = this.resources.defense * 0.08;
    return Math.random() < chance;
  }

  getScoreMultiplier(): number {
    return 1 + this.resources.knowledge * 0.25;
  }

  getHealthRegenInterval(): number {
    if (this.resources.health === 0) return 0;
    return (30 - this.resources.health * 3) * 1000;
  }

  getCommsReveals(): number {
    return this.resources.comms;
  }

  isUnlocked(id: TechId): boolean {
    return this.unlocked.has(id);
  }

  isResearchable(id: TechId): boolean {
    if (this.unlocked.has(id)) return false;
    if (this.isTechOnCooldown(id)) return false;
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
    const required = ERA_GATE[era] ?? 0;
    if (required === 0) return true;
    return this.getUnlockedCountForEra(era - 1) >= required;
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
    const required = ERA_GATE[era] ?? 0;
    if (required === 0) return null;
    const have = this.getUnlockedCountForEra(era - 1);
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

    const mult = this.getScoreMultiplier();
    this.score += Math.round(BONUS_PER_TECH * mult);

    this.techRetries.delete(id);
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

  recordWrongAnswer(id: TechId): { dead: number; locked: boolean; gameOver: boolean; blocked: boolean } {
    const node = TECH_TREE.find(n => n.id === id);
    const era = node?.era ?? 0;

    if (this.rollDefenseBlock()) {
      const retries = (this.techRetries.get(id) ?? 0) + 1;
      this.techRetries.set(id, retries);
      const locked = retries >= MAX_RETRIES;
      if (locked) this.startCooldown(id);
      this.save();
      this.notify();
      return { dead: 0, locked, gameOver: false, blocked: true };
    }

    const cost = this.getWrongAnswerCost(era);
    this.population = Math.max(0, this.population - cost);

    const retries = (this.techRetries.get(id) ?? 0) + 1;
    this.techRetries.set(id, retries);
    const locked = retries >= MAX_RETRIES;
    if (locked) this.startCooldown(id);

    this.save();
    this.notify();

    return { dead: cost, locked, gameOver: this.population <= 0, blocked: false };
  }

  tryHealthRegen(): boolean {
    if (this.resources.health === 0) return false;
    if (this.population >= this.getPopCap()) return false;
    if (this.population <= 0) return false;
    this.population = Math.min(this.population + 1, this.getPopCap());
    this.save();
    this.notify();
    return true;
  }

  isTechOnCooldown(id: TechId): boolean {
    const until = this.cooldowns.get(id);
    if (!until) return false;
    const adjustedCooldown = Math.max(3000, COOLDOWN_MS - this.resources.power * 1000);
    if (Date.now() >= until - (COOLDOWN_MS - adjustedCooldown)) {
      this.cooldowns.delete(id);
      this.techRetries.delete(id);
      return false;
    }
    return true;
  }

  getCooldownRemaining(id: TechId): number {
    const until = this.cooldowns.get(id);
    if (!until) return 0;
    const adjustedEnd = until - (COOLDOWN_MS - Math.max(3000, COOLDOWN_MS - this.resources.power * 1000));
    return Math.max(0, Math.ceil((adjustedEnd - Date.now()) / 1000));
  }

  private startCooldown(id: TechId): void {
    this.cooldowns.set(id, Date.now() + COOLDOWN_MS);
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
    return this.population <= 0;
  }

  reset(): void {
    this.unlocked.clear();
    this.unlockOrder = [];
    this.score = 0;
    this.population = STARTING_POP;
    this.resources = emptyResources();
    this.startTime = null;
    this.elapsed = 0;
    this.techRetries.clear();
    this.cooldowns.clear();
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
      this.techRetries.clear();
      this.cooldowns.clear();
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
      if (typeof data.population === "number" && data.population > 0) this.population = data.population;
      this.startTime = data.startTime ?? null;
      this.elapsed = typeof data.elapsed === "number" ? data.elapsed : 0;
      this.tutorialSeen = data.tutorialSeen ?? false;
    } catch {
      // corrupted save
    }
  }
}
