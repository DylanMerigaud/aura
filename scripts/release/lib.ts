// Shared helpers for the release scripts: the PASS/FAIL table, file walking, text detection and the key patterns.
import { spawnSync, type SpawnSyncOptions } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export type Status = "PASS" | "FAIL" | "WARN" | "INFO";
export interface Row {
  check: string;
  status: Status;
  detail: string;
}

export const pass = (check: string, detail = ""): Row => ({ check, status: "PASS", detail });
export const fail = (check: string, detail: string): Row => ({ check, status: "FAIL", detail });
export const row = (check: string, ok: boolean, okDetail: string, failDetail: string): Row =>
  ok ? pass(check, okDetail) : fail(check, failDetail);

/** First items of a list, with a count of the rest, so one table cell stays readable. */
export function sample(items: string[], max = 5): string {
  if (items.length <= max) return items.join("; ");
  return `${items.slice(0, max).join("; ")}; (+${items.length - max} more)`;
}

export function printTable(title: string, rows: Row[]): void {
  const w = Math.max(5, ...rows.map((r) => r.check.length));
  console.log(`\n${title}\n`);
  console.log(`${"STATUS".padEnd(6)}  ${"CHECK".padEnd(w)}  DETAIL`);
  console.log(`${"-".repeat(6)}  ${"-".repeat(w)}  ${"-".repeat(40)}`);
  for (const r of rows) console.log(`${r.status.padEnd(6)}  ${r.check.padEnd(w)}  ${r.detail}`);
  const fails = rows.filter((r) => r.status === "FAIL").length;
  console.log(`\n${fails === 0 ? "ALL PASS" : `${fails} FAIL`} (${rows.length} checks)`);
}

/** Every regular file under dir, as sorted posix paths relative to dir. */
export function walk(dir: string, base = dir): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, base));
    else if (e.isFile()) out.push(relative(base, p).split(sep).join("/"));
  }
  return out.sort();
}

const TEXT_EXT = /\.(html?|css|m?js|json|jsonl|txt|md|svg|xml|webmanifest|map|ts|mjs|sh|py|ya?ml|toml|gitignore)$/i;

/** Text if the extension says so, else if the first 8 KB hold no NUL byte. */
export function isText(path: string, buf: Buffer): boolean {
  return TEXT_EXT.test(path) || !buf.subarray(0, 8000).includes(0);
}

export function readBuf(path: string): Buffer | null {
  try {
    return readFileSync(path);
  } catch {
    return null;
  }
}

// Key shapes. AQ. and AIza are anchored on the key body that follows them, because the bare prefixes also occur
// as minified identifiers (`AQ.x`), inside words ("FAQ.") and by chance in binary media. x-api-key and "Bearer "
// stay literal: either one in shipped browser code means a credential is sent from the page.
export const KEY_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "AQ.", re: /(?<![A-Za-z0-9])AQ\.[A-Za-z0-9_-]{20,}/ },
  { name: "AIza", re: /AIza[0-9A-Za-z_-]{20,}/ },
  { name: "x-api-key", re: /x-api-key/i },
  { name: "Bearer ", re: /Bearer / },
];
export const HISTORY_KEY_PATTERNS = KEY_PATTERNS.filter((p) => p.name === "AQ." || p.name === "AIza");

export function sh(cmd: string, args: string[], opts: SpawnSyncOptions = {}): { code: number; out: string; err: string } {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 512 * 1024 * 1024, ...opts });
  return { code: r.status ?? 1, out: String(r.stdout ?? ""), err: String(r.stderr ?? r.error ?? "") };
}

export function human(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
