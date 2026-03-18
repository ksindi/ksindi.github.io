import { TechId } from "./types";
import { TECH_TREE, ERA_INTROS } from "./data";
import { GameState } from "./state";
import { Renderer } from "./renderer";
import { QuizPanel } from "./quiz";

const TYPE_SPEED = 20;

function init(): void {
  const state = new GameState();
  const shownEras = new Set<number>();

  for (const id of state.unlocked) {
    const node = TECH_TREE.find(n => n.id === id);
    if (node) shownEras.add(node.era);
  }

  const renderer = new Renderer(state, (id: TechId) => {
    if (quiz.isOpen) return;
    renderer.setNodeActive(id);
    quiz.open(id);
  });

  const quiz = new QuizPanel(state, (id: TechId) => {
    const node = TECH_TREE.find(n => n.id === id);
    const era = node?.era ?? 0;
    const prevHighest = state.highestEra;

    state.unlock(id);
    renderer.clearActive();
    renderer.shakeNode(id);

    if (state.isComplete) {
      showWinOverlay(state);
    } else if (era > prevHighest || !shownEras.has(era)) {
      shownEras.add(era);
      showEraIntro(era, state);
    }
  });

  state.onChange(() => {
    renderer.updateAll();
  });

  const browseBtn = document.getElementById("btn-browse");
  browseBtn?.addEventListener("click", () => {
    if (quiz.isOpen) quiz.close();
    renderer.clearActive();
    state.toggleBrowseMode();
  });

  const resetBtn = document.getElementById("btn-reset");
  resetBtn?.addEventListener("click", () => {
    if (confirm("Reset all progress?")) {
      state.reset();
      shownEras.clear();
      renderer.clearActive();
      quiz.close();
      hideWinOverlay();
      hideEraIntro();
    }
  });

  const newGameBtn = document.getElementById("btn-new-game");
  newGameBtn?.addEventListener("click", () => {
    state.reset();
    shownEras.clear();
    renderer.clearActive();
    quiz.close();
    hideWinOverlay();
    hideEraIntro();
  });

  if (state.isComplete) {
    showWinOverlay(state);
  } else if (state.unlockedCount === 0) {
    showEraIntro(0, state);
  }
}

function showEraIntro(era: number, _state: GameState): void {
  const info = ERA_INTROS[era];
  if (!info) return;

  const overlay = document.getElementById("era-intro");
  const titleEl = document.getElementById("era-intro-title");
  const textEl = document.getElementById("era-intro-text");
  const btn = document.getElementById("era-intro-btn");

  if (!overlay || !titleEl || !textEl || !btn) return;

  titleEl.textContent = `ERA ${era}: ${info.title}`;
  textEl.textContent = "";
  overlay.classList.remove("hidden");

  let i = 0;
  const timer = window.setInterval(() => {
    if (i < info.text.length) {
      textEl.textContent += info.text[i];
      i++;
    } else {
      clearInterval(timer);
    }
  }, TYPE_SPEED);

  const handler = () => {
    clearInterval(timer);
    overlay.classList.add("hidden");
    btn.removeEventListener("click", handler);
  };
  btn.addEventListener("click", handler);
}

function hideEraIntro(): void {
  document.getElementById("era-intro")?.classList.add("hidden");
}

function showWinOverlay(state: GameState): void {
  const overlay = document.getElementById("win-overlay");
  const stats = document.getElementById("win-stats");
  if (!overlay) return;

  if (stats) {
    stats.innerHTML = `
      <div class="win-stat">TECHS RESEARCHED: ${state.unlockedCount}/${state.totalTechs}</div>
      <div class="win-stat">KNOWLEDGE SCORE: ${state.score}</div>
      <div class="win-stat">HIGHEST ERA: RENAISSANCE</div>
    `;
  }

  overlay.classList.remove("hidden");
}

function hideWinOverlay(): void {
  document.getElementById("win-overlay")?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", init);
