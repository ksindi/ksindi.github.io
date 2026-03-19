---
name: reboot-game
description: Architecture and conventions for the Reboot civilization strategy game. Use when editing game code in reboot/, adding techs, modifying game mechanics, fixing bugs, or working on the tech tree UI.
---

# Reboot Game Codebase

## Overview

Reboot is a browser-based civilization-rebuilding strategy game. Players progress through 6 eras (Survival to Renaissance) by making narrative decisions about 36 technologies. Vanilla TypeScript, no framework, bundled with Bun.

Inspired by "The Knowledge" by Lewis Dartnell. All game content is original.

## Project Structure

```
reboot/
  src/
    types.ts       - Type definitions: TechId, TechNode, Decision, Resources, SaveData
    data.ts        - All 36 tech nodes, SVG connections, era labels, category colors, era intros
    state.ts       - GameState class: unlocks, population, resources, tiers, scoring, localStorage
    renderer.ts    - DOM rendering: desktop tree, mobile card list, resource bar, era gates
    quiz.ts        - Quiz panel: scenario typing, decisions, feedback, continue prompts
    main.ts        - Entry point: wires state/renderer/quiz, overlays, keyboard shortcuts
    audio.ts       - Procedural sound effects via Web Audio API (no audio files)
    easter-eggs.ts - Konami code and other hidden features
  index.html       - Single HTML page with all overlay markup
  style.css        - All styles including mobile responsive
  package.json     - Only devDep is typescript. Bun handles bundling.
  tsconfig.json    - Strict mode, ES2020, DOM lib
```

## Build Commands

```bash
cd reboot
bun install          # one-time
bun run dev          # watch mode, open index.html in browser
bun run typecheck    # type-check only
bun run build        # production bundle to dist/game.js
bun run deploy       # build + copy to ../static/reboot/
```

CI builds with `oven-sh/setup-bun@v2` in `.github/workflows/deploy.yml`.

## Game Mechanics

### Tech Tree
- 36 techs across 6 eras (0-5), 7 categories (food, energy, materials, medicine, comm, chemical, science)
- Each tech has: scenario (narrative), 2 decisions (choices with correct answer), prereqs, x/y position
- Era advancement gated by total resource points (not tech count)
- Wrong answers: accept the choice, teach correct answer via narrative, always advance. No retries.

### Resources (6)
Each tech unlock gives +1 to the resource matching its category:
- **Food** (food techs): pop cap = 50 + 10/level
- **Power** (energy techs): reduces wrong-answer population cost
- **Defense** (materials+chemical): % chance to block population loss
- **Health** (medicine): passive pop regen timer
- **Comms** (comm): reveals locked tech names in next era
- **Knowledge** (science): score multiplier for correct answers

### Population Tiers
Population level affects resource effectiveness:
- THRIVING (70+): double health regen, +1 bonus pop/unlock
- STABLE (50-69): normal baseline
- STRUGGLING (30-49): resource effects at 75%
- CRISIS (15-29): effects at 50%, no health regen
- LAST STAND (2-14): all resource bonuses disabled
- FALLEN (<=1): game over

### Scoring
Score only from correct answers (+10 x knowledge multiplier). No free points for unlocking techs. All wrong = score 0.

## Key Conventions

### Adding a New Tech
1. Add TechId to the union in `types.ts`
2. Add full TechNode object in `data.ts` TECH_TREE array (with scenario, 2 decisions, prereqs, x/y position)
3. Add SVG Connection entries in CONNECTIONS array for each prereq
4. Run `bun run typecheck` to verify
5. Run the prereq-connection consistency check:
```bash
node -e "..." # see data integrity scripts in conversation history
```

### Writing Decisions
- Frame as narrative choices, not trivia questions
- `failure` text teaches the correct answer through story (no retry)
- Avoid em dashes. Use periods, commas, or restructured sentences.
- Follow the writing-style skill for prose quality

### SVG Connections
- Paths use absolute coordinates matching node x/y positions
- Node card width: 240px, height: 110px
- Right edge of source to left edge of target
- Cubic bezier for cross-era, line for within-era
- Dashed lines for skip-era or visual-only connections

### Desktop vs Mobile
- Desktop (>=768px): positioned canvas with SVG connections, hover highlights upstream deps
- Mobile (<768px): vertical card list grouped by era, tap to research
- `renderer.ts` builds both views, `syncViewMode()` toggles on resize

### State Persistence
- Auto-saves to localStorage on every state change
- Export/import via JSON file (SAVE/LOAD buttons)
- `SaveData` interface defines the schema
- `tutorialSeen` flag prevents re-showing intro on refresh

### Overlays (z-index order)
- Quiz: 500
- Era intro: 600
- Tutorial: 650
- Journal: 700
- Help: 800
- Game over / Win: 1000

### Keyboard Shortcuts
A/B/C/D (answer), arrows (navigate choices), Space/Enter (skip/continue), Escape (close), V (view tree), J (journal), M (mute), R (reset), H/? (help)
