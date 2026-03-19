import { TechId, Decision } from "./types";
import { TECH_TREE } from "./data";
import { GameState } from "./state";
import { AudioManager } from "./audio";

const TYPE_SPEED = 18;
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
  private onTechLocked: (id: TechId) => void;

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
    onTechLocked: (id: TechId) => void,
  ) {
    this.state = state;
    this.audio = audio;
    this.onComplete = onComplete;
    this.onGameOver = onGameOver;
    this.onTechLocked = onTechLocked;

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

    this.typeTextInto(this.scenarioEl, node.scenario, () => {
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
    btn.className = "quiz-continue";
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
      const pts = this.state.correctAnswerPoints();
      this.state.addScore(pts);
      setTimeout(() => {
        showOutcome();
        this.feedbackEl.className = "quiz-feedback fb-correct";
        this.typeTextInFeedback(`${d.success}\n\n📊 SCORE +${pts}`, () => {
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
        this.feedbackEl.className = "quiz-feedback fb-wrong";
        const deathMsg = `👤 -${result.dead} settlers (${this.state.population} remain)`;

        if (result.gameOver) {
          this.typeTextInFeedback(`${d.failure}\n\n${deathMsg}`, () => {
            this.showContinuePrompt(() => {
              this.close();
              this.onGameOver();
            });
          });
          return;
        }

        if (result.locked) {
          this.typeTextInFeedback(`${d.failure}\n\n${deathMsg} Research suspended. Regroup in 10s.`, () => {
            this.showContinuePrompt(() => {
              this.close();
              this.onTechLocked(techId);
            });
          });
          return;
        }

        this.typeTextInFeedback(`${d.failure}\n\n${deathMsg}`, () => {
          this.showContinuePrompt(() => {
            this.feedbackEl.textContent = "";
            this.feedbackEl.className = "quiz-feedback";
            this.showDecision();
          });
        });
      }, 600);
    }
  }

  private completeResearch(): void {
    if (!this.currentTech) return;
    const id = this.currentTech;

    this.choicesEl.innerHTML = "";
    this.feedbackEl.className = "quiz-feedback fb-correct";
    this.typeText(`★ TECHNOLOGY UNLOCKED ★\n\n👤 +3 settlers joined · 📊 SCORE +25`, () => {
      this.showContinuePrompt(() => {
        this.close();
        this.onComplete(id);
      });
    });
  }

  private typeText(text: string, onDone?: () => void): void {
    this.typeTextInto(this.bodyEl, text, onDone);
  }

  private typeTextInFeedback(text: string, onDone?: () => void): void {
    this.typeTextInto(this.feedbackEl, text, onDone);
  }

  private typeTextInto(el: HTMLElement, text: string, onDone?: () => void): void {
    el.textContent = "";
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
        el.textContent += text[i];
        i++;
      } else {
        if (this.typeTimer !== null) {
          clearInterval(this.typeTimer);
          this.typeTimer = null;
        }
        this.typing = false;
        onDone?.();
      }
    }, TYPE_SPEED);
  }
}
