import { TechId } from "./types";
import { TECH_TREE, CONNECTIONS, ERA_LABELS, CATEGORY_COLORS } from "./data";
import { GameState } from "./state";

const ERA_NAMES = ["SURVIVAL", "STABILITY", "FOUNDATION", "INDUSTRY", "ADVANCED", "RENAISSANCE"];
const CANVAS_W = 2010;
const CANVAS_H = 1300;
const COL_DIVIDERS = [318, 633, 948, 1263, 1578];

export class Renderer {
  private canvas: HTMLElement;
  private svgLayer: SVGSVGElement;
  private state: GameState;
  private nodeEls: Map<TechId, HTMLElement> = new Map();
  private pathEls: Map<string, SVGPathElement | SVGLineElement> = new Map();
  private onNodeClick: (id: TechId) => void;

  constructor(state: GameState, onNodeClick: (id: TechId) => void) {
    this.state = state;
    this.onNodeClick = onNodeClick;
    this.canvas = document.getElementById("canvas")!;
    this.canvas.style.width = CANVAS_W + "px";
    this.canvas.style.height = CANVAS_H + "px";
    this.svgLayer = document.getElementById("svg-layer") as unknown as SVGSVGElement;
    this.svgLayer.setAttribute("viewBox", `0 0 ${CANVAS_W} ${CANVAS_H}`);
    this.buildEraLabels();
    this.buildColumnDividers();
    this.buildConnections();
    this.buildNodes();
    this.updateAll();
  }

  private buildEraLabels(): void {
    for (const e of ERA_LABELS) {
      const div = document.createElement("div");
      div.className = "era";
      div.style.left = e.x + "px";
      div.style.color = e.color;
      div.style.borderColor = e.border;
      div.innerHTML = `${e.label}<span>${e.sub}</span>`;
      this.canvas.appendChild(div);
    }
  }

  private buildColumnDividers(): void {
    for (const x of COL_DIVIDERS) {
      const div = document.createElement("div");
      div.className = "col-div";
      div.style.left = x + "px";
      this.canvas.appendChild(div);
    }
  }

  private buildConnections(): void {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arr");
    marker.setAttribute("markerWidth", "5");
    marker.setAttribute("markerHeight", "5");
    marker.setAttribute("refX", "4");
    marker.setAttribute("refY", "2.5");
    marker.setAttribute("orient", "auto");
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", "0,0 5,2.5 0,5");
    poly.setAttribute("fill", "#555");
    marker.appendChild(poly);
    defs.appendChild(marker);
    this.svgLayer.appendChild(defs);

    for (const conn of CONNECTIONS) {
      const key = `${conn.from}-${conn.to}`;
      let el: SVGPathElement | SVGLineElement;

      if (conn.path.includes("C")) {
        el = document.createElementNS("http://www.w3.org/2000/svg", "path");
        el.setAttribute("d", conn.path);
        el.setAttribute("fill", "none");
      } else {
        const parts = conn.path.replace(/[ML]/g, "").trim().split(/\s+/);
        el = document.createElementNS("http://www.w3.org/2000/svg", "line");
        el.setAttribute("x1", parts[0]);
        el.setAttribute("y1", parts[1]);
        el.setAttribute("x2", parts[2]);
        el.setAttribute("y2", parts[3]);
      }

      el.setAttribute("stroke", conn.color);
      el.setAttribute("stroke-width", String(conn.width ?? 1));
      el.setAttribute("opacity", String(conn.opacity ?? 0.5));
      if (conn.dashed) {
        el.setAttribute("stroke-dasharray", "6,4");
      }

      this.svgLayer.appendChild(el);
      this.pathEls.set(key, el);
    }
  }

  private buildNodes(): void {
    for (const node of TECH_TREE) {
      const colors = CATEGORY_COLORS[node.category];
      const div = document.createElement("div");
      div.className = "nd";
      div.dataset.id = node.id;
      div.style.left = node.x + "px";
      div.style.top = node.y + "px";
      div.style.borderColor = colors.border;
      div.style.background = colors.bg;

      div.innerHTML = `
        <div class="nh" style="background:${colors.header};color:${colors.text}">
          <span class="ni">${node.icon}</span> ${node.name}
        </div>
        <div class="nt">${node.title}</div>
        <div class="nf">${node.flavor}</div>
        <div class="nd-badge hidden">✦</div>
        <div class="tt ${node.era >= 4 ? "tt-l" : ""}">
          <div class="tt-h">${node.title}</div>
          <ul>${node.details.map(d => `<li>${d}</li>`).join("")}</ul>
        </div>
      `;

      div.addEventListener("click", () => {
        if (this.state.isResearchable(node.id)) {
          this.onNodeClick(node.id);
        }
      });

      this.canvas.appendChild(div);
      this.nodeEls.set(node.id, div);
    }
  }

  updateAll(): void {
    this.updateNodes();
    this.updateConnections();
    this.updateHeader();
  }

  private updateNodes(): void {
    const browse = this.state.browseMode;
    for (const node of TECH_TREE) {
      const el = this.nodeEls.get(node.id);
      if (!el) continue;
      const st = this.state.getNodeState(node.id);

      el.classList.remove("nd--locked", "nd--researchable", "nd--unlocked", "nd--active", "nd--browse");
      el.classList.add(`nd--${st}`);
      if (browse) el.classList.add("nd--browse");

      const badge = el.querySelector(".nd-badge") as HTMLElement;
      if (badge) {
        badge.classList.toggle("hidden", browse || st !== "unlocked");
      }
    }
  }

  private updateConnections(): void {
    const browse = this.state.browseMode;
    for (const conn of CONNECTIONS) {
      const key = `${conn.from}-${conn.to}`;
      const el = this.pathEls.get(key);
      if (!el) continue;

      if (browse) {
        el.setAttribute("opacity", String(Math.min((conn.opacity ?? 0.5) * 1.8, 1)));
        el.setAttribute("stroke-width", String((conn.width ?? 1) * 1.3));
        continue;
      }

      const fromUnlocked = this.state.isUnlocked(conn.from);
      const toUnlocked = this.state.isUnlocked(conn.to);

      if (fromUnlocked && toUnlocked) {
        el.setAttribute("opacity", String(Math.min((conn.opacity ?? 0.5) * 2, 1)));
        el.setAttribute("stroke-width", String((conn.width ?? 1) * 1.5));
      } else if (fromUnlocked || toUnlocked) {
        el.setAttribute("opacity", String(conn.opacity ?? 0.5));
        el.setAttribute("stroke-width", String(conn.width ?? 1));
      } else {
        el.setAttribute("opacity", String((conn.opacity ?? 0.5) * 0.4));
        el.setAttribute("stroke-width", String((conn.width ?? 1) * 0.7));
      }
    }
  }

  private updateHeader(): void {
    const browse = this.state.browseMode;
    const count = this.state.unlockedCount;
    const total = this.state.totalTechs;
    const pct = total > 0 ? (count / total) * 100 : 0;

    const xpFill = document.getElementById("xp-fill");
    const xpText = document.getElementById("xp-text");
    const scoreVal = document.getElementById("score-val");
    const eraBadge = document.getElementById("era-badge");
    const statsEl = document.getElementById("hdr-stats");
    const legendStates = document.querySelectorAll(".lg-state");
    const toggleBtn = document.getElementById("btn-browse");

    if (xpFill) xpFill.style.width = pct + "%";
    if (xpText) xpText.textContent = `${count}/${total}`;
    if (scoreVal) scoreVal.textContent = String(this.state.score);
    if (eraBadge) eraBadge.textContent = ERA_NAMES[this.state.highestEra] || "SURVIVAL";

    if (statsEl) statsEl.style.display = browse ? "none" : "";
    legendStates.forEach(el => (el as HTMLElement).style.display = browse ? "none" : "");
    if (toggleBtn) toggleBtn.textContent = browse ? "PLAY GAME" : "VIEW TREE";
  }

  setNodeActive(id: TechId): void {
    for (const [nid, el] of this.nodeEls) {
      el.classList.toggle("nd--active", nid === id);
    }
  }

  clearActive(): void {
    for (const el of this.nodeEls.values()) {
      el.classList.remove("nd--active");
    }
    this.updateAll();
  }

  shakeNode(id: TechId): void {
    const el = this.nodeEls.get(id);
    if (!el) return;
    el.classList.add("nd--shake");
    setTimeout(() => el.classList.remove("nd--shake"), 400);
  }
}
