import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { CHARACTER_POOL, LOADOUT_KEY, getLoadout, setLoadout, type KV } from "../../src/loadout/state";

const mem = (): KV & { m: Map<string, string> } => {
  const m = new Map<string, string>();
  return { m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
};

describe("loadout state", () => {
  it("every pool character exists on disk", () => {
    for (const c of CHARACTER_POOL) expect(existsSync(`assets/3d/${c.file}`), c.file).toBe(true);
  });
  it("saves and reads back, and drops an unknown character", () => {
    const kv = mem();
    expect(getLoadout(kv)).toEqual({ character: undefined, emote: undefined });
    setLoadout({ character: CHARACTER_POOL[2].file }, kv);
    setLoadout({ emote: "siuuu" }, kv);
    expect(getLoadout(kv)).toEqual({ character: CHARACTER_POOL[2].file, emote: "siuuu" });
    kv.m.set(LOADOUT_KEY, JSON.stringify({ character: "characters/nope.glb" }));
    expect(getLoadout(kv).character).toBeUndefined();
    kv.m.set(LOADOUT_KEY, "{broken");
    expect(() => getLoadout(kv)).not.toThrow();
  });
});
