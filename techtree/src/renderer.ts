import { TechId } from "./types";
import { TECH_TREE, CONNECTIONS, ERA_LABELS, CATEGORY_COLORS } from "./data";
import { GameState } from "./state";

const ERA_NAMES = ["SURVIVAL", "STABILITY", "FOUNDATION", "INDUSTRY", "ADVANCED", "RENAISSANCE"];
const CANVAS_W = 1600;
const CANVAS_H = 1050;
const COL_DIVIDERS = [252, 502, 752, 1002, 1252];
export class Renderer {
  private canvas: HTMLElement;
  private scrollWrap: HTMLElement;
  private svgLayer: SVGSVGElement;
  private state: GameState;
  private nodeEls: Map<TechId, HTMLElement> = new Map();
  private pathEls: Map<string, SVGPathElement | SVGLineElement> = new Map();
  private onNodeClick: (id: TechId) => void;
  private highlightedChain: Set<TechId> | null = null;
  private highlightedConns: Set<string> | null = null;
  private tappedNode: TechId | null = null;

  constructor(state: GameState, onNodeClick: (id: TechId) => void) {
    this.state = state;
    this.onNodeClick = onNodeClick;
    this.canvas = document.getElementById("canvas")!;
    this.scrollWrap = document.getElementById("scroll-wrap")!;
    this.canvas.style.width = CANVAS_W + "px";
    this.canvas.style.height = CANVAS_H + "px";
    this.svgLayer = document.getElementById("svg-layer") as unknown as SVGSVGElement;
    this.svgLayer.setAttribute("viewBox", `0 0 ${CANVAS_W} ${CANVAS_H}`);
    this.buildEraLabels();
    this.buildColumnDividers();
    this.buildConnections();
    this.buildNodes();
    this.updateAll();

    this.scrollWrap.addEventListener("click", (e) => {
      if (e.target === this.scrollWrap || e.target === this.canvas) {
        this.clearTapHighlight();
      }
    });
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
      el.dataset.from = conn.from;
      el.dataset.to = conn.to;

      this.svgLayer.appendChild(el);
      this.pathEls.set(key, el);
    }
  }

  private getDownstreamChain(id: TechId): { nodes: Set<TechId>; conns: Set<string> } {
    const nodes = new Set<TechId>([id]);
    const conns = new Set<string>();
    const queue = [id];
    const browse = this.state.browseMode;

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const conn of CONNECTIONS) {
        if (conn.from === current && !nodes.has(conn.to)) {
          if (!browse && this.state.getNodeState(conn.to) === "locked") continue;
          nodes.add(conn.to);
          conns.add(`${conn.from}-${conn.to}`);
          queue.push(conn.to);
        }
      }
    }

    for (const conn of CONNECTIONS) {
      if (nodes.has(conn.from) && nodes.has(conn.to)) {
        conns.add(`${conn.from}-${conn.to}`);
      }
    }

    return { nodes, conns };
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
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

      div.addEventListener("click", (e) => {
        if (this.state.getNodeState(node.id) === "locked") return;
        if (this.isMobile()) {
          e.stopPropagation();
          if (this.tappedNode === node.id) {
            if (this.state.isResearchable(node.id)) {
              this.clearTapHighlight();
              this.onNodeClick(node.id);
            }
          } else {
            this.tappedNode = node.id;
            const chain = this.getDownstreamChain(node.id);
            this.highlightedChain = chain.nodes;
            this.highlightedConns = chain.conns;
            this.applyHighlight();
          }
          return;
        }
        if (this.state.isResearchable(node.id)) {
          this.onNodeClick(node.id);
        }
      });

      div.addEventListener("mouseenter", () => {
        if (this.isMobile()) return;
        if (this.state.getNodeState(node.id) === "locked") return;
        const chain = this.getDownstreamChain(node.id);
        this.highlightedChain = chain.nodes;
        this.highlightedConns = chain.conns;
        this.applyHighlight();
      });

      div.addEventListener("mouseleave", () => {
        if (this.isMobile()) return;
        this.highlightedChain = null;
        this.highlightedConns = null;
        this.clearHighlight();
      });

      this.canvas.appendChild(div);
      this.nodeEls.set(node.id, div);
    }
  }

  private clearTapHighlight(): void {
    this.tappedNode = null;
    this.highlightedChain = null;
    this.highlightedConns = null;
    this.clearHighlight();
  }

  private applyHighlight(): void {
    if (!this.highlightedChain) return;
    const browse = this.state.browseMode;

    for (const [id, el] of this.nodeEls) {
      const isLocked = !browse && this.state.getNodeState(id) === "locked";
      if (isLocked) continue;
      if (this.highlightedChain.has(id)) {
        el.classList.add("nd--highlight");
        el.classList.remove("nd--dimmed");
      } else {
        el.classList.add("nd--dimmed");
        el.classList.remove("nd--highlight");
      }
    }

    for (const [key, el] of this.pathEls) {
      const conn = CONNECTIONS.find(c => `${c.from}-${c.to}` === key);
      if (!browse && conn) {
        const fromVisible = this.state.isUnlocked(conn.from) || this.state.isResearchable(conn.from);
        const toVisible = this.state.isUnlocked(conn.to) || this.state.isResearchable(conn.to);
        if (!fromVisible && !toVisible) continue;
      }
      if (this.highlightedConns?.has(key)) {
        el.classList.add("conn--highlight");
        el.classList.remove("conn--dimmed");
      } else {
        el.classList.add("conn--dimmed");
        el.classList.remove("conn--highlight");
      }
    }
  }

  private clearHighlight(): void {
    for (const el of this.nodeEls.values()) {
      el.classList.remove("nd--highlight", "nd--dimmed");
    }
    for (const el of this.pathEls.values()) {
      el.classList.remove("conn--highlight", "conn--dimmed");
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
        el.setAttribute("stroke-width", String((conn.width ?? 1) * 1.5));
        continue;
      }

      const fromVisible = this.state.isUnlocked(conn.from) || this.state.isResearchable(conn.from);
      const toVisible = this.state.isUnlocked(conn.to) || this.state.isResearchable(conn.to);
      const fromUnlocked = this.state.isUnlocked(conn.from);
      const toUnlocked = this.state.isUnlocked(conn.to);

      if (!fromVisible && !toVisible) {
        el.setAttribute("opacity", "0");
      } else if (fromUnlocked && toUnlocked) {
        el.setAttribute("opacity", String(Math.min((conn.opacity ?? 0.5) * 2, 1)));
        el.setAttribute("stroke-width", String((conn.width ?? 1) * 1.5));
      } else if (fromVisible && toVisible) {
        el.setAttribute("opacity", String(conn.opacity ?? 0.5));
        el.setAttribute("stroke-width", String(conn.width ?? 1));
      } else {
        el.setAttribute("opacity", String((conn.opacity ?? 0.5) * 0.3));
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
