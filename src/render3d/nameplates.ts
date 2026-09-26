// Nameplates: a handle and a rank word floating above each fighter's head, projected every frame.
// The rank reads the aura meter live: the player climbs NPC .. Aura 9000 as the meter goes -1 .. 1,
// the enemy wears the mirror. Plain DOM labels over the canvas (no texture upload, crisp on phones).
import * as THREE from "three";

export const RANKS = ["NPC", "Side character", "Main character", "Sigma", "Aura 9000"] as const;
export type Rank = (typeof RANKS)[number];

/** Meter -1..1 to one of the 5 rank words (equal fifths, clamped). */
export function rankOf(meter: number): Rank {
  const m = Number.isFinite(meter) ? Math.max(-1, Math.min(1, meter)) : 0;
  return RANKS[Math.min(RANKS.length - 1, Math.floor(((m + 1) / 2) * RANKS.length))];
}

type P = { x: number; y: number; z: number };

class Plate {
  readonly el = document.createElement("div");
  private handle = document.createElement("div");
  private rank = document.createElement("div");
  private last = "";

  constructor(parent: HTMLElement, accent: string) {
    this.el.style.cssText =
      "position:absolute;left:0;top:0;transform:translate(-50%,-100%);pointer-events:none;text-align:center;" +
      "font:700 12px/1.15 system-ui,sans-serif;color:#fff;white-space:nowrap;text-shadow:0 1px 3px #000,0 0 6px #000;" +
      "will-change:transform;display:none";
    this.rank.style.cssText = `font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${accent}`;
    this.el.append(this.handle, this.rank);
    parent.appendChild(this.el);
  }

  set(handle: string, rank: string): void {
    const key = handle + "|" + rank;
    if (key === this.last) return;
    this.last = key;
    this.handle.textContent = handle;
    this.rank.textContent = rank;
  }

  place(x: number, y: number, visible: boolean): void {
    this.el.style.display = visible ? "block" : "none";
    if (visible) this.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`;
  }
}

const v = new THREE.Vector3();

export class Nameplates {
  private layer = document.createElement("div");
  private player: Plate;
  private enemy: Plate;
  playerHandle = "@you";
  enemyHandle = "@rival";

  constructor(private canvas: HTMLCanvasElement) {
    this.layer.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:3";
    (canvas.parentElement ?? document.body).appendChild(this.layer);
    this.player = new Plate(this.layer, "#7dfcff");
    this.enemy = new Plate(this.layer, "#ff6bd6");
  }

  /** Each frame: head anchors in world space, the meter, and whether plates should show at all. */
  update(camera: THREE.Camera, playerHead: P | null, enemyHead: P | null, meter: number, show: boolean): void {
    const r = this.canvas.getBoundingClientRect();
    this.player.set(this.playerHandle, rankOf(meter));
    this.enemy.set(this.enemyHandle, rankOf(-meter));
    this.put(this.player, camera, playerHead, r, show);
    this.put(this.enemy, camera, enemyHead, r, show);
  }

  hide(): void {
    this.player.place(0, 0, false);
    this.enemy.place(0, 0, false);
  }

  private put(plate: Plate, camera: THREE.Camera, head: P | null, r: DOMRect, show: boolean): void {
    if (!show || !head) return plate.place(0, 0, false);
    // 0.28 m above the head bone clears the hair.
    v.set(head.x, head.y + 0.28, head.z).project(camera);
    const inFront = v.z > -1 && v.z < 1;
    const x = r.left + ((v.x + 1) / 2) * r.width;
    const y = r.top + ((1 - v.y) / 2) * r.height;
    const onScreen = x > r.left - 40 && x < r.right + 40 && y > r.top && y < r.bottom;
    plate.place(x, y, inFront && onScreen);
  }

  dispose(): void {
    this.layer.remove();
  }
}
