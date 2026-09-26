// The single voice queue (addendum 17:05 point 5): one line at a time on the audio clock, never one
// starting over another. Pure scheduling: the caller asks with the line's duration and earliest start,
// the queue answers when it plays (or that it is dropped) and which not yet started lines it bumped.
//
// Rules:
// - Priority: call (the announcer's one word calls) > line (intro, win, lose, the live roast) > taunt.
// - A line never starts while another is sounding: it is scheduled after the last booked line ends.
// - Nothing that already started is cut. A booked line that has not started yet is bumped (cancelled)
//   by a higher priority request, which takes its place.
// - A taunt is dropped while a call is sounding or booked.
// - A line that would wait longer than its maxWait is dropped (a late call or taunt means nothing).

export type VoiceKind = "call" | "line" | "taunt";

export const PRIORITY: Record<VoiceKind, number> = { call: 3, line: 2, taunt: 1 };

/** Default longest wait (seconds) before a request is pointless and dropped. */
export const MAX_WAIT: Record<VoiceKind, number> = { call: 0.5, line: 4, taunt: 1.5 };

export interface VoiceRequest {
  id: string;
  kind: VoiceKind;
  /** Seconds. */
  duration: number;
  /** Earliest start on the audio clock; defaults to now. */
  at?: number;
  maxWait?: number;
}

export interface Booked {
  id: string;
  kind: VoiceKind;
  start: number;
  end: number;
  /** Opaque token so the player can cancel a bumped line. */
  token: number;
}

export type Decision =
  | { play: true; start: number; token: number; bumped: Booked[] }
  | { play: false; reason: "call-playing" | "too-late" | "outranked"; bumped: Booked[] };

export class VoiceQueue {
  private booked: Booked[] = [];
  private nextToken = 1;

  /** Lines booked and not finished at `now`, in play order. */
  pending(now: number): Booked[] {
    this.booked = this.booked.filter((b) => b.end > now);
    return this.booked.slice();
  }

  request(req: VoiceRequest, now: number): Decision {
    const live = this.pending(now);
    const at = Math.max(now, req.at ?? now);
    const prio = PRIORITY[req.kind];
    if (req.kind === "taunt" && live.some((b) => b.kind === "call")) return { play: false, reason: "call-playing", bumped: [] };
    // Booked but not started and outranked: bumped, the new line takes the slot.
    const bumped = live.filter((b) => b.start > now && PRIORITY[b.kind] < prio);
    const kept = live.filter((b) => !bumped.includes(b));
    const busyUntil = kept.reduce((m, b) => Math.max(m, b.end), 0);
    const start = Math.max(at, busyUntil);
    if (start - at > (req.maxWait ?? MAX_WAIT[req.kind])) {
      // Too late: the bump is not applied either, the booked lines keep playing as planned.
      return { play: false, reason: kept.some((b) => PRIORITY[b.kind] > prio) ? "outranked" : "too-late", bumped: [] };
    }
    const token = this.nextToken++;
    this.booked = [...kept, { id: req.id, kind: req.kind, start, end: start + Math.max(0, req.duration), token }];
    return { play: true, start, token, bumped };
  }

  /** Forget every booked line (a quit); returns them so the player can stop their sources. */
  clear(): Booked[] {
    const all = this.booked;
    this.booked = [];
    return all;
  }
}

/** The voice/v2/index.json key of an announcer call: "six! seven!" is "call-six-seven". */
export function callKey(text: string): string {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `call-${slug}`;
}
