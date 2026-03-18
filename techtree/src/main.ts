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
    if (quiz.isOpen || state.isGameOver) return;
    renderer.setNodeActive(id);
    quiz.open(id);
  });

  const quiz = new QuizPanel(
    state,
    (id: TechId) => {
      const node = TECH_TREE.find(n => n.id === id);
      const era = node?.era ?? 0;
      const prevHighest = state.highestEra;

      state.unlock(id);
      renderer.clearActive();
      renderer.shakeNode(id);
      renderer.pulsePopulationGain();

      if (state.isComplete) {
        showWinOverlay(state);
      } else if (era > prevHighest || !shownEras.has(era)) {
        shownEras.add(era);
        showEraIntro(era);
      }
    },
    () => {
      renderer.clearActive();
      renderer.pulsePopulation();
      showGameOverOverlay(state);
    },
    (id: TechId) => {
      renderer.clearActive();
      renderer.pulsePopulation();
      renderer.startCooldownTimer(id);
    },
  );

  state.onChange(() => {
    renderer.updateAll();
  });

  const browseBtn = document.getElementById("btn-browse");
  browseBtn?.addEventListener("click", () => {
    if (quiz.isOpen) quiz.close();
    renderer.clearActive();
    state.toggleBrowseMode();
  });

  const exportBtn = document.getElementById("btn-export");
  exportBtn?.addEventListener("click", () => {
    const json = state.exportSave();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "techtree-save.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  const importBtn = document.getElementById("btn-import");
  const importFile = document.getElementById("import-file") as HTMLInputElement | null;
  importBtn?.addEventListener("click", () => importFile?.click());
  importFile?.addEventListener("change", () => {
    const file = importFile.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = state.importSave(reader.result as string);
      if (ok) {
        shownEras.clear();
        for (const id of state.unlocked) {
          const node = TECH_TREE.find(n => n.id === id);
          if (node) shownEras.add(node.era);
        }
        renderer.clearActive();
        quiz.close();
        hideWinOverlay();
        hideGameOverOverlay();
        hideEraIntro();
      } else {
        alert("Invalid save file.");
      }
      importFile.value = "";
    };
    reader.readAsText(file);
  });

  const resetBtn = document.getElementById("btn-reset");
  resetBtn?.addEventListener("click", () => {
    if (confirm("Reset all progress?")) {
      doReset(state, shownEras, renderer, quiz);
    }
  });

  const newGameBtn = document.getElementById("btn-new-game");
  newGameBtn?.addEventListener("click", () => {
    doReset(state, shownEras, renderer, quiz);
  });

  const retryBtn = document.getElementById("btn-retry");
  retryBtn?.addEventListener("click", () => {
    doReset(state, shownEras, renderer, quiz);
  });

  if (state.isGameOver) {
    showGameOverOverlay(state);
  } else if (state.isComplete) {
    showWinOverlay(state);
  } else if (state.unlockedCount === 0) {
    showEraIntro(0);
  }
}

function doReset(state: GameState, shownEras: Set<number>, renderer: Renderer, quiz: QuizPanel): void {
  state.reset();
  shownEras.clear();
  renderer.clearActive();
  quiz.close();
  hideWinOverlay();
  hideGameOverOverlay();
  hideEraIntro();
}

function showEraIntro(era: number): void {
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
      <div class="win-stat">SETTLERS ALIVE: ${state.population}</div>
      <div class="win-stat">KNOWLEDGE SCORE: ${state.score}</div>
    `;
  }

  overlay.classList.remove("hidden");
}

function hideWinOverlay(): void {
  document.getElementById("win-overlay")?.classList.add("hidden");
}

function showGameOverOverlay(state: GameState): void {
  const overlay = document.getElementById("gameover-overlay");
  const stats = document.getElementById("gameover-stats");
  if (!overlay) return;

  if (stats) {
    stats.innerHTML = `
      <div class="gameover-stat">TECHS RESEARCHED: ${state.unlockedCount}/${state.totalTechs}</div>
      <div class="gameover-stat">HIGHEST ERA: ${["SURVIVAL", "STABILITY", "FOUNDATION", "INDUSTRY", "ADVANCED", "RENAISSANCE"][state.highestEra]}</div>
      <div class="gameover-stat">KNOWLEDGE SCORE: ${state.score}</div>
    `;
  }

  overlay.classList.remove("hidden");
}

function hideGameOverOverlay(): void {
  document.getElementById("gameover-overlay")?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", init);
