// The review board: one HTML page listing every generated sample (samples/<kind>/...) and the SFX previews
// (public/sfx-preview/), each with a player, next to its SAMPLE.md and BOARD.md notes. Written to
// samples/index.html with paths relative to the repo root's samples/ folder.
//
//   tsx scripts/gen-board.ts
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const AUDIO = /\.(mp3|wav|ogg|m4a)$/i;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const sections: string[] = [];
const kinds = existsSync("samples") ? readdirSync("samples").filter((k) => statSync(join("samples", k)).isDirectory()).sort() : [];
for (const kind of kinds) {
  const files = walk(join("samples", kind));
  const notes = files.filter((f) => /(SAMPLE|BOARD)\.md$/.test(f));
  const audio = files.filter((f) => AUDIO.test(f));
  if (!audio.length && !notes.length) continue;
  const rows = audio
    .map((f) => {
      const rel = relative("samples", f);
      return `<li><span>${esc(rel.slice(kind.length + 1))}</span><audio controls preload="none" src="${esc(rel)}"></audio></li>`;
    })
    .join("\n");
  const md = notes.map((f) => `<details><summary>${esc(relative("samples", f))}</summary><pre>${esc(readFileSync(f, "utf8"))}</pre></details>`).join("\n");
  sections.push(`<section><h2>${esc(kind)}</h2>${md}<ul>${rows}</ul></section>`);
}
const sfx = walk("public/sfx-preview").filter((f) => AUDIO.test(f));
if (sfx.length) {
  const rows = sfx.map((f) => `<li><span>${esc(f.split("/").pop()!)}</span><audio controls preload="none" src="../${esc(f)}"></audio></li>`).join("\n");
  sections.push(`<section><h2>sfx (public/sfx-preview)</h2><ul>${rows}</ul></section>`);
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AURA review board</title>
<style>
body{margin:0;padding:16px;font:15px/1.4 system-ui,sans-serif;background:#0d0b14;color:#f2eefa}
h1{font-size:22px;margin:0 0 12px}h2{font-size:18px;margin:24px 0 8px;color:#ffd84a}
ul{list-style:none;padding:0;margin:0}li{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid #2a2438}
li span{flex:1 1 180px;word-break:break-all}audio{width:min(100%,320px);height:36px}
pre{white-space:pre-wrap;background:#1a1626;padding:10px;border-radius:6px;font-size:12px;overflow-x:auto}
summary{cursor:pointer;color:#9fd3ff}
</style></head><body>
<h1>AURA review board</h1>
<p>Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC by scripts/gen-board.ts. Listen, then say which file wins.</p>
${sections.join("\n") || "<p>No samples yet.</p>"}
</body></html>
`;
writeFileSync("samples/index.html", html);
console.log(`samples/index.html: ${sections.length} section(s)`);
