const STORAGE_KEY = "techtree_muted";

type SoundName = "tick" | "correct" | "wrong" | "unlock" | "death" | "gameover";

// D minor pentatonic across 2 octaves — no dissonant intervals, always pleasant
const ARP_SCALE = [
  146.83, 174.61, 196.00, 220.00, 261.63,
  293.66, 349.23, 392.00, 440.00, 523.25,
];
const DRONE_ROOTS = [73.42, 82.41, 98.00, 110.00]; // D2, E2, G2, A2

export class AudioManager {
  private ctx: AudioContext | null = null;
  muted: boolean;

  private bgmScheduler: number | null = null;
  private bgmGain: GainNode | null = null;
  private bgmArpNext = 0;
  private bgmDroneNext = 0;
  private bgmNoteIdx = 0;
  private bgmRunning = false;

  constructor() {
    this.muted = localStorage.getItem(STORAGE_KEY) === "1";
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  toggleMute(): void {
    this.muted = !this.muted;
    localStorage.setItem(STORAGE_KEY, this.muted ? "1" : "0");
    if (this.muted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  /* ── Background Music ── */

  startBgm(): void {
    if (this.bgmRunning || this.muted) return;
    try {
      const ctx = this.getCtx();
      if (ctx.state === "suspended") ctx.resume();

      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.value = 0.035;
      this.bgmGain.connect(ctx.destination);

      this.bgmArpNext = ctx.currentTime + 0.5;
      this.bgmDroneNext = ctx.currentTime + 0.1;
      this.bgmNoteIdx = Math.floor(ARP_SCALE.length / 2);
      this.bgmRunning = true;

      this.bgmScheduler = window.setInterval(() => this.scheduleBgm(), 200);
    } catch {
      // Web Audio not supported
    }
  }

  stopBgm(): void {
    if (this.bgmScheduler !== null) {
      clearInterval(this.bgmScheduler);
      this.bgmScheduler = null;
    }
    this.bgmRunning = false;
    if (this.bgmGain && this.ctx) {
      const g = this.bgmGain;
      const now = this.ctx.currentTime;
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(0, now + 1.5);
      setTimeout(() => { try { g.disconnect(); } catch { /* already disconnected */ } }, 2000);
      this.bgmGain = null;
    }
  }

  private scheduleBgm(): void {
    if (!this.bgmGain || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Arpeggio: sparse notes via random walk on pentatonic scale
    while (this.bgmArpNext < now + 1.5) {
      const step = Math.random();
      const dir = step < 0.45 ? 1 : step < 0.8 ? -1 : (Math.floor(Math.random() * 5) - 2);
      this.bgmNoteIdx = Math.max(0, Math.min(ARP_SCALE.length - 1, this.bgmNoteIdx + dir));
      const freq = ARP_SCALE[this.bgmNoteIdx];

      this.bgmTone(ctx, freq, this.bgmArpNext, 2.5 + Math.random() * 1.5, 0.25 + Math.random() * 0.15, "triangle");

      // ~20% chance of a high octave shimmer
      if (Math.random() < 0.2) {
        this.bgmTone(ctx, freq * 2, this.bgmArpNext + 0.15, 1.8, 0.06, "sine");
      }

      this.bgmArpNext += 0.8 + Math.random() * 0.9;
    }

    // Drone: slow sustained root notes
    while (this.bgmDroneNext < now + 3.0) {
      const root = DRONE_ROOTS[Math.floor(Math.random() * DRONE_ROOTS.length)];
      this.bgmTone(ctx, root, this.bgmDroneNext, 7 + Math.random() * 4, 0.12, "triangle");
      this.bgmDroneNext += 6 + Math.random() * 4;
    }
  }

  private bgmTone(ctx: AudioContext, freq: number, start: number, dur: number, vol: number, type: OscillatorType): void {
    if (!this.bgmGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + Math.min(0.15, dur * 0.1));
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  /* ── Sound Effects ── */

  play(name: SoundName): void {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      if (ctx.state === "suspended") ctx.resume();
      switch (name) {
        case "tick": this.playTick(ctx); break;
        case "correct": this.playCorrect(ctx); break;
        case "wrong": this.playWrong(ctx); break;
        case "unlock": this.playUnlock(ctx); break;
        case "death": this.playDeath(ctx); break;
        case "gameover": this.playGameOver(ctx); break;
      }
    } catch {
      // Web Audio not supported
    }
  }

  private tone(ctx: AudioContext, freq: number, start: number, dur: number, vol: number, type: OscillatorType = "sine"): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur);
  }

  private playTick(ctx: AudioContext): void {
    this.tone(ctx, 800, 0, 0.02, 0.03, "square");
  }

  private playCorrect(ctx: AudioContext): void {
    this.tone(ctx, 523, 0, 0.15, 0.12);
    this.tone(ctx, 659, 0.1, 0.2, 0.12);
  }

  private playWrong(ctx: AudioContext): void {
    this.tone(ctx, 220, 0, 0.25, 0.1, "sawtooth");
    this.tone(ctx, 180, 0.1, 0.3, 0.08, "sawtooth");
  }

  private playUnlock(ctx: AudioContext): void {
    this.tone(ctx, 523, 0, 0.15, 0.15);
    this.tone(ctx, 659, 0.12, 0.15, 0.15);
    this.tone(ctx, 784, 0.24, 0.3, 0.18);
  }

  private playDeath(ctx: AudioContext): void {
    this.tone(ctx, 200, 0, 0.4, 0.08, "triangle");
  }

  private playGameOver(ctx: AudioContext): void {
    this.tone(ctx, 440, 0, 0.3, 0.1, "triangle");
    this.tone(ctx, 370, 0.25, 0.3, 0.1, "triangle");
    this.tone(ctx, 330, 0.5, 0.3, 0.1, "triangle");
    this.tone(ctx, 262, 0.75, 0.5, 0.12, "triangle");
  }
}
