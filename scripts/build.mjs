// Bundles v1 (src/main.ts, the 2D canvas game) and v2 (src/v2/main.ts, the 3D game) with esbuild.
// --dev serves public/ with watch (v1 at /, v2 at /v2/), default writes dist/ for itch.io and Pages.
// Shared media (music, models) is copied from assets/ into public/ so both builds read ../music and ../models.
import * as esbuild from "esbuild";
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, readFileSync } from "node:fs";

const dev = process.argv.includes("--dev");
const common = { bundle: true, format: "iife", target: "es2020", sourcemap: dev, minify: !dev, logLevel: "info" };
const generated = (p) => /\/(game\.js|game\.js\.map)$/.test(p);

function syncMedia() {
  mkdirSync("public/music", { recursive: true });
  for (const f of readdirSync("assets/music")) if (f.endsWith(".mp3")) cpSync(`assets/music/${f}`, `public/music/${f}`);
  if (existsSync("assets/3d")) {
    // Ship only the characters the stage picks (the preferred one per role, no crowd models): keeps the build light.
    const skip = new Set();
    try {
      const m = JSON.parse(readFileSync("assets/3d/manifest.json", "utf8"));
      for (const c of m.characters ?? []) {
        const rivals = m.characters.filter((o) => o.role === c.role);
        const picked = rivals.find((o) => o.preferred) ?? rivals[0];
        if (c.role === "crowd" || c !== picked) skip.add(`assets/3d/${c.file}`);
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
  rmSync("dist", { recursive: true, force: true });
  mkdirSync("dist");
  cpSync("public", "dist", { recursive: true, filter: (p) => !generated(p) });
  await esbuild.build({ ...common, entryPoints: ["src/main.ts"], outfile: "dist/game.js" });
  if (existsSync("src/v2/main.ts")) await esbuild.build({ ...common, entryPoints: ["src/v2/main.ts"], outfile: "dist/v2/game.js" });
}
