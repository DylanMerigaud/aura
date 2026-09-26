// Validates a generated Level against the beat grid and content rules for the QTE script.
import type { Dir, Level, QteEvent } from "./types.js";

// Built from code points, not a literal escape, to keep this source file itself free of the characters it rejects.
const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]");
const VALID_DIRS: readonly Dir[] = ["up", "down", "left", "right"];

/** The [start, end] beat range an event occupies, or null if its shape is not valid enough to compute one. */
function occupation(event: QteEvent): [number, number] | null {
  if (!Number.isInteger(event.beat)) return null;
  switch (event.type) {
    case "hit":
      return [event.beat, event.beat];
    case "mash":
    case "hold":
      if (!Number.isInteger(event.length)) return null;
      return [event.beat, event.beat + event.length];
    case "combo":
      if (!Array.isArray(event.dirs) || event.dirs.length === 0) return null;
      return [event.beat - event.dirs.length + 1, event.beat];
    default:
      return null;
  }
}

function collectStrings(level: Level): { path: string; value: string }[] {
  const out: { path: string; value: string }[] = [];
  out.push({ path: "title", value: level.title });
  out.push({ path: "place", value: level.place });
  if (Array.isArray(level.story)) {
    level.story.forEach((s, i) => out.push({ path: `story[${i}]`, value: s }));
  }
  if (level.opponent) {
    out.push({ path: "opponent.name", value: level.opponent.name });
    out.push({ path: "opponent.persona", value: level.opponent.persona });
  }
  if (Array.isArray(level.taunts)) {
    level.taunts.forEach((t, i) => out.push({ path: `taunts[${i}].text`, value: t.text }));
  }
  if (level.announcer) {
    out.push({ path: "announcer.intro", value: level.announcer.intro });
    out.push({ path: "announcer.win", value: level.announcer.win });
    out.push({ path: "announcer.lose", value: level.announcer.lose });
  }
  return out;
}

/** Returns a list of human readable error strings. An empty array means the level is valid. */
export function validateLevel(level: Level): string[] {
  const errors: string[] = [];
  const lo = 8;
  const hi = level.lengthBeats - 4;

  for (const { path, value } of collectStrings(level)) {
    if (typeof value === "string" && DASH_RE.test(value)) {
      errors.push(`dash character found in ${path}: "${value}"`);
    }
  }

  for (let i = 0; i < (level.taunts?.length ?? 0); i++) {
    const t = level.taunts[i];
    if (!Number.isInteger(t.beat)) {
      errors.push(`taunts[${i}] beat ${t.beat} is not an integer`);
    } else if (t.beat < 0 || t.beat > level.lengthBeats) {
      errors.push(`taunts[${i}] beat ${t.beat} is outside the song (0..${level.lengthBeats})`);
    }
  }

  const events = level.events ?? [];
  const beatSeen = new Set<number>();

  for (let i = 0; i < events.length; i++) {
    const e = events[i];

    if (!Number.isInteger(e.beat)) {
      errors.push(`events[${i}] beat ${e.beat} is not an integer`);
    } else if (beatSeen.has(e.beat)) {
      errors.push(`events[${i}] beat ${e.beat} collides with another event on the same beat`);
    } else {
      beatSeen.add(e.beat);
    }

    if (e.type === "hit") {
      if (!VALID_DIRS.includes(e.dir)) {
        errors.push(`events[${i}] hit at beat ${e.beat} has invalid dir "${e.dir}"`);
      }
    } else if (e.type === "mash") {
      if (!Number.isInteger(e.length) || e.length < 3 || e.length > 8) {
        errors.push(`events[${i}] mash at beat ${e.beat} has invalid length ${e.length} (must be 3..8)`);
      }
    } else if (e.type === "hold") {
      if (!Number.isInteger(e.length) || e.length < 1 || e.length > 4) {
        errors.push(`events[${i}] hold at beat ${e.beat} has invalid length ${e.length} (must be 1..4)`);
      }
    } else if (e.type === "combo") {
      if (!Array.isArray(e.dirs) || e.dirs.length < 3 || e.dirs.length > 4) {
        errors.push(`events[${i}] combo at beat ${e.beat} has invalid dirs length ${e.dirs?.length} (must be 3..4)`);
      } else {
        for (const d of e.dirs) {
          if (!VALID_DIRS.includes(d)) {
            errors.push(`events[${i}] combo at beat ${e.beat} has invalid dir "${d}"`);
          }
        }
      }
    } else {
      errors.push(`events[${i}] has unknown type "${(e as QteEvent).type}"`);
    }

    const occ = occupation(e);
    if (occ) {
      const [start, end] = occ;
      if (start < lo) {
        errors.push(`events[${i}] (${e.type} at beat ${e.beat}) starts at ${start}, before the minimum beat ${lo}`);
      }
      if (end > hi) {
        errors.push(`events[${i}] (${e.type} at beat ${e.beat}) ends at ${end}, after the maximum beat ${hi}`);
      }
    }
  }

  for (let i = 1; i < events.length; i++) {
    if (events[i].beat < events[i - 1].beat) {
      errors.push(
        `events[${i}] beat ${events[i].beat} is out of order after events[${i - 1}] beat ${events[i - 1].beat}`
      );
    }
  }

  const sorted = [...events].sort((a, b) => a.beat - b.beat);
  for (let i = 1; i < sorted.length; i++) {
    const prevOcc = occupation(sorted[i - 1]);
    const curOcc = occupation(sorted[i]);
    if (prevOcc && curOcc && curOcc[0] <= prevOcc[1]) {
      errors.push(
        `events overlap: ${sorted[i - 1].type} at beat ${sorted[i - 1].beat} (ends ${prevOcc[1]}) collides with ${sorted[i].type} at beat ${sorted[i].beat} (starts ${curOcc[0]})`
      );
    }
  }

  return errors;
}
