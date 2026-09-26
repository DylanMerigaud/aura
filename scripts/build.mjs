// Bundles v1 (src/main.ts, the 2D canvas game) and v2 (src/v2/main.ts, the 3D game) with esbuild.
// --dev serves public/ with watch (v1 at /, v2 at /v2/), default writes dist/ for itch.io and Pages (v2 at /, v1 at /v1/).
// Shared media (music, models) is copied from assets/ into public/ so both builds read ../music and ../models.
import * as esbuild from "esbuild";
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const dev = process.argv.includes("--dev");
const common = { bundle: true, format: "iife", target: "es2020", sourcemap: dev, minify: !dev, logLevel: "info" };
const generated = (p) => /\/(game\.js|game\.js\.map)$/.test(p);

function syncMedia() {
  mkdirSync("public/music", { recursive: true });
  for (const f of readdirSync("assets/music")) if (f.endsWith(".mp3")) cpSync(`assets/music/${f}`, `public/music/${f}`);
  if (existsSync("assets/3d")) {
    // Ship only the characters the stage picks (the preferred one per role, no crowd models): keeps the build light.
    const skip = new Set();
    // The loadout's fighter pool ships too: the player may pick any of them (src/loadout/state.ts).
    const pool = new Set([...readFileSync("src/loadout/state.ts", "utf8").matchAll(/file: "([^"]+)"/g)].map((m) => `assets/3d/${m[1]}`));
    try {
      const m = JSON.parse(readFileSync("assets/3d/manifest.json", "utf8"));
      for (const c of m.characters ?? []) {
        const rivals = m.characters.filter((o) => o.role === c.role);
        const picked = rivals.find((o) => o.preferred) ?? rivals[0];
        if ((c.role === "crowd" || c !== picked) && !pool.has(`assets/3d/${c.file}`)) skip.add(`assets/3d/${c.file}`);
      }
    } catch { /* no manifest: copy everything */ }
    rmSync("public/models", { recursive: true, force: true });
    cpSync("assets/3d", "public/models", { recursive: true, filter: (p) => !p.endsWith(".fbx") && !skip.has(p) });
  }
}
syncMedia();

if (dev) {
  const v1 = await esbuild.context({ ...common, entryPoints: ["src/main.ts"], outfile: "public/game.js" });
  const v2 = await esbuild.context({ ...common, entryPoints: ["src/v2/main.ts"], outfile: "public/v2/game.js" });
  await v1.watch();
  await v2.watch();
  const { port } = await v1.serve({ servedir: "public", port: 5173 });
  console.log(`AURA dev server on http://localhost:${port} (v2 at /v2/)`);
} else {
  // The latest build (v2, 3D) is the root of dist/, so Pages and the itch.io zip open it first. v1 (2D) moves to
  // /v1/ and reads the shared media one level up through <base href="../">. /v2/ stays as a redirect for old links.
  rmSync("dist", { recursive: true, force: true });
  mkdirSync("dist");
  cpSync("public", "dist", { recursive: true, filter: (p) => !generated(p) && !/^public\/(sfx-preview|v2|packs)(\/|$)/.test(p) && !/^public\/(index\.html|game\.css)$/.test(p) });
  const v2 = existsSync("src/v2/main.ts");
  mkdirSync("dist/v1", { recursive: true });
  cpSync("public/game.css", "dist/v1/game.css");
  const v1html = readFileSync("public/index.html", "utf8")
    .replace("<head>", '<head>\n<base href="../">')
    .replace('href="game.css"', 'href="v1/game.css"')
    .replace('src="game.js"', 'src="v1/game.js"');
  writeFileSync(v2 ? "dist/v1/index.html" : "dist/index.html", v1html);
  await esbuild.build({ ...common, entryPoints: ["src/main.ts"], outfile: "dist/v1/game.js" });
  if (v2) {
    cpSync("public/v2/v2.css", "dist/v2.css");
    writeFileSync("dist/index.html", readFileSync("public/v2/index.html", "utf8").replaceAll('"../', '"'));
    await esbuild.build({ ...common, entryPoints: ["src/v2/main.ts"], outfile: "dist/game.js" });
    mkdirSync("dist/v2", { recursive: true });
    writeFileSync(
      "dist/v2/index.html",
      '<!doctype html><meta charset="utf-8"><title>AURA</title><script>location.replace("../" + location.search + location.hash)</script><a href="../">AURA</a>\n',
    );
  }
}
