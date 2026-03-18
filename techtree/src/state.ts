import { TechId, SaveData, NodeState } from "./types";
import { TECH_TREE } from "./data";

const STORAGE_KEY = "techtree_save";
const POINTS_PER_CORRECT = 10;
const BONUS_PER_TECH = 25;

export class GameState {
  unlocked: Set<TechId>;
  score: number;
  private listeners: Array<() => void> = [];

  constructor() {
    this.unlocked = new Set();
    this.score = 0;
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
    const node = TECH_TREE.find(n => n.id === id);
    if (!node) return false;
    return node.prereqs.every(p => this.unlocked.has(p));
  }

  getNodeState(id: TechId): NodeState {
    if (this.unlocked.has(id)) return "unlocked";
    if (this.isResearchable(id)) return "researchable";
    return "locked";
  }

  unlock(id: TechId): void {
    this.unlocked.add(id);
    this.score += BONUS_PER_TECH;
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

  reset(): void {
    this.unlocked.clear();
    this.score = 0;
    this.save();
    this.notify();
  }

  private save(): void {
    try {
      const data: SaveData = {
        unlocked: Array.from(this.unlocked),
        score: this.score,
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
      const data: SaveData = JSON.parse(raw);
      if (Array.isArray(data.unlocked)) {
        this.unlocked = new Set(data.unlocked);
      }
      if (typeof data.score === "number") {
        this.score = data.score;
      }
    } catch {
      // corrupted save — start fresh
    }
  }
}
