const STORAGE_KEY = "reboot_muted";

type SoundName = "tick" | "type" | "correct" | "wrong" | "unlock" | "death" | "gameover" | "shield" | "streak" | "achievement" | "fanfare";

export class AudioManager {
  private ctx: AudioContext | null = null;
  muted: boolean;

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
  }

  play(name: SoundName): void {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      if (ctx.state === "suspended") ctx.resume();
      switch (name) {
        case "tick": this.playTick(ctx); break;
        case "type": this.playType(ctx); break;
        case "correct": this.playCorrect(ctx); break;
        case "wrong": this.playWrong(ctx); break;
        case "unlock": this.playUnlock(ctx); break;
        case "death": this.playDeath(ctx); break;
        case "gameover": this.playGameOver(ctx); break;
        case "shield": this.playShield(ctx); break;
        case "streak": this.playStreak(ctx); break;
        case "achievement": this.playAchievement(ctx); break;
        case "fanfare": this.playFanfare(ctx); break;
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

  private playType(ctx: AudioContext): void {
    const freq = 600 + Math.random() * 200;
    this.tone(ctx, freq, 0, 0.015, 0.02, "square");
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

  private playShield(ctx: AudioContext): void {
    this.tone(ctx, 1200, 0, 0.08, 0.12);
    this.tone(ctx, 800, 0.04, 0.15, 0.1);
    this.tone(ctx, 1600, 0.02, 0.06, 0.06, "square");
  }

  private playStreak(ctx: AudioContext): void {
    this.tone(ctx, 587, 0, 0.1, 0.12);
    this.tone(ctx, 740, 0.08, 0.1, 0.12);
    this.tone(ctx, 880, 0.16, 0.15, 0.14);
  }

  private playAchievement(ctx: AudioContext): void {
    this.tone(ctx, 523, 0, 0.12, 0.1);
    this.tone(ctx, 659, 0.1, 0.12, 0.1);
    this.tone(ctx, 784, 0.2, 0.12, 0.12);
    this.tone(ctx, 1047, 0.3, 0.3, 0.15);
  }

  private playFanfare(ctx: AudioContext): void {
    this.tone(ctx, 392, 0, 0.2, 0.1, "triangle");
    this.tone(ctx, 523, 0.18, 0.2, 0.12, "triangle");
    this.tone(ctx, 659, 0.36, 0.2, 0.12, "triangle");
    this.tone(ctx, 784, 0.54, 0.4, 0.15, "triangle");
  }
}
