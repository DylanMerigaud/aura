// One aura battle: music, QTE runner, aura meter, characters, camera direction, particles and the HUD.
import type { Dir, Level, QteEvent } from "../qte/types";
import { lineId } from "../qte/types";
import { QteRunner, type Input, type Result } from "../qte/runner";
import { comboMultiplier } from "../qte/judge";
import { Music } from "../audio/music";
import { sfx } from "../audio/sfx";
import { cheer, boo, setCrowd, startCrowd } from "../audio/crowd";
import { play as playVoice, preload } from "../audio/voice";
import { ctx } from "../audio/engine";
import { Camera, W, H } from "./camera";
import { Particles } from "./particles";
import { Character, type Pose } from "./characters";
import { img } from "./assets";
import { getOffset } from "./latency";
import type { TouchMode } from "../qte/input";

export interface BattleStats {
  win: boolean;
  score: number;
  maxCombo: number;
  counts: Record<"perfect" | "great" | "ok" | "miss" | "cringe", number>;
  meter: number;
}

const PX = 360, OX = 920, GROUND = 640;
const TARGET_X = 640, TARGET_Y = 300;
const LANE_PX_PER_BEAT = 260;
const ROT: Record<Dir, number> = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
const GRADE_COLOR = { perfect: "#fff36b", great: "#5dfcff", ok: "#b98cff", miss: "#ff4d6d" };

interface Popup { text: string; color: string; t: number; x: number; y: number; big: boolean }

export class Battle {
  music: Music;
  runner: QteRunner;
  cam = new Camera();
  parts = new Particles(["#35e0ff", "#ff3df2", "#fff36b", "#ffffff"]);
  player: Character;
  opp: Character;
  meter = 0;
  score = 0;
  combo = 0;
  maxCombo = 0;
  counts = { perfect: 0, great: 0, ok: 0, miss: 0, cringe: 0 };
  popups: Popup[] = [];
  taunt: { text: string; until: number } | null = null;
  private tauntIdx = 0;
  private gain: number;
  private charge: ReturnType<typeof sfx.charge> | null = null;
  private hitstop = 0;
  private slowmo = 0;
  private flash = 0;
  private shot: { x: number; y: number; z: number; until: number } | null = null;
  private visT = 0;
  private endAt = -1;
  ended = false;
  stats: BattleStats | null = null;
  private lastBeat = -99;
  private beatAt = 0;
  private crowdHype = 0;
  private offset: number;
  private whooshed = new Set<number>();

  constructor(public level: Level, public windowScale: number, private onDone: (s: BattleStats) => void) {
    this.music = new Music(level.bpm, level.seed, level.lengthBeats, level.phase2Beat);
    this.runner = new QteRunner(level.events, this.music.spb, windowScale, (r) => this.onResult(r));
    this.gain = 1.15 / Math.max(8, level.events.length);
    this.player = new Character(PX, GROUND, 1, "#2b6cff", "#e8b98f", false);
    this.opp = new Character(OX, GROUND, -1, level.opponent.color || "#ff3df2", "#c98f6a", true);
    this.opp.hat = (["none", "beanie", "chef", "cap", "headphones", "crown"] as const)[level.id] ?? "none";
    this.offset = getOffset();
    const ids = [lineId.intro(level.id), lineId.win(level.id), lineId.lose(level.id), ...level.taunts.map((_, i) => lineId.taunt(level.id, i))];
    preload(ids);
  }

  start() {
    startCrowd();
    this.music.onBeat = (b) => {
      if (b < 0) setTimeout(() => sfx.tick(undefined, b === -1), 0);
    };
    this.music.start(4);
    playVoice(lineId.intro(this.level.id), this.level.announcer.intro, { pitch: 0.6, rate: 1.15 });
    this.cam.tletterbox = 1;
    this.cam.focus(OX, 420, 1.25);
    this.cam.cut();
    this.cam.focus(640, 380, 1);
  }

  /** Song time as heard by the player, latency compensated. */
  songNow() {
    return ctx.currentTime - this.music.t0 - this.offset;
  }

  input(i: Input) {
    if (this.ended || this.endAt > 0) return;
    const cur = this.runner.current();
    const at = i.t - this.music.t0 - this.offset;
    // Visual feedback for mash alternation.
    if (cur && cur.ev.type === "mash" && i.kind === "dir" && at >= this.runner.opensAt(cur.ev)) {
      const before = cur.progress;
      this.runner.input({ ...i, t: at });
      if (cur.progress > before) {
        this.player.set("charge", 0.3);
        this.parts.burst(PX + 95, GROUND - 330, 3, 120, 0, 24);
        this.cam.shake(0.08 + Math.min(0.2, cur.progress * 0.004));
      }
      return;
    }
    this.runner.input({ ...i, t: at });
  }

  touchMode(): TouchMode {
    const c = this.runner.current();
    if (!c || this.songNow() < this.runner.opensAt(c.ev) - 0.3) return "hit";
    return c.ev.type === "mash" ? "mash" : c.ev.type === "hold" ? "hold" : "hit";
  }

  private push(delta: number) {
    this.meter = Math.max(-1, Math.min(1, this.meter + delta));
  }

  private popup(text: string, color: string, big = false, x = TARGET_X, y = TARGET_Y + 120) {
    this.popups.push({ text, color, t: 0, x, y, big });
    if (this.popups.length > 6) this.popups.shift();
  }

  private onResult(r: Result) {
    const ev = r.ev;
    if (r.cringe || r.grade === "miss") {
      this.combo = 0;
      if (r.cringe) this.counts.cringe++;
      else this.counts.miss++;
      this.push(-this.gain * (r.cringe ? 1.4 : 1.1));
      if (r.cringe) {
        sfx.scratch();
        this.popup("CRINGE", "#ff4d6d", true);
        this.player.set("cringe", 0.7);
      } else {
        sfx.thud();
        this.popup("MISS", GRADE_COLOR.miss);
        this.player.set("hit", 0.4);
      }
      this.opp.set("release", 0.4);
      this.parts.burst(PX, GROUND - 220, 18, 260, 1, 30, -1);
      this.cam.shake(0.35);
      boo();
      this.crowdHype = Math.max(0, this.crowdHype - 0.2);
      return;
    }
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.counts[r.grade]++;
    const mult = comboMultiplier(this.combo);
    const base = r.grade === "perfect" ? 300 : r.grade === "great" ? 200 : 100;
    const k = r.grade === "perfect" ? 1 : r.grade === "great" ? 0.75 : 0.4;
    const boost = 1 + (mult - 1) * 0.15;
    if (ev.type === "mash") {
      const power = (r.mashCount ?? 0) * (r.mashMult ?? 1);
      this.score += Math.round(power * 25 * mult);
      this.push(Math.min(0.4, power * 0.006 + this.gain) * boost);
      this.release(power, r.mashMult ?? 1);
      return;
    }
    this.score += base * mult;
    this.push(this.gain * k * boost);
    const big = ev.type === "combo" || ev.type === "hold";
    if (r.grade === "perfect") {
      sfx.snap();
      this.hitstop = 0.08;
      this.cam.kick(0.04);
    } else if (r.grade === "great") sfx.great();
    else sfx.ok();
    this.popup(r.grade.toUpperCase() + (big ? "!" : ""), GRADE_COLOR[r.grade], big);
    this.player.set("release", 0.3);
    this.opp.set("hit", 0.35);
    this.parts.burst(TARGET_X, TARGET_Y, r.grade === "perfect" ? 26 : 14, 380, r.grade === "perfect" ? 2 : 0, 28);
    this.parts.burst(OX, GROUND - 230, 10, 200, 0, 26, 1);
    this.cam.shake(r.grade === "perfect" ? 0.25 : 0.12);
    this.crowdHype = Math.min(1, this.crowdHype + 0.08);
    if (big) {
      cheer(0.8);
      this.cutTo(OX, 400, 1.45, 0.55);
      this.opp.set("cringe", 0.6);
    } else if (this.combo % 10 === 0) {
      cheer(0.6);
      this.popup(`${this.combo} COMBO`, "#fff36b", true, TARGET_X, 170);
    }
  }

  /** Aura burst from a MASH: slow motion, flash, punch-in, then a hard cut to the opponent's reaction. */
  private release(power: number, mult: number) {
    const size = Math.min(2, power / 20);
    this.charge?.stop();
    this.charge = null;
    sfx.boom(undefined, size);
    cheer(0.6 + size * 0.5);
    this.player.set("release", 0.9);
    this.opp.set("hit", 1.1);
    this.slowmo = 0.7;
    this.flash = 1;
    this.cam.kick(0.18);
    this.cam.shake(0.9);
    for (let i = 0; i < 60 + power * 3; i++) {
      this.parts.emit(PX + 95, GROUND - 330, 500 + Math.random() * 900, (Math.random() - 0.5) * 300, 0.5 + Math.random() * 0.5, 40 + Math.random() * 40, Math.random() < 0.3 ? 2 : 0);
    }
    this.parts.burst(OX, GROUND - 230, 50, 500, 3, 40);
    const label = mult >= 2 ? "PERFECT RELEASE" : mult >= 1.5 ? "GREAT RELEASE" : mult >= 1 ? "RELEASE" : "WEAK RELEASE";
    this.popup(`${label} x${power.toFixed(0)}`, "#fff36b", true, 640, 200);
    this.crowdHype = 1;
    setTimeout(() => this.cutTo(OX, 400, 1.5, 0.8), 350);
  }

  private cutTo(x: number, y: number, z: number, dur: number) {
    this.shot = { x, y, z, until: this.visT + dur };
    this.cam.focus(x, y, z);
    this.cam.cut();
  }

  update(realDt: number) {
    const now = this.songNow();
    // Hit-stop freezes the picture; slow motion scales it. The music keeps the real clock.
    let dt = realDt;
    if (this.hitstop > 0) {
      this.hitstop -= realDt;
      dt = 0;
    } else if (this.slowmo > 0) {
      this.slowmo -= realDt;
      dt *= 0.3;
    }
    if (this.endAt > 0) dt *= 0.15;
    this.visT += dt;
    if (!this.ended && this.endAt < 0) this.runner.update(now);

    // Beat pulse.
    const beatPos = now / this.music.spb;
    const b = Math.floor(beatPos);
    if (b !== this.lastBeat) {
      this.lastBeat = b;
      this.beatAt = this.visT;
    }

    // Taunts on their scripted beats.
    const ta = this.level.taunts[this.tauntIdx];
    if (ta && beatPos >= ta.beat && this.endAt < 0) {
      this.taunt = { text: ta.text, until: now + 3 * this.music.spb };
      playVoice(lineId.taunt(this.level.id, this.tauntIdx), ta.text, { pitch: 0.5 + this.level.id * 0.05 });
      this.tauntIdx++;
      this.opp.set("victory", 0.8);
      this.push(-0.05);
      const c = this.runner.current();
      if (!c || c.ev.type !== "mash") this.shot = { x: OX - 40, y: 380, z: 1.3, until: this.visT + 1.6 };
    }
    if (this.taunt && now > this.taunt.until) this.taunt = null;

    // Whoosh when an arrow starts flying in.
    for (const s of this.runner.states) {
      if (s.phase !== "pending") continue;
      const ev = s.ev;
      const show = this.runner.showsAt(ev);
      if (now >= show && !this.whooshed.has(ev.beat)) {
        this.whooshed.add(ev.beat);
        sfx.whoosh(ctx.currentTime);
      }
      if (show > now + 1) break;
    }

    // MASH charge tone and camera.
    const cur = this.runner.current();
    const mashing = !!cur && cur.ev.type === "mash" && now >= this.runner.opensAt(cur.ev);
    this.mashing = mashing;
    if (mashing && !this.charge) this.charge = sfx.charge();
    if (!mashing && this.charge) {
      this.charge.stop();
      this.charge = null;
    }
    if (mashing && this.charge && cur) {
      this.charge.set(cur.progress / 30);
      if (Math.random() < 0.6) {
        const a = Math.random() * Math.PI * 2;
        const rad = 40 + cur.progress * 2;
        this.parts.emit(PX + 95 + Math.cos(a) * rad, GROUND - 330 + Math.sin(a) * rad, -Math.cos(a) * 90, -Math.sin(a) * 90, 0.5, 22, 0);
      }
    }

    // Camera direction.
    const cam = this.cam;
    if (this.endAt > 0) {
      // final freeze-frame handled below
    } else if (this.shot && this.visT < this.shot.until) {
      cam.focus(this.shot.x, this.shot.y, this.shot.z);
    } else if (mashing) {
      this.shot = null;
      cam.focus(PX + 60, 390, 1.4, -0.03);
      cam.tletterbox = 1;
    } else {
      this.shot = null;
      const tilt = this.meter < -0.3 ? (this.meter + 0.3) * 0.12 : 0;
      cam.focus(640 + this.meter * 40, 380, 1 + Math.abs(this.meter) * 0.06, tilt);
      cam.tletterbox = this.taunt ? 1 : 0;
    }
    const p2 = this.level.phase2Beat !== undefined && beatPos >= this.level.phase2Beat;
    cam.handheld = p2 ? 1 : this.meter < -0.5 ? 0.5 : 0.15;
    if (p2 && this.level.phase2Beat !== undefined && b === this.level.phase2Beat && this.flash < 0.1 && !this.phase2Shown) {
      this.phase2Shown = true;
      this.flash = 1;
      cam.shake(1);
      this.popup("PHASE 2", "#ff3df2", true, 640, 200);
      sfx.boom();
    }
    cam.update(dt);

    // Characters rest poses follow the meter.
    const pRest: Pose = mashing ? "charge" : this.meter < -0.6 ? "cringe" : "idle";
    const oRest: Pose = this.meter > 0.6 ? "cringe" : "idle";
    this.player.update(dt, pRest);
    this.opp.update(dt, oRest);
    this.parts.update(dt);
    // Ambient aura from each side, proportional to its share.
    const pa = (this.meter + 1) / 2;
    if (Math.random() < pa * 0.8) this.parts.emit(PX + (Math.random() - 0.5) * 90, GROUND - 40 - Math.random() * 300, 0, -60 - Math.random() * 80, 0.8, 18 + pa * 20, 0);
    if (Math.random() < (1 - pa) * 0.8) this.parts.emit(OX + (Math.random() - 0.5) * 90, GROUND - 40 - Math.random() * 300, 0, -60 - Math.random() * 80, 0.8, 18 + (1 - pa) * 20, 1);
    for (const p of this.popups) p.t += realDt;
    this.flash = Math.max(0, this.flash - realDt * 3);
    this.crowdHype = Math.max(0, this.crowdHype - realDt * 0.15);
    setCrowd(this.meter, this.crowdHype);

    // End conditions: an edge, or the song is over.
    if (this.endAt < 0) {
      const edge = Math.abs(this.meter) >= 1;
      const over = beatPos >= this.level.lengthBeats + 1;
      if (edge || over) this.finishBattle();
    } else if (!this.ended && ctx.currentTime > this.endAt) {
      this.ended = true;
      this.onDone(this.stats!);
    }
  }

  private phase2Shown = false;
  private mashing = false;

  private finishBattle() {
    const win = this.meter > 0;
    this.stats = { win, score: this.score, maxCombo: this.maxCombo, counts: { ...this.counts }, meter: this.meter };
    this.endAt = ctx.currentTime + 3.2;
    this.music.stop();
    this.charge?.stop();
    this.charge = null;
    this.cam.tletterbox = 1;
    this.flash = 1;
    if (win) {
      this.player.set("victory", 99);
      this.opp.set("cringe", 99);
      this.cam.focus(PX + 40, 400, 1.5, -0.04);
      cheer(2);
      sfx.boom(undefined, 1.5);
      playVoice(lineId.win(this.level.id), this.level.announcer.win, { pitch: 0.6 });
    } else {
      this.player.set("cringe", 99);
      this.opp.set("victory", 99);
      this.cam.focus(OX - 40, 400, 1.5, 0.05);
      boo();
      sfx.scratch();
      playVoice(lineId.lose(this.level.id), this.level.announcer.lose, { pitch: 0.6 });
    }
    this.cam.cut();
  }

  // ---------------------------------------------------------------- drawing

  draw(g: CanvasRenderingContext2D) {
    const now = this.songNow();
    const pulse = Math.exp(-(this.visT - this.beatAt) * 7);
    const cam = this.cam;
    g.fillStyle = "#07040f";
    g.fillRect(0, 0, W, H);

    // Background with parallax.
    g.save();
    cam.apply(g);
    const bg = img(this.level.artKey);
    const pb = cam.parallax(0.35);
    if (bg) g.drawImage(bg, -80 + pb.x, -60 + pb.y, W + 160, H + 120);
    else {
      const grd = g.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, "#1a0633");
      grd.addColorStop(1, "#05020a");
      g.fillStyle = grd;
      g.fillRect(-200, -200, W + 400, H + 400);
    }
    // Kick pulse on the whole set.
    if (pulse > 0.05) {
      g.globalCompositeOperation = "lighter";
      g.fillStyle = `rgba(120,60,255,${pulse * 0.08})`;
      g.fillRect(-200, -200, W + 400, H + 400);
      g.globalCompositeOperation = "source-over";
    }
    // Floor glow and vignette under the fighters.
    g.fillStyle = "rgba(5,2,12,0.55)";
    g.fillRect(-200, GROUND - 10, W + 400, 400);
    const pa = (this.meter + 1) / 2;
    this.glowFloor(g, PX, pa, "rgba(53,224,255,");
    this.glowFloor(g, OX, 1 - pa, "rgba(255,61,242,");

    // Back crowd.
    this.crowd(g, cam.parallax(0.7), GROUND - 60, 0.75, "#140a24", 0.5, 20);

    const time = this.visT;
    const sp = this.parts.sprites;
    g.globalCompositeOperation = "lighter";
    const ps = 260 + pa * 320 + pulse * 30, os = 260 + (1 - pa) * 320 + pulse * 30;
    g.globalAlpha = 0.35 + pa * 0.5;
    g.drawImage(sp[0], PX - ps / 2, GROUND - 200 - ps / 2, ps, ps * 1.2);
    g.globalAlpha = 0.35 + (1 - pa) * 0.5;
    g.drawImage(sp[1], OX - os / 2, GROUND - 200 - os / 2, os, os * 1.2);
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    this.opp.draw(g, time, 1, pulse);
    this.player.draw(g, time, 1, pulse);
    this.parts.draw(g);
    this.mashOrb(g, now);
    // Foreground crowd jumps with the meter.
    this.crowd(g, cam.parallax(1.35), H + 40, 1.6, "#000", 1 + this.crowdHype * 2, 11);
    g.restore();
    if (this.mashing) this.speedLines(g);
    if (this.taunt) this.bubble(g, this.taunt.text);
    // The QTE lane lives in screen space so it stays readable through every camera move.
    this.lane(g, now, pulse);
    this.drawPopups(g);

    // Letterbox, then the HUD on top of it.
    const lb = cam.letterbox * 70;
    if (lb > 1) {
      g.fillStyle = "#000";
      g.fillRect(0, 0, W, lb);
      g.fillRect(0, H - lb, W, lb);
    }
    this.hud(g, pulse);
    if (this.flash > 0) {
      g.fillStyle = `rgba(255,255,255,${this.flash * 0.8})`;
      g.fillRect(0, 0, W, H);
    }
    if (this.endAt > 0 && this.stats) this.titleCard(g);
    if (now < 0) this.countIn(g, now);
  }

  private glowFloor(g: CanvasRenderingContext2D, x: number, k: number, rgba: string) {
    const grd = g.createRadialGradient(x, GROUND, 10, x, GROUND, 260);
    grd.addColorStop(0, rgba + (0.2 + k * 0.5) + ")");
    grd.addColorStop(1, rgba + "0)");
    g.fillStyle = grd;
    g.fillRect(x - 280, GROUND - 200, 560, 330);
  }

  private crowd(g: CanvasRenderingContext2D, off: { x: number; y: number }, baseY: number, scale: number, color: string, jump: number, n: number) {
    g.fillStyle = color;
    const span = (W + 400) / n;
    for (let i = 0; i < n; i++) {
      const x = -200 + i * span + off.x + ((i * 37) % 23);
      const ph = i * 1.7;
      const hop = Math.max(0, Math.sin(this.visT * 9 + ph)) * 14 * jump * scale;
      const y = baseY + off.y - hop;
      const r = 26 * scale * (0.85 + ((i * 13) % 7) / 20);
      g.beginPath();
      g.arc(x, y - r * 2.2, r, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.roundRect(x - r * 1.5, y - r * 1.2, r * 3, r * 4, r);
      g.fill();
      if (jump > 1.5 && i % 3 === 0) {
        g.fillRect(x + r * 0.9, y - r * 4.2, r * 0.45, r * 2.4);
      }
    }
  }

  private arrow(g: CanvasRenderingContext2D, x: number, y: number, dir: Dir, size: number, color: string, alpha = 1) {
    g.save();
    g.translate(x, y);
    g.rotate(ROT[dir]);
    g.globalAlpha = alpha;
    g.fillStyle = color;
    g.shadowColor = color;
    g.shadowBlur = 18;
    g.beginPath();
    const s = size;
    g.moveTo(s, 0);
    g.lineTo(0, -s * 0.8);
    g.lineTo(0, -s * 0.35);
    g.lineTo(-s * 0.85, -s * 0.35);
    g.lineTo(-s * 0.85, s * 0.35);
    g.lineTo(0, s * 0.35);
    g.lineTo(0, s * 0.8);
    g.closePath();
    g.fill();
    g.shadowBlur = 0;
    g.strokeStyle = "#fff";
    g.lineWidth = 3;
    g.stroke();
    g.restore();
  }

  private lane(g: CanvasRenderingContext2D, now: number, pulse: number) {
    const spb = this.music.spb;
    const cur = this.runner.current();
    // Target ring.
    g.strokeStyle = `rgba(255,255,255,${0.35 + pulse * 0.5})`;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(TARGET_X, TARGET_Y, 46 + pulse * 6, 0, Math.PI * 2);
    g.stroke();
    for (const s of this.runner.states) {
      if (s.phase === "done") continue;
      const ev = s.ev;
      const show = this.runner.showsAt(ev);
      if (now < show) break;
      const T = ev.beat * spb;
      if (ev.type === "hit") {
        const x = TARGET_X + ((T - now) / spb) * LANE_PX_PER_BEAT;
        this.arrow(g, x, TARGET_Y, ev.dir, 38, "#35e0ff");
      } else if (ev.type === "combo") {
        const n = ev.dirs.length;
        const x0 = TARGET_X - ((n - 1) * 84) / 2;
        for (let i = 0; i < n; i++) {
          const done = i < s.progress;
          this.arrow(g, x0 + i * 84, TARGET_Y - 110, ev.dirs[i], done ? 30 : 34, done ? "#fff36b" : "#ff3df2", done ? 0.5 : 1);
        }
        this.timerRing(g, TARGET_X, TARGET_Y, (T - now) / ((n + 2) * spb), "#ff3df2");
        this.label(g, "COMBO", TARGET_X, TARGET_Y + 8, "#ff3df2", 26);
      } else if (ev.type === "hold") {
        const R = T + ev.length * spb;
        if (!s.held) {
          this.timerRing(g, TARGET_X, TARGET_Y, (T - now) / (2 * spb), "#fff36b");
          this.label(g, "HOLD SPACE", TARGET_X, TARGET_Y + 10, "#fff36b", 24);
        } else {
          const k = Math.min(1, (now - T) / (R - T));
          g.strokeStyle = "#fff36b";
          g.lineWidth = 12;
          g.beginPath();
          g.arc(TARGET_X, TARGET_Y, 58, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2);
          g.stroke();
          this.label(g, k >= 0.97 ? "RELEASE!" : "HOLD...", TARGET_X, TARGET_Y + 10, "#fff", 26);
        }
      } else if (ev.type === "mash" && s === cur) {
        const R = T + ev.length * spb;
        if (now >= this.runner.opensAt(ev)) {
          const left = s.lastDir !== "left";
          const mx = 960, my = 330;
          this.arrow(g, mx - 90, my, "left", left ? 44 : 32, left ? "#35e0ff" : "#1b5b70");
          this.arrow(g, mx + 90, my, "right", left ? 32 : 44, left ? "#1b5b70" : "#35e0ff");
          this.label(g, `${s.progress}`, mx, my + 4, "#fff", 44 + Math.min(30, s.progress));
          this.label(g, "MASH", mx, my - 90, "#35e0ff", 44);
          this.timerRing(g, mx, my, (R - now) / (R - T), "#fff36b");
          if (R - now < 1.5 * spb) this.label(g, "SPACE TO RELEASE!", mx, my + 130, "#fff36b", 34 + Math.sin(this.visT * 30) * 3);
        } else {
          this.label(g, "MASH INCOMING", TARGET_X, TARGET_Y, "#35e0ff", 30);
        }
      }
    }
  }

  private speedLines(g: CanvasRenderingContext2D) {
    g.strokeStyle = "rgba(255,255,255,0.18)";
    g.lineWidth = 3;
    g.beginPath();
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2 + ((this.visT * 7) % 1) * 0.2;
      const r0 = 380 + ((i * 97) % 120) + Math.sin(this.visT * 40 + i) * 40;
      g.moveTo(W / 2 + Math.cos(a) * r0, H / 2 + Math.sin(a) * r0);
      g.lineTo(W / 2 + Math.cos(a) * 900, H / 2 + Math.sin(a) * 900);
    }
    g.stroke();
  }

  private timerRing(g: CanvasRenderingContext2D, x: number, y: number, k: number, color: string) {
    k = Math.max(0, Math.min(1, k));
    g.strokeStyle = color;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(x, y, 50 + k * 80, 0, Math.PI * 2);
    g.globalAlpha = 1 - k * 0.6;
    g.stroke();
    g.globalAlpha = 1;
  }

  private label(g: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, size: number) {
    g.font = `900 ${size}px "Arial Black", Impact, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.lineWidth = size / 6;
    g.strokeStyle = "#000";
    g.strokeText(text, x, y);
    g.fillStyle = color;
    g.fillText(text, x, y);
  }

  private mashOrb(g: CanvasRenderingContext2D, now: number) {
    const cur = this.runner.current();
    if (!cur || cur.ev.type !== "mash" || now < this.runner.opensAt(cur.ev)) return;
    const r = 20 + cur.progress * 2.4;
    const x = PX + 95, y = GROUND - 330;
    g.globalCompositeOperation = "lighter";
    const sp = this.parts.sprites;
    const wob = 1 + Math.sin(this.visT * 30) * 0.06;
    g.drawImage(sp[0], x - r * 2 * wob, y - r * 2 * wob, r * 4 * wob, r * 4 * wob);
    g.drawImage(sp[3], x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6);
    g.globalCompositeOperation = "source-over";
  }

  private drawPopups(g: CanvasRenderingContext2D) {
    for (const p of this.popups) {
      if (p.t > 0.8) continue;
      const k = p.t / 0.8;
      const s = p.big ? 54 : 40;
      g.globalAlpha = 1 - k * k;
      this.label(g, p.text, p.x, p.y - k * 40, p.color, s * (1 + (1 - Math.min(1, p.t * 8)) * 0.5));
      g.globalAlpha = 1;
    }
  }

  /** Taunt as a cinematic subtitle: opponent portrait plus the line, above the bottom letterbox. */
  private bubble(g: CanvasRenderingContext2D, text: string) {
    g.font = `800 26px "Arial Black", Impact, sans-serif`;
    const w = Math.min(900, g.measureText(text).width + 60);
    const x = W / 2 - w / 2 + 50, y = H - 160;
    g.fillStyle = "rgba(255,255,255,0.95)";
    g.beginPath();
    g.roundRect(x, y, w, 60, 14);
    g.fill();
    g.fillStyle = "#111";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, x + w / 2 + 20, y + 31, w - 70);
    const p = img(`opp-${this.level.artKey}`);
    const cx = x - 10, cy = y + 30, r = 56;
    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.clip();
    if (p) g.drawImage(p, cx - r, cy - r, r * 2, r * 2);
    else {
      g.fillStyle = this.level.opponent.color;
      g.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    g.restore();
    g.strokeStyle = this.level.opponent.color || "#ff3df2";
    g.lineWidth = 5;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
    this.label(g, this.level.opponent.name.toUpperCase(), x + 70, y - 14, this.level.opponent.color || "#ff3df2", 20);
  }

  private hud(g: CanvasRenderingContext2D, pulse: number) {
    // Tug of war aura meter.
    const bw = 820, bx = (W - bw) / 2, by = 30, bh = 26;
    const mid = bx + bw / 2 + (this.meter * bw) / 2;
    g.fillStyle = "rgba(0,0,0,0.6)";
    g.fillRect(bx - 6, by - 6, bw + 12, bh + 12);
    g.fillStyle = "#35e0ff";
    g.fillRect(bx, by, mid - bx, bh);
    g.fillStyle = "#ff3df2";
    g.fillRect(mid, by, bx + bw - mid, bh);
    g.fillStyle = "#fff";
    g.fillRect(mid - 3, by - 8 - pulse * 4, 6, bh + 16 + pulse * 8);
    this.label(g, "YOU", bx - 50, by + 13, "#35e0ff", 22);
    this.label(g, this.level.opponent.name.toUpperCase(), bx + bw + 10, by + 50, "#ff3df2", 18);
    g.textAlign = "left";
    this.label(g, `AURA ${Math.round(((this.meter + 1) / 2) * 100)}%`, bx + 70, by + 50, "#fff", 18);
    // Score and combo.
    this.label(g, String(this.score).padStart(7, "0"), W - 110, H - 40, "#fff", 28);
    if (this.combo >= 2) {
      const m = comboMultiplier(this.combo);
      this.label(g, `${this.combo}x COMBO${m > 1 ? `  x${m}` : ""}`, 150, H - 40, m > 1 ? "#fff36b" : "#fff", 26 + pulse * 4);
    }
  }

  private countIn(g: CanvasRenderingContext2D, now: number) {
    const n = Math.ceil(-now / this.music.spb);
    if (n > 4) return;
    this.label(g, n === 1 ? "FIGHT!" : String(n - 1), W / 2, H / 2 - 40, n === 1 ? "#fff36b" : "#fff", 110);
    this.label(g, this.level.place.toUpperCase(), W / 2, H - 110, "#35e0ff", 26);
  }

  private titleCard(g: CanvasRenderingContext2D) {
    const win = this.stats!.win;
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.fillRect(0, 0, W, H);
    this.label(g, win ? "AURA SECURED" : "YOU HAVE BEEN HUMBLED", W / 2, H / 2 - 30, win ? "#fff36b" : "#ff4d6d", win ? 96 : 72);
    if (win) this.label(g, `TITLE UNLOCKED: ${this.level.title.toUpperCase()}`, W / 2, H / 2 + 50, "#35e0ff", 32);
  }
}

export type { QteEvent };
