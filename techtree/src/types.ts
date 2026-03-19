export type TechId =
  | "Food" | "Fuel" | "Meds" | "Shelter" | "Radio" | "Batteries"
  | "Water" | "Farming" | "OffGrid" | "Preserve" | "Livestock"
  | "CropRotation" | "Soap" | "Charcoal" | "Lime" | "Textiles" | "Pottery" | "Surgery"
  | "Iron" | "Glass" | "Paper" | "Distillation" | "Gunpowder" | "Fertilizer"
  | "Steel" | "Steam" | "Printing" | "Electromag" | "GermTheory" | "Optics"
  | "Telegraph" | "Penicillin" | "Clock" | "SciMethod" | "Photography" | "IntlCombustion";

export type Category = "food" | "energy" | "materials" | "medicine" | "comm" | "chemical" | "science";

export type NodeState = "locked" | "researchable" | "unlocked" | "active";

export type ResourceName = "food" | "power" | "defense" | "health" | "comms" | "knowledge";

export interface Resources {
  food: number;
  power: number;
  defense: number;
  health: number;
  comms: number;
  knowledge: number;
}

export interface Decision {
  prompt: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  success: string;
  failure: string;
}

export interface TechNode {
  id: TechId;
  name: string;
  era: number;
  category: Category;
  icon: string;
  title: string;
  flavor: string;
  details: string[];
  prereqs: TechId[];
  scenario: string;
  decisions: Decision[];
  x: number;
  y: number;
}

export interface Connection {
  from: TechId;
  to: TechId;
  color: string;
  path: string;
  dashed?: boolean;
  opacity?: number;
  width?: number;
}

export interface SaveData {
  unlocked: TechId[];
  unlockOrder: TechId[];
  score: number;
  population: number;
  resources: Resources;
  startTime: number | null;
  elapsed: number;
  tutorialSeen?: boolean;
  wrongAnswers?: number;
}
