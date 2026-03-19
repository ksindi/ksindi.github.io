import { TechId } from "./types";
import { TECH_TREE, ERA_INTROS } from "./data";
import { GameState } from "./state";
import { Renderer } from "./renderer";
import { QuizPanel } from "./quiz";
import { AudioManager } from "./audio";

const TYPE_SPEED = 20;
const ERA_NAMES = ["SURVIVAL", "STABILITY", "FOUNDATION", "INDUSTRY", "ADVANCED", "RENAISSANCE"];

function init(): void {
  const state = new GameState();
  const audio = new AudioManager();
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
    audio,
    (id: TechId) => {
      const node = TECH_TREE.find(n => n.id === id);
      const era = node?.era ?? 0;
      const prevHighest = state.highestEra;

      state.unlock(id);
      audio.play("unlock");
      renderer.clearActive();
      renderer.shakeNode(id);
      renderer.pulsePopulationGain();

      if (state.isComplete) {
        state.snapshotElapsed();
        showWinOverlay(state);
      } else if (era > prevHighest || !shownEras.has(era)) {
        shownEras.add(era);
        showEraIntro(era);
      }
    },
    () => {
      renderer.clearActive();
      renderer.pulsePopulation();
      audio.play("gameover");
      showGameOverOverlay(state);
    },
    (id: TechId) => {
      renderer.clearActive();
      renderer.pulsePopulation();
      audio.play("death");
      renderer.startCooldownTimer(id);
    },
  );

  state.onChange(() => {
    renderer.updateAll();
  });

  // Timer display
  setInterval(() => {
    const timerEl = document.getElementById("timer-val");
    const timerRow = document.getElementById("stat-timer");
    if (state.startTime !== null && !state.isComplete && !state.isGameOver) {
      const secs = state.getElapsedSeconds();
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      if (timerEl) timerEl.textContent = `${m}:${String(s).padStart(2, "0")}`;
      if (timerRow) timerRow.style.display = "";
    }
  }, 1000);

  // Mute button
  const muteBtn = document.getElementById("btn-mute");
  const updateMuteBtn = () => { if (muteBtn) muteBtn.textContent = audio.muted ? "🔇" : "🔊"; };
  updateMuteBtn();
  muteBtn?.addEventListener("click", () => { audio.toggleMute(); updateMuteBtn(); });

  // Journal
  const journalBtn = document.getElementById("btn-journal");
  journalBtn?.addEventListener("click", () => showJournal(state));

  // Browse toggle
  const browseBtn = document.getElementById("btn-browse");
  browseBtn?.addEventListener("click", () => {
    if (quiz.isOpen) quiz.close();
    renderer.clearActive();
    state.toggleBrowseMode();
  });

  // Export/Import
  const exportBtn = document.getElementById("btn-export");
  exportBtn?.addEventListener("click", () => {
    const json = state.exportSave();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reboot-save.json";
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
        hideAllOverlays();
      } else {
        alert("Invalid save file.");
      }
      importFile.value = "";
    };
    reader.readAsText(file);
  });

  // Reset / New Game / Retry
  const resetBtn = document.getElementById("btn-reset");
  resetBtn?.addEventListener("click", () => {
    if (confirm("Reset all progress?")) doReset(state, shownEras, renderer, quiz);
  });
  document.getElementById("btn-new-game")?.addEventListener("click", () => doReset(state, shownEras, renderer, quiz));
  document.getElementById("btn-retry")?.addEventListener("click", () => doReset(state, shownEras, renderer, quiz));

  // Share buttons
  document.getElementById("btn-share-win")?.addEventListener("click", () => shareResult(state, true));
  document.getElementById("btn-share-go")?.addEventListener("click", () => shareResult(state, false));

  // Global keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modals = ["journal-overlay", "help-overlay", "era-intro"];
      for (const id of modals) {
        const el = document.getElementById(id);
        if (el && !el.classList.contains("hidden")) {
          el.classList.add("hidden");
          return;
        }
      }
      return;
    }

    if (quiz.isOpen) return;
    const key = e.key.toLowerCase();
    if (key === "v") { browseBtn?.click(); }
    else if (key === "j") { showJournal(state); }
    else if (key === "m") { audio.toggleMute(); updateMuteBtn(); }
    else if (key === "r") { if (confirm("Reset all progress?")) doReset(state, shownEras, renderer, quiz); }
    else if (key === "?" || key === "h") { document.getElementById("help-overlay")?.classList.toggle("hidden"); }
  });

  // Initial state
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
  hideAllOverlays();
}

function hideAllOverlays(): void {
  document.getElementById("win-overlay")?.classList.add("hidden");
  document.getElementById("gameover-overlay")?.classList.add("hidden");
  document.getElementById("era-intro")?.classList.add("hidden");
  document.getElementById("journal-overlay")?.classList.add("hidden");
  document.getElementById("help-overlay")?.classList.add("hidden");
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
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
    if (i < info.text.length) { textEl.textContent += info.text[i]; i++; }
    else clearInterval(timer);
  }, TYPE_SPEED);

  const handler = () => {
    clearInterval(timer);
    overlay.classList.add("hidden");
    btn.removeEventListener("click", handler);
    document.removeEventListener("keydown", keyHandler);
  };
  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  };
  btn.addEventListener("click", handler);
  document.addEventListener("keydown", keyHandler);
}

function showWinOverlay(state: GameState): void {
  const overlay = document.getElementById("win-overlay");
  const stats = document.getElementById("win-stats");
  const timeline = document.getElementById("win-timeline");
  if (!overlay) return;

  const elapsed = state.getElapsedSeconds();
  if (stats) {
    stats.innerHTML = `
      <div class="win-stat">TECHS RESEARCHED: ${state.unlockedCount}/${state.totalTechs}</div>
      <div class="win-stat">SETTLERS ALIVE: ${state.population}</div>
      <div class="win-stat">KNOWLEDGE SCORE: ${state.score}</div>
      ${elapsed > 0 ? `<div class="win-stat">TIME: ${formatTime(elapsed)}</div>` : ""}
    `;
  }

  if (timeline) {
    const lines: string[] = [];
    let prevEra = -1;
    for (const id of state.unlockOrder) {
      const node = TECH_TREE.find(n => n.id === id);
      if (!node) continue;
      if (node.era !== prevEra) {
        prevEra = node.era;
        lines.push(`<div class="tl-era">${ERA_NAMES[node.era]}</div>`);
      }
      lines.push(`<div class="tl-entry">${node.icon} ${node.title}</div>`);
    }
    timeline.innerHTML = lines.join("");
  }

  overlay.classList.remove("hidden");
}

function showGameOverOverlay(state: GameState): void {
  const overlay = document.getElementById("gameover-overlay");
  const stats = document.getElementById("gameover-stats");
  if (!overlay) return;

  if (stats) {
    stats.innerHTML = `
      <div class="gameover-stat">TECHS RESEARCHED: ${state.unlockedCount}/${state.totalTechs}</div>
      <div class="gameover-stat">HIGHEST ERA: ${ERA_NAMES[state.highestEra]}</div>
      <div class="gameover-stat">KNOWLEDGE SCORE: ${state.score}</div>
    `;
  }
  overlay.classList.remove("hidden");
}

function showJournal(state: GameState): void {
  const overlay = document.getElementById("journal-overlay");
  const content = document.getElementById("journal-content");
  if (!overlay || !content) return;

  if (state.unlockedCount === 0) {
    content.innerHTML = `<div class="journal-empty">No technologies researched yet. Begin your journey.</div>`;
  } else {
    const lines: string[] = [];
    let prevEra = -1;
    const ordered = [...state.unlockOrder]
      .map(id => TECH_TREE.find(n => n.id === id))
      .filter(Boolean);

    for (const node of ordered) {
      if (!node) continue;
      if (node.era !== prevEra) {
        prevEra = node.era;
        lines.push(`<div class="j-era">${ERA_NAMES[node.era]}</div>`);
      }
      lines.push(`
        <div class="j-entry">
          <div class="j-entry-hdr">${node.icon} ${node.title}</div>
          <div class="j-entry-flavor">${node.flavor}</div>
          <ul class="j-entry-details">${node.details.map(d => `<li>${d}</li>`).join("")}</ul>
        </div>
      `);
    }
    content.innerHTML = lines.join("");
  }

  overlay.classList.remove("hidden");
}

function shareResult(state: GameState, won: boolean): void {
  const text = won
    ? `I rebuilt civilization in Reboot! ${state.unlockedCount}/${state.totalTechs} techs, ${state.population} settlers alive, score ${state.score}. Play at ksindi.com/techtree`
    : `My settlement fell in Reboot at the ${ERA_NAMES[state.highestEra]} era. ${state.unlockedCount}/${state.totalTechs} techs, score ${state.score}. Can you do better? ksindi.com/techtree`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("Copied to clipboard!");
  }
}

document.addEventListener("DOMContentLoaded", init);
