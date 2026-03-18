import { TechId, SaveData, NodeState } from "./types";
import { TECH_TREE } from "./data";

const STORAGE_KEY = "techtree_save";
const POINTS_PER_CORRECT = 10;
const BONUS_PER_TECH = 25;
const POP_GAIN_PER_TECH = 3;
const STARTING_POP = 50;
const MAX_RETRIES = 3;
const COOLDOWN_MS = 10_000;

const ERA_DEATH_COST: Record<number, number> = {
  0: 2, 1: 2, 2: 3, 3: 3, 4: 5, 5: 5,
};

export class GameState {
  unlocked: Set<TechId>;
  unlockOrder: TechId[];
  score: number;
  population: number;
  startTime: number | null;
  elapsed: number;
  browseMode = false;

  private techRetries: Map<TechId, number> = new Map();
  private cooldowns: Map<TechId, number> = new Map();
  private listeners: Array<() => void> = [];

  constructor() {
    this.unlocked = new Set();
    this.unlockOrder = [];
    this.score = 0;
    this.population = STARTING_POP;
    this.startTime = null;
    this.elapsed = 0;
    this.load();
  }

  onChange(fn: () => void): void {
    this.listeners.push(fn);
  }

  private notify(): void {
    for (const fn of this.listeners) fn();
  }

  isUnlocked(id: TechId): boolean {
    return this.unlocked.has(id);
  }

  isResearchable(id: TechId): boolean {
    if (this.unlocked.has(id)) return false;
    if (this.isTechOnCooldown(id)) return false;
    const node = TECH_TREE.find(n => n.id === id);
    if (!node) return false;
    return node.prereqs.every(p => this.unlocked.has(p));
  }

  getNodeState(id: TechId): NodeState {
    if (this.browseMode) return "unlocked";
    if (this.unlocked.has(id)) return "unlocked";
    if (this.isResearchable(id)) return "researchable";
    return "locked";
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
    this.score += BONUS_PER_TECH;
    this.population = Math.min(this.population + POP_GAIN_PER_TECH, 999);
    this.techRetries.delete(id);
    this.save();
    this.notify();
  }

  addScore(points: number): void {
    this.score += points;
    this.save();
    this.notify();
  }

  correctAnswerPoints(): number {
    return POINTS_PER_CORRECT;
  }

  recordWrongAnswer(id: TechId): { dead: number; locked: boolean; gameOver: boolean } {
    const node = TECH_TREE.find(n => n.id === id);
    const era = node?.era ?? 0;
    const cost = ERA_DEATH_COST[era] ?? 3;

    this.population = Math.max(0, this.population - cost);

    const retries = (this.techRetries.get(id) ?? 0) + 1;
    this.techRetries.set(id, retries);

    const locked = retries >= MAX_RETRIES;
    if (locked) {
      this.startCooldown(id);
    }

    this.save();
    this.notify();

    return { dead: cost, locked, gameOver: this.population <= 0 };
  }

  isTechOnCooldown(id: TechId): boolean {
    const until = this.cooldowns.get(id);
    if (!until) return false;
    if (Date.now() >= until) {
      this.cooldowns.delete(id);
      this.techRetries.delete(id);
      return false;
    }
    return true;
  }

  getCooldownRemaining(id: TechId): number {
    const until = this.cooldowns.get(id);
    if (!until) return 0;
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
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
      startTime: this.startTime,
      elapsed: this.elapsed,
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
      this.techRetries.clear();
      this.cooldowns.clear();
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
        startTime: this.startTime,
        elapsed: this.elapsed,
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
    } catch {
      // corrupted save
    }
  }
}
