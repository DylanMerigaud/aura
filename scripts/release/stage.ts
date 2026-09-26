// Builds the game and stages a copy of dist/ that works from any folder or iframe: itch.io serves the game inside
// an iframe on its own origin and GitHub Pages serves it under /aura/, so a root-absolute URL ("/music/x.mp3")
// breaks on both. The copy in .cache/release/web gets those URLs rewritten to relative ones, then the checks that
// matter for any public static host run on the staged files. build-itch.ts zips this folder, deploy-pages.sh
// publishes it, so both targets ship the same bytes.
//
//   tsx scripts/release/stage.ts [--skip-build]     prints the checklist, exits 1 on a FAIL
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, posix, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { KEY_PATTERNS, ROOT, fail, isText, pass, printTable, row, sample, sh, walk, type Row } from "./lib.ts";

export const DIST = join(ROOT, "dist");
export const STAGE = join(ROOT, ".cache/release/web");

const REWRITABLE = /\.(html?|css|m?js)$/i;
// A quote, then a single slash (not "//" and not "/*"), then a first path segment. Only rewritten when that segment
// is a real top-level entry of the build, so regex sources and strings like "/g" are left alone.
const QUOTED_ABS = /(["'`])\/(?![/*])([A-Za-z0-9_.@-]+)(?=[/"'`?#$])/g;
const CSS_URL_ABS = /(url\(\s*["']?)\/(?![/*])([A-Za-z0-9_.@-]+)(?=[/"')?#])/g;
// Any root-absolute reference left in HTML or CSS after the rewrite, existing target or not.
const HTML_CSS_ABS_LEFT = /(?:\b(?:src|href|poster|data|action)\s*=\s*["']|url\(\s*["']?)\/(?![/*])[^"')\s>]*/gi;
const LOCALHOST = /localhost|127\.0\.0\.1/g;
// Hard requirements for cross origin isolation, which an itch.io iframe cannot give without its opt-in checkbox.
const COI_REQUIRED = /new SharedArrayBuffer\s*\(|Cross-Origin-(?:Embedder|Opener)-Policy|coi-serviceworker/g;
const COI_MENTION = /SharedArrayBuffer|crossOriginIsolated|Atomics\.wait\b/g;
const ASSET_REF =
  /["'`(]((?:\.\.?\/)*[A-Za-z0-9_@-][A-Za-z0-9_./@-]*\.(?:png|jpe?g|webp|gif|svg|ico|mp3|ogg|wav|opus|m4a|glb|gltf|bin|fbx|json|css|js|woff2?|ttf|otf|html|txt))["'`)?#]/gi;
const HOST = /https?:\/\/([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g;

function snippet(text: string, index: number): string {
  return text.slice(Math.max(0, index - 30), index + 40).replace(/\s+/g, " ");
}

/** Rewrites root-absolute asset URLs to relative ones, in place, inside the staged folder. */
function rewriteAbsoluteUrls(stage: string, files: string[]): string[] {
  const top = new Set(readdirSync(stage));
  const changes: string[] = [];
  for (const f of files) {
    if (!REWRITABLE.test(f)) continue;
    const abs = join(stage, f);
    const src = readFileSync(abs, "utf8");
    // HTML and CSS resolve against their own folder; a script resolves against the page that loads it, which is
    // the index.html next to it in this build (dist/game.js and dist/v2/game.js).
    const prefix = "../".repeat(f.split("/").length - 1);
    const fix = (m: string, lead: string, seg: string): string => {
      if (!top.has(seg)) return m;
      changes.push(`${f}: ${lead}/${seg} -> ${lead}${prefix}${seg}`);
      return `${lead}${prefix}${seg}`;
    };
    const out = src.replace(QUOTED_ABS, fix).replace(CSS_URL_ABS, fix);
    if (out !== src) writeFileSync(abs, out);
  }
  return changes;
}

export interface Staged {
  rows: Row[];
  stage: string;
  files: string[];
  ok: boolean;
}

export function stageWebBuild(opts: { skipBuild?: boolean } = {}): Staged {
  const rows: Row[] = [];
  const done = (): Staged => ({ rows, stage: STAGE, files: existsSync(STAGE) ? walk(STAGE) : [], ok: !rows.some((r) => r.status === "FAIL") });

  if (opts.skipBuild) {
    rows.push(row("production build", existsSync(DIST), "skipped (--skip-build), using the existing dist/", "--skip-build given but dist/ does not exist"));
  } else {
    console.log("> pnpm build");
    const b = sh("pnpm", ["build"], { stdio: "inherit" });
    rows.push(row("production build", b.code === 0, "pnpm build exit 0", `pnpm build exit ${b.code}`));
  }
  if (rows.some((r) => r.status === "FAIL")) return done();

  rows.push(row("dist/index.html at the root", existsSync(join(DIST, "index.html")), "dist/index.html", "dist/index.html is missing"));
  if (rows.some((r) => r.status === "FAIL")) return done();

  rmSync(STAGE, { recursive: true, force: true });
  cpSync(DIST, STAGE, { recursive: true, dereference: true, filter: (p) => !/(^|[/\\])(\.DS_Store|Thumbs\.db)$/.test(p) });
  const files = walk(STAGE);

  const changes = rewriteAbsoluteUrls(STAGE, files);
  for (const c of changes) console.log(`rewrote ${c}`);
  const top = new Set(readdirSync(STAGE));
  const left: string[] = [];
  const localhost: string[] = [];
  const coiRequired: string[] = [];
  const coiMention: string[] = [];
  const keys: string[] = [];
  const caseMismatch: string[] = [];
  const hosts = new Map<string, Set<string>>();
  const exact = new Set(files);
  const lower = new Map(files.map((f) => [f.toLowerCase(), f]));

  for (const f of files) {
    const buf = readFileSync(join(STAGE, f));
    const text = isText(f, buf);
    const s = text ? buf.toString("utf8") : buf.toString("latin1");
    for (const { name, re } of KEY_PATTERNS) {
      const m = re.exec(s);
      if (m) keys.push(`${f}: "${name}" at byte ${m.index}`);
    }
    if (!text) continue;
    for (const m of s.matchAll(LOCALHOST)) localhost.push(`${f}: ...${snippet(s, m.index ?? 0)}...`);
    for (const m of s.matchAll(COI_REQUIRED)) coiRequired.push(`${f}: ${m[0]}`);
    for (const m of s.matchAll(COI_MENTION)) coiMention.push(`${f}: ${m[0]}`);
    for (const m of s.matchAll(HOST)) {
      const h = m[1].toLowerCase();
      if (h === "www.w3.org") continue; // XML namespace URIs, never fetched
      if (!hosts.has(h)) hosts.set(h, new Set());
      hosts.get(h)?.add(f);
    }
    if (REWRITABLE.test(f)) {
      if (/\.(html?|css)$/i.test(f)) for (const m of s.matchAll(HTML_CSS_ABS_LEFT)) left.push(`${f}: ${m[0]}`);
      for (const m of s.matchAll(QUOTED_ABS)) if (top.has(m[2])) left.push(`${f}: ${m[0]}`);
    }
    // itch.io serves files case sensitively: a reference that only matches a file with another case works on a
    // Mac and answers 403 once uploaded.
    const dir = posix.dirname(f);
    for (const m of s.matchAll(ASSET_REF)) {
      const ref = m[1];
      const candidates = [posix.normalize(posix.join(dir, ref)), posix.normalize(ref)];
      if (candidates.some((c) => exact.has(c))) continue;
      const wrong = candidates.find((c) => lower.has(c.toLowerCase()));
      if (wrong) caseMismatch.push(`${f}: "${ref}" but the file is ${lower.get(wrong.toLowerCase())}`);
    }
  }

  rows.push(
    row(
      "relative asset URLs",
      left.length === 0,
      `${changes.length} root-absolute URL(s) rewritten, none left`,
      `root-absolute URL(s) still present: ${sample(left)}`,
    ),
  );
  rows.push(row("no localhost reference", localhost.length === 0, "no localhost or 127.0.0.1", sample(localhost)));
  if (coiRequired.length) rows.push(fail("no cross origin isolation", `required by: ${sample(coiRequired)}`));
  else if (coiMention.length) rows.push({ check: "no cross origin isolation", status: "WARN", detail: `mentioned, not required: ${sample(coiMention)}` });
  else rows.push(pass("no cross origin isolation", "no SharedArrayBuffer, no COOP/COEP"));
  rows.push(row("file name case", caseMismatch.length === 0, "every resolvable reference matches the file's case", sample(caseMismatch)));
  rows.push(
    row(
      "no key pattern in the build",
      keys.length === 0,
      `${files.length} files scanned for ${KEY_PATTERNS.map((p) => p.name).join(", ")}`,
      sample(keys),
    ),
  );
  const hostList = [...hosts.entries()].map(([h, fs]) => `${h} (${[...fs].join(", ")})`);
  rows.push({ check: "hosts named in the build", status: "INFO", detail: hostList.length ? sample(hostList, 8) : "none" });
  return done();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const staged = stageWebBuild({ skipBuild: process.argv.includes("--skip-build") });
  printTable(`Web build staged in ${relative(ROOT, staged.stage)}`, staged.rows);
  process.exit(staged.ok ? 0 : 1);
}
