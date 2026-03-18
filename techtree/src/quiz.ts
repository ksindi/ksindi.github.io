import { TechId, Decision } from "./types";
import { TECH_TREE } from "./data";
import { GameState } from "./state";

const TYPE_SPEED = 18;
const CHOICE_LABELS = ["A", "B", "C", "D"];

export class QuizPanel {
  private el: HTMLElement;
  private titleEl: HTMLElement;
  private bodyEl: HTMLElement;
  private choicesEl: HTMLElement;
  private feedbackEl: HTMLElement;
  private closeBtn: HTMLElement;

  private state: GameState;
  private onComplete: (id: TechId) => void;

  private currentTech: TechId | null = null;
  private decisions: Decision[] = [];
  private decisionIndex = 0;
  private typing = false;
  private typeTimer: number | null = null;

  constructor(state: GameState, onComplete: (id: TechId) => void) {
    this.state = state;
    this.onComplete = onComplete;

    this.el = document.getElementById("quiz")!;
    this.titleEl = document.getElementById("quiz-title")!;
    this.bodyEl = document.getElementById("quiz-body")!;
    this.choicesEl = document.getElementById("quiz-choices")!;
    this.feedbackEl = document.getElementById("quiz-feedback")!;
    this.closeBtn = document.getElementById("quiz-close")!;

    this.closeBtn.addEventListener("click", () => this.close());

    document.addEventListener("keydown", (e) => {
      if (!this.currentTech || this.typing) return;
      const idx = "1234".indexOf(e.key);
      if (idx >= 0 && idx < 4) this.handleAnswer(idx);
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
    this.feedbackEl.textContent = "";
    this.feedbackEl.className = "quiz-feedback";
    this.choicesEl.innerHTML = "";
    this.el.classList.remove("hidden");

    this.typeText(node.scenario, () => {
      setTimeout(() => this.showDecision(), 600);
    });
  }

  close(): void {
    this.currentTech = null;
    this.el.classList.add("hidden");
    this.choicesEl.innerHTML = "";
    this.bodyEl.textContent = "";
    this.feedbackEl.textContent = "";
    if (this.typeTimer !== null) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
  }

  get isOpen(): boolean {
    return this.currentTech !== null;
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
    d.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-choice";
      btn.innerHTML = `<span class="choice-label">[${CHOICE_LABELS[i]}]</span> ${choice}`;
      btn.addEventListener("click", () => this.handleAnswer(i));
      this.choicesEl.appendChild(btn);
    });
  }

  private handleAnswer(index: number): void {
    if (this.typing || !this.currentTech) return;
    const d = this.decisions[this.decisionIndex];
    if (!d) return;

    const buttons = this.choicesEl.querySelectorAll(".quiz-choice");
    buttons.forEach((btn, i) => {
      (btn as HTMLButtonElement).disabled = true;
      if (i === d.answer) btn.classList.add("choice-correct");
      if (i === index && i !== d.answer) btn.classList.add("choice-wrong");
    });

    if (index === d.answer) {
      this.state.addScore(this.state.correctAnswerPoints());
      this.feedbackEl.className = "quiz-feedback fb-correct";
      this.typeTextInFeedback(d.success, () => {
        setTimeout(() => {
          this.decisionIndex++;
          if (this.decisionIndex >= this.decisions.length) {
            this.completeResearch();
          } else {
            this.showDecision();
          }
        }, 1200);
      });
    } else {
      this.feedbackEl.className = "quiz-feedback fb-wrong";
      this.typeTextInFeedback(d.failure, () => {
        setTimeout(() => {
          this.feedbackEl.textContent = "";
          this.feedbackEl.className = "quiz-feedback";
          buttons.forEach(btn => {
            (btn as HTMLButtonElement).disabled = false;
            btn.classList.remove("choice-wrong");
            btn.classList.remove("choice-correct");
          });
        }, 2500);
      });
    }
  }

  private completeResearch(): void {
    if (!this.currentTech) return;
    const id = this.currentTech;

    this.choicesEl.innerHTML = "";
    this.feedbackEl.className = "quiz-feedback fb-correct";
    this.typeText("★ TECHNOLOGY UNLOCKED ★", () => {
      setTimeout(() => {
        this.close();
        this.onComplete(id);
      }, 1000);
    });
  }

  private typeText(text: string, onDone?: () => void): void {
    this.bodyEl.textContent = "";
    this.typing = true;
    let i = 0;

    if (this.typeTimer !== null) clearInterval(this.typeTimer);

    this.typeTimer = window.setInterval(() => {
      if (i < text.length) {
        this.bodyEl.textContent += text[i];
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

  private typeTextInFeedback(text: string, onDone?: () => void): void {
    this.feedbackEl.textContent = "";
    this.typing = true;
    let i = 0;

    if (this.typeTimer !== null) clearInterval(this.typeTimer);

    this.typeTimer = window.setInterval(() => {
      if (i < text.length) {
        this.feedbackEl.textContent += text[i];
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
