import { TechId, Decision } from "./types";
import { TECH_TREE } from "./data";
import { GameState } from "./state";
import { AudioManager } from "./audio";

const TYPE_SPEED_SCENARIO = 25;
const TYPE_SPEED_ACTION = 20;
const CHOICE_LABELS = ["A", "B", "C", "D"];

export class QuizPanel {
  private el: HTMLElement;
  private titleEl: HTMLElement;
  private scenarioEl: HTMLElement;
  private bodyEl: HTMLElement;
  private choicesEl: HTMLElement;
  private feedbackEl: HTMLElement;
  private closeBtn: HTMLElement;

  private state: GameState;
  private audio: AudioManager;
  private onComplete: (id: TechId) => void;
  private onGameOver: () => void;

  private currentTech: TechId | null = null;
  private decisions: Decision[] = [];
  private decisionIndex = 0;
  private typing = false;
  private typeTimer: number | null = null;
  private skipRequested = false;
  private continueHandler: (() => void) | null = null;
  private selectedChoice = -1;
  private choiceCount = 0;

  constructor(
    state: GameState,
    audio: AudioManager,
    onComplete: (id: TechId) => void,
    onGameOver: () => void,
  ) {
    this.state = state;
    this.audio = audio;
    this.onComplete = onComplete;
    this.onGameOver = onGameOver;

    this.el = document.getElementById("quiz")!;
    this.titleEl = document.getElementById("quiz-title")!;
    this.scenarioEl = document.getElementById("quiz-scenario")!;
    this.bodyEl = document.getElementById("quiz-body")!;
    this.choicesEl = document.getElementById("quiz-choices")!;
    this.feedbackEl = document.getElementById("quiz-feedback")!;
    this.closeBtn = document.getElementById("quiz-close")!;

    this.closeBtn.addEventListener("click", () => this.close());

    this.bodyEl.addEventListener("click", () => {
      if (this.typing) this.skipRequested = true;
    });

    document.addEventListener("keydown", (e) => {
      if (!this.currentTech) return;

      if (this.typing && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        this.skipRequested = true;
        return;
      }

      if (this.continueHandler && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        this.continueHandler();
        return;
      }

      if (this.typing) return;

      if (e.key === "ArrowDown" && this.choiceCount > 0) {
        e.preventDefault();
        this.selectedChoice = Math.min(this.selectedChoice + 1, this.choiceCount - 1);
        this.updateChoiceHighlight();
        return;
      }
      if (e.key === "ArrowUp" && this.choiceCount > 0) {
        e.preventDefault();
        this.selectedChoice = Math.max(this.selectedChoice - 1, 0);
        this.updateChoiceHighlight();
        return;
      }
      if (e.key === "Enter" && this.selectedChoice >= 0 && this.choiceCount > 0) {
        e.preventDefault();
        this.handleAnswer(this.selectedChoice);
        return;
      }

      const idx = "abcd".indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx < this.choiceCount) this.handleAnswer(idx);
      if (e.key === "Escape") this.close();
    });
  }

  open(id: TechId): void {
    const node = TECH_TREE.find(n => n.id === id);
    if (!node) return;

    this.currentTech = id;
    this.decisions = [...node.decisions];
    this.decisionIndex = 0;

    this.titleEl.textContent = `${node.icon} RESEARCHING: ${node.title}`;
    this.scenarioEl.textContent = "";
    this.bodyEl.textContent = "";
    this.feedbackEl.textContent = "";
    this.feedbackEl.className = "quiz-feedback";
    this.choicesEl.innerHTML = "";
    this.el.classList.remove("hidden");

    this.typeScenario(node.scenario, () => {
      this.showContinuePrompt(() => this.showDecision());
    });
  }

  close(): void {
    this.currentTech = null;
    this.el.classList.add("hidden");
    this.choicesEl.innerHTML = "";
    this.scenarioEl.textContent = "";
    this.bodyEl.textContent = "";
    this.feedbackEl.textContent = "";
    this.continueHandler = null;
    if (this.typeTimer !== null) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
  }

  get isOpen(): boolean {
    return this.currentTech !== null;
  }

  private showContinuePrompt(callback: () => void): void {
    this.choicesEl.innerHTML = "";
    this.selectedChoice = -1;
    this.choiceCount = 0;
    const btn = document.createElement("button");
    btn.className = "quiz-continue quiz-continue--ready";
    btn.textContent = "CONTINUE ▶";

    const handler = () => {
      this.continueHandler = null;
      btn.removeEventListener("click", handler);
      callback();
    };

    btn.addEventListener("click", handler);
    this.continueHandler = handler;
    this.choicesEl.appendChild(btn);
  }

  private showDecision(): void {
    const d = this.decisions[this.decisionIndex];
    if (!d) return;

    this.choicesEl.innerHTML = "";
    this.feedbackEl.textContent = "";
    this.feedbackEl.className = "quiz-feedback";

    this.typeText(d.prompt, () => {
      this.showChoices(d);
    });
  }

  private showChoices(d: Decision): void {
    this.choicesEl.innerHTML = "";
    this.selectedChoice = -1;
    this.choiceCount = d.choices.length;
    d.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-choice";
      btn.innerHTML = `<span class="choice-label">[${CHOICE_LABELS[i]}]</span> ${choice}`;
      btn.addEventListener("click", () => this.handleAnswer(i));
      this.choicesEl.appendChild(btn);
    });
  }

  private updateChoiceHighlight(): void {
    const buttons = this.choicesEl.querySelectorAll(".quiz-choice");
    buttons.forEach((btn, i) => {
      btn.classList.toggle("quiz-choice--selected", i === this.selectedChoice);
    });
  }

  private handleAnswer(index: number): void {
    if (this.typing || !this.currentTech || this.continueHandler) return;
    const d = this.decisions[this.decisionIndex];
    if (!d) return;

    const buttons = this.choicesEl.querySelectorAll(".quiz-choice");
    buttons.forEach((btn, i) => {
      (btn as HTMLButtonElement).disabled = true;
      if (i === d.answer) btn.classList.add("choice-correct");
      if (i === index && i !== d.answer) btn.classList.add("choice-wrong");
    });

    const showOutcome = () => {
      this.bodyEl.textContent = "";
      this.choicesEl.innerHTML = "";
      this.selectedChoice = -1;
      this.choiceCount = 0;
    };

    if (index === d.answer) {
      this.audio.play("correct");
      const basePts = this.state.correctAnswerPoints();
      const mult = this.state.getScoreMultiplier();
      this.state.addScore(basePts);
      const gained = Math.round(basePts * mult);
      const multLabel = mult > 1 ? ` (×${mult.toFixed(1)})` : "";
      setTimeout(() => {
        showOutcome();
        this.feedbackEl.className = "quiz-feedback fb-correct";
        this.typeTextInFeedback(`${d.success}\n\n📊 SCORE +${gained}${multLabel}`, () => {
          this.showContinuePrompt(() => {
            this.feedbackEl.textContent = "";
            this.feedbackEl.className = "quiz-feedback";
            this.decisionIndex++;
            if (this.decisionIndex >= this.decisions.length) {
              this.completeResearch();
            } else {
              this.showDecision();
            }
          });
        });
      }, 600);
    } else {
      const techId = this.currentTech!;
      const result = this.state.recordWrongAnswer(techId);

      this.audio.play("wrong");
      setTimeout(() => {
        showOutcome();

        if (result.blocked) {
          this.feedbackEl.className = "quiz-feedback fb-blocked";
          this.typeTextInFeedback(`${d.failure}\n\n🛡 Your settlement's defenses held. No lives lost.`, () => {
            this.showContinuePrompt(() => this.advanceAfterAnswer());
          });
          return;
        }

        this.feedbackEl.className = "quiz-feedback fb-wrong";
        const deathMsg = `👤 -${result.dead} settlers (${this.state.population} remain)`;
        const tierName = this.state.getPopTier().name;
        const tierNote = tierName !== "STABLE" && tierName !== "THRIVING" ? ` [${tierName}]` : "";

        if (result.gameOver) {
          this.typeTextInFeedback(`${d.failure}\n\n${deathMsg}`, () => {
            this.showContinuePrompt(() => {
              this.close();
              this.onGameOver();
            });
          });
          return;
        }

        this.typeTextInFeedback(`${d.failure}\n\n${deathMsg}${tierNote}`, () => {
          this.showContinuePrompt(() => this.advanceAfterAnswer());
        });
      }, 600);
    }
  }

  private advanceAfterAnswer(): void {
    this.feedbackEl.textContent = "";
    this.feedbackEl.className = "quiz-feedback";
    this.decisionIndex++;
    if (this.decisionIndex >= this.decisions.length) {
      this.completeResearch();
    } else {
      this.showDecision();
    }
  }

  private static CATEGORY_RESOURCE_LABELS: Record<string, { icon: string; name: string; effect: (s: GameState) => string }> = {
    food: { icon: "🌾", name: "FOOD", effect: (s) => `Pop cap now ${s.getPopCap() + 10}` },
    energy: { icon: "⚡", name: "POWER", effect: () => "Reduced mistake losses" },
    materials: { icon: "🛡", name: "DEFENSE", effect: () => "+8% block chance" },
    chemical: { icon: "🛡", name: "DEFENSE", effect: () => "+8% block chance" },
    medicine: { icon: "❤", name: "HEALTH", effect: () => "Faster population regen" },
    comm: { icon: "📡", name: "COMMS", effect: () => "+1 scouted tech" },
    science: { icon: "🧪", name: "KNOWLEDGE", effect: () => "+25% score multiplier" },
  };

  private completeResearch(): void {
    if (!this.currentTech) return;
    const id = this.currentTech;
    const node = TECH_TREE.find(n => n.id === id);

    this.choicesEl.innerHTML = "";
    this.feedbackEl.className = "quiz-feedback fb-correct";
    const popGain = this.state.getPopGainPerUnlock();
    const scoreMult = this.state.getScoreMultiplier();
    const scoreGain = Math.round(25 * scoreMult);
    const multLabel = scoreMult > 1 ? ` (×${scoreMult.toFixed(1)})` : "";

    const resInfo = node ? QuizPanel.CATEGORY_RESOURCE_LABELS[node.category] : null;
    const resLine = resInfo ? `\n${resInfo.icon} ${resInfo.name} +1: ${resInfo.effect(this.state)}` : "";

    this.typeText(`★ TECHNOLOGY UNLOCKED ★\n\n👤 +${popGain} settlers · 📊 SCORE +${scoreGain}${multLabel}${resLine}`, () => {
      this.showContinuePrompt(() => {
        this.close();
        this.onComplete(id);
      });
    });
  }

  private typeText(text: string, onDone?: () => void): void {
    this.typeTextInto(this.bodyEl, text, TYPE_SPEED_ACTION, onDone);
  }

  private typeTextInFeedback(text: string, onDone?: () => void): void {
    this.typeTextInto(this.feedbackEl, text, TYPE_SPEED_ACTION, onDone);
  }

  private typeScenario(text: string, onDone?: () => void): void {
    this.typeTextInto(this.scenarioEl, text, TYPE_SPEED_SCENARIO, onDone);
  }

  private typeTextInto(el: HTMLElement, text: string, speed: number, onDone?: () => void): void {
    el.textContent = "";
    el.classList.add("typing");
    this.typing = true;
    this.skipRequested = false;
    let i = 0;

    if (this.typeTimer !== null) clearInterval(this.typeTimer);

    this.typeTimer = window.setInterval(() => {
      if (this.skipRequested) {
        el.textContent = text;
        i = text.length;
        this.skipRequested = false;
      }

      if (i < text.length) {
        const ch = text[i];
        el.textContent += ch;
        if (ch !== " " && i % 3 === 0) this.audio.play("type");
        i++;
      } else {
        if (this.typeTimer !== null) {
          clearInterval(this.typeTimer);
          this.typeTimer = null;
        }
        el.classList.remove("typing");
        this.typing = false;
        onDone?.();
      }
    }, speed);
  }
}
