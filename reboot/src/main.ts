import { TechId } from "./types";
import { TECH_TREE, ERA_INTROS } from "./data";
import { GameState } from "./state";
import { Renderer } from "./renderer";
import { QuizPanel } from "./quiz";
import { AudioManager } from "./audio";
import { initEasterEggs, decorateWinOverlay, showToast } from "./easter-eggs";
import { checkMilestones, MILESTONES } from "./milestones";

const TYPE_SPEED_ERA = 35;
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
    (id: TechId, correct: number) => {
      const erasBefore = new Set<number>();
      for (let e = 0; e <= 5; e++) {
        if (state.isEraUnlocked(e)) erasBefore.add(e);
      }

      state.recordTechResult(id, correct as 0 | 1 | 2);
      state.unlock(id, correct);
      audio.play("unlock");
      renderer.clearActive();
      renderer.shakeNode(id);
      renderer.pulsePopulationGain();

      const earned = checkMilestones(state);
      for (const m of earned) {
        audio.play("achievement");
        showToast(`🏆 ${m.label}: ${m.title}`, 4000);
      }

      if (state.isComplete) {
        state.snapshotElapsed();
        audio.play("fanfare");
        showWinOverlay(state);
      } else {
        for (let e = 1; e <= 5; e++) {
          if (!erasBefore.has(e) && state.isEraUnlocked(e) && !shownEras.has(e)) {
            shownEras.add(e);
            showEraIntro(e, audio);
            break;
          }
        }
      }
    },
    () => {
      renderer.clearActive();
      renderer.pulsePopulation();
      audio.play("gameover");
      showGameOverOverlay(state);
    },
  );

  state.onChange(() => {
    renderer.updateAll();
  });

  // Health regen timer
  let regenTimer: number | null = null;
  const startRegenTimer = () => {
    if (regenTimer !== null) clearInterval(regenTimer);
    const interval = state.getHealthRegenInterval();
    if (interval <= 0) return;
    regenTimer = window.setInterval(() => {
      if (state.isComplete || state.isGameOver) return;
      if (state.tryHealthRegen()) {
        renderer.pulsePopulationGain();
        renderer.pulseHealthRegen();
      }
    }, interval);
  };
  state.onChange(startRegenTimer);
  startRegenTimer();

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
    if (confirm("Reset all progress?")) doReset(state, shownEras, renderer, quiz, audio, showTutorial);
  });
  document.getElementById("btn-new-game")?.addEventListener("click", () => doReset(state, shownEras, renderer, quiz, audio, showTutorial));
  document.getElementById("btn-retry")?.addEventListener("click", () => doReset(state, shownEras, renderer, quiz, audio, showTutorial));

  // Share buttons
  document.getElementById("btn-share-win")?.addEventListener("click", () => shareResult(state, true));
  document.getElementById("btn-share-go")?.addEventListener("click", () => shareResult(state, false));

  // Global keyboard shortcuts
  document.getElementById("quiz-close")?.addEventListener("click", () => {
    renderer.clearActive();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      renderer.clearActive();
      const modals = ["journal-overlay", "help-overlay"];
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
    else if (key === "q") { renderer.toggleQA(); }
    else if (key === "r") { if (confirm("Reset all progress?")) doReset(state, shownEras, renderer, quiz, audio, showTutorial); }
    else if (key === "?" || key === "h") { document.getElementById("help-overlay")?.classList.toggle("hidden"); }
  });

  // Tutorial
  const tutorialBtn = document.getElementById("tutorial-btn");
  const showTutorial = (onDone: () => void) => {
    const overlay = document.getElementById("tutorial-overlay");
    if (!overlay) { onDone(); return; }
    overlay.classList.remove("hidden");
    const handler = () => {
      overlay.classList.add("hidden");
      tutorialBtn?.removeEventListener("click", handler);
      document.removeEventListener("keydown", keyH);
      state.tutorialSeen = true;
      state.persistTutorialSeen();
      onDone();
    };
    const keyH = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); } };
    tutorialBtn?.addEventListener("click", handler);
    document.addEventListener("keydown", keyH);
  };

  initEasterEggs(state, audio);

  // Initial state
  if (state.isGameOver) {
    showGameOverOverlay(state);
  } else if (state.isComplete) {
    showWinOverlay(state);
  } else if (state.unlockedCount === 0 && !state.tutorialSeen) {
    shownEras.add(0);
    showEraIntro(0, audio, () => showTutorial(() => {}));
  }
}

function doReset(state: GameState, shownEras: Set<number>, renderer: Renderer, quiz: QuizPanel, audio: AudioManager, showTutorial: (onDone: () => void) => void): void {
  state.reset();
  shownEras.clear();
  shownEras.add(0);
  renderer.clearActive();
  quiz.close();
  hideAllOverlays();
  showEraIntro(0, audio, () => showTutorial(() => {}));
}

function hideAllOverlays(): void {
  document.getElementById("win-overlay")?.classList.add("hidden");
  document.getElementById("gameover-overlay")?.classList.add("hidden");
  document.getElementById("era-intro")?.classList.add("hidden");
  document.getElementById("tutorial-overlay")?.classList.add("hidden");
  document.getElementById("journal-overlay")?.classList.add("hidden");
  document.getElementById("help-overlay")?.classList.add("hidden");
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function showEraIntro(era: number, audio: AudioManager, onDone?: () => void): void {
  const info = ERA_INTROS[era];
  if (!info) { onDone?.(); return; }
  const overlay = document.getElementById("era-intro");
  const titleEl = document.getElementById("era-intro-title");
  const textEl = document.getElementById("era-intro-text");
  const btn = document.getElementById("era-intro-btn");
  if (!overlay || !titleEl || !textEl || !btn) { onDone?.(); return; }

  titleEl.textContent = `ERA ${era}: ${info.title}`;
  textEl.textContent = "";
  btn.classList.remove("quiz-continue--ready");
  btn.style.visibility = "hidden";
  overlay.classList.remove("hidden");
  if (era > 0) audio.play("fanfare");

  const revealBtn = () => {
    btn.style.visibility = "";
    btn.classList.add("quiz-continue--ready");
  };

  let i = 0;
  let typing = true;
  const timer = window.setInterval(() => {
    if (i < info.text.length) {
      const ch = info.text[i];
      textEl.textContent += ch;
      if (ch !== " " && i % 3 === 0) audio.play("type");
      i++;
    }
    else { clearInterval(timer); typing = false; revealBtn(); }
  }, TYPE_SPEED_ERA);

  const cleanup = () => {
    clearInterval(timer);
    typing = false;
    document.removeEventListener("keydown", keyHandler);
  };
  const dismiss = () => {
    cleanup();
    if (onDone) {
      const box = overlay.querySelector(".era-intro-box") as HTMLElement;
      if (box) {
        box.style.opacity = "0";
        box.style.transition = "opacity 0.3s";
        setTimeout(() => {
          overlay.classList.add("hidden");
          box.style.opacity = "";
          box.style.transition = "";
          onDone();
        }, 300);
      } else {
        overlay.classList.add("hidden");
        onDone();
      }
    } else {
      overlay.classList.add("hidden");
    }
  };
  const skipTyping = () => {
    if (!typing) return;
    clearInterval(timer);
    textEl.textContent = info.text;
    typing = false;
    revealBtn();
  };
  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      dismiss();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (typing) { skipTyping(); return; }
      dismiss();
    }
  };
  btn.addEventListener("click", () => { if (!typing) dismiss(); });
  document.addEventListener("keydown", keyHandler);
}

function showWinOverlay(state: GameState): void {
  const overlay = document.getElementById("win-overlay");
  const stats = document.getElementById("win-stats");
  const timeline = document.getElementById("win-timeline");
  if (!overlay) return;

  const elapsed = state.getElapsedSeconds();
  if (stats) {
    const streakLine = state.bestStreak >= 2 ? `<div class="win-stat">BEST STREAK: ${state.bestStreak}</div>` : "";
    const badgeLine = state.achievements.length > 0 ? `<div class="win-stat">BADGES: ${state.achievements.length}/${MILESTONES.length}</div>` : "";
    stats.innerHTML = `
      <div class="win-stat">TECHS RESEARCHED: ${state.unlockedCount}/${state.totalTechs}</div>
      <div class="win-stat">SETTLERS ALIVE: ${state.population}</div>
      <div class="win-stat">KNOWLEDGE SCORE: ${state.score}</div>
      ${streakLine}
      ${badgeLine}
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

  decorateWinOverlay(state);
  overlay.classList.remove("hidden");
}

function showGameOverOverlay(state: GameState): void {
  const overlay = document.getElementById("gameover-overlay");
  const stats = document.getElementById("gameover-stats");
  if (!overlay) return;

  if (stats) {
    const streakLine = state.bestStreak >= 2 ? `<div class="gameover-stat">BEST STREAK: ${state.bestStreak}</div>` : "";
    stats.innerHTML = `
      <div class="gameover-stat">TECHS RESEARCHED: ${state.unlockedCount}/${state.totalTechs}</div>
      <div class="gameover-stat">HIGHEST ERA: ${ERA_NAMES[state.highestEra]}</div>
      <div class="gameover-stat">KNOWLEDGE SCORE: ${state.score}</div>
      ${streakLine}
    `;
  }
  overlay.classList.remove("hidden");
}

function showJournal(state: GameState): void {
  const overlay = document.getElementById("journal-overlay");
  const content = document.getElementById("journal-content");
  if (!overlay || !content) return;

  if (state.unlockedCount === 0 && state.achievements.length === 0) {
    content.innerHTML = `<div class="journal-empty">No technologies researched yet. Begin your journey.</div>`;
  } else {
    const lines: string[] = [];

    if (state.achievements.length > 0) {
      lines.push(`<div class="j-era">ACHIEVEMENTS (${state.achievements.length}/${MILESTONES.length})</div>`);
      for (const id of state.achievements) {
        const m = MILESTONES.find(ms => ms.id === id);
        if (!m) continue;
        lines.push(`<div class="j-achievement"><span class="j-ach-label">🏆 ${m.label}</span><span class="j-ach-desc">${m.title}</span></div>`);
      }
    }

    let prevEra = -1;
    const ordered = [...state.unlockOrder]
      .map(id => TECH_TREE.find(n => n.id === id))
      .filter(Boolean);

    const journalMap = new Map(state.journal.map(e => [e.id, e]));

    for (const node of ordered) {
      if (!node) continue;
      if (node.era !== prevEra) {
        prevEra = node.era;
        lines.push(`<div class="j-era">${ERA_NAMES[node.era]}</div>`);
      }

      const entry = journalMap.get(node.id);

      if (entry && entry.choices.length > 0) {
        const decisionHtml = node.decisions.map((d, i) => {
          const chose = entry.choices[i];
          const wasCorrect = entry.correct[i];
          if (chose === undefined) return "";
          const choiceText = d.choices[chose] ?? "Unknown";
          const narrative = wasCorrect ? d.success : d.failure;
          const cls = wasCorrect ? "j-correct" : "j-wrong";
          const icon = wasCorrect ? "✓" : "✗";
          return `<div class="j-decision ${cls}"><div class="j-decision-prompt">${d.prompt}</div><div class="j-decision-choice"><span class="j-decision-icon">${icon}</span> ${choiceText}</div><div class="j-decision-narrative">${narrative}</div></div>`;
        }).join("");

        lines.push(`
          <div class="j-entry">
            <div class="j-entry-hdr">${node.icon} ${node.title}</div>
            <div class="j-entry-scenario">${node.scenario}</div>
            ${decisionHtml}
          </div>
        `);
      } else {
        lines.push(`
          <div class="j-entry">
            <div class="j-entry-hdr">${node.icon} ${node.title}</div>
            <div class="j-entry-flavor">${node.flavor}</div>
            <ul class="j-entry-details">${node.details.map(d => `<li>${d}</li>`).join("")}</ul>
          </div>
        `);
      }
    }
    content.innerHTML = lines.join("");
  }

  overlay.classList.remove("hidden");
}

function buildEmojiGrid(state: GameState, maxEra: number): string {
  const rows: string[] = [];
  for (let era = 0; era <= maxEra; era++) {
    const techs = TECH_TREE.filter(n => n.era === era);
    const squares = techs.map(n => {
      if (!state.isUnlocked(n.id)) return "⬛";
      const r = state.techResults[n.id];
      if (r === 2) return "🟩";
      if (r === 1) return "🟨";
      return "🟥";
    });
    rows.push(squares.join(""));
  }
  return rows.join(" | ");
}

function shareResult(state: GameState, won: boolean): void {
  const grid = buildEmojiGrid(state, won ? 5 : state.highestEra);
  const badges = state.achievements.length;
  const totalBadges = MILESTONES.length;
  const streakLine = state.bestStreak >= 2 ? ` | Best streak: ${state.bestStreak}` : "";
  const elapsed = state.getElapsedSeconds();
  const timeLine = elapsed > 0 ? ` | ${formatTime(elapsed)}` : "";

  const text = won
    ? [
      "REBOOT: Civilization Rebuilt",
      grid,
      `${state.unlockedCount}/${state.totalTechs} techs | ${state.population} settlers | Score ${state.score}`,
      `Badges: ${badges}/${totalBadges}${streakLine}${timeLine}`,
      "ksindi.com/reboot",
    ].join("\n")
    : [
      `REBOOT: Fell at ${ERA_NAMES[state.highestEra]}`,
      grid,
      `${state.unlockedCount}/${state.totalTechs} techs | Score ${state.score}`,
      `Badges: ${badges}/${totalBadges}${streakLine}`,
      "Can you rebuild? ksindi.com/reboot",
    ].join("\n");

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard!"));
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied to clipboard!");
  }
}

document.addEventListener("DOMContentLoaded", init);
