import { GameState } from "./state";
import { AudioManager } from "./audio";

const KONAMI_SEQ = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
const KONAMI_KEY = "techtree_konami";
const KONAMI_POP_BONUS = 10;

const TOAST_DURATION = 3000;

// ── Toast utility ──

function showToast(message: string, duration = TOAST_DURATION): void {
  const el = document.createElement("div");
  el.className = "ee-toast";
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("ee-toast--visible"));
  setTimeout(() => {
    el.classList.remove("ee-toast--visible");
    setTimeout(() => el.remove(), 400);
  }, duration);
}

// ── 1. Konami Code ──

function initKonami(state: GameState, audio: AudioManager): void {
  let pos = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === KONAMI_SEQ[pos]) {
      pos++;
      if (pos === KONAMI_SEQ.length) {
        pos = 0;
        if (localStorage.getItem(KONAMI_KEY) === "1") {
          showToast("You already used this cheat, survivor.");
          return;
        }
        localStorage.setItem(KONAMI_KEY, "1");
        state.population = Math.min(state.population + KONAMI_POP_BONUS, state.getPopCap());
        audio.play("unlock");
        showToast(`CHEAT ACTIVATED: +${KONAMI_POP_BONUS} SETTLERS`);
      }
    } else {
      pos = e.key === KONAMI_SEQ[0] ? 1 : 0;
    }
  });
}

// ── 2. Perfect Run (win-screen badge) ──

function checkPerfectRun(state: GameState): boolean {
  return state.isComplete && state.wrongAnswers === 0;
}

// ── 3. Title Click CRT Flicker ──

function initTitleClick(audio: AudioManager): void {
  const title = document.querySelector(".hdr-title");
  if (!title) return;

  let clicks = 0;
  let timer: number | null = null;

  title.addEventListener("click", () => {
    clicks++;
    if (timer !== null) clearTimeout(timer);
    timer = window.setTimeout(() => { clicks = 0; }, 2000);

    if (clicks >= 7) {
      clicks = 0;
      document.body.classList.add("crt-flicker");
      audio.play("tick");
      setTimeout(() => audio.play("tick"), 100);
      setTimeout(() => audio.play("tick"), 200);
      setTimeout(() => document.body.classList.remove("crt-flicker"), 1500);
    }
  });
}

// ── 4. Console Lore ──

function printConsoleLore(): void {
  const style = "color:#0f0;background:#000;font-family:monospace;font-size:14px;padding:4px 8px";
  const styleDim = "color:#0a0;background:#000;font-family:monospace;font-size:11px;padding:2px 8px";

  console.log(
    "%c" + [
      "╔══════════════════════════════════════════╗",
      "║     ▶ R E B O O T ◀                     ║",
      "║     Rebuild Civilization Protocol        ║",
      "╚══════════════════════════════════════════╝",
    ].join("\n"),
    style,
  );
  console.log(
    "%c" + [
      "[ TRANSMISSION INTERCEPTED — 7.83 Hz ]",
      "",
      "If you're reading this, the grid is down.",
      "We cached what we could before the collapse.",
      "Start with what you can forage. Build from there.",
      "",
      "Remember: civilization is not a destination.",
      "It is a process. Begin again.",
      "",
      "— Frequency Keeper, Day 1",
    ].join("\n"),
    styleDim,
  );
}

// ── 5. Population 42 ──

function initPopulation42(state: GameState): void {
  let shown = false;

  state.onChange(() => {
    if (shown) return;
    if (state.population === 42) {
      shown = true;
      showToast("42 — The answer to life, the universe, and everything.");
    }
  });
}

// ── Win-screen badge injection ──

export function decorateWinOverlay(state: GameState): void {
  const stats = document.getElementById("win-stats");
  if (!stats) return;

  const badges: string[] = [];

  if (checkPerfectRun(state)) {
    badges.push("★ FLAWLESS ★");
  }

  for (const badge of badges) {
    const el = document.createElement("div");
    el.className = "ee-badge";
    el.textContent = badge;
    stats.appendChild(el);
  }
}

// ── Main init ──

export function initEasterEggs(state: GameState, audio: AudioManager): void {
  printConsoleLore();
  initKonami(state, audio);
  initTitleClick(audio);
  initPopulation42(state);
}
