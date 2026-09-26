// Bundles src/main.ts with esbuild: --dev serves public/ with watch, default writes dist/ for itch.io and Pages.
import * as esbuild from "esbuild";
import { cpSync, rmSync, mkdirSync } from "node:fs";

const dev = process.argv.includes("--dev");
const common = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  target: "es2020",
  sourcemap: dev,
  minify: !dev,
  logLevel: "info",
};

if (dev) {
  const ctx = await esbuild.context({ ...common, outfile: "public/game.js" });
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: "public", port: 5173 });
  console.log(`AURA dev server on http://localhost:${port}`);
} else {
  rmSync("dist", { recursive: true, force: true });
  mkdirSync("dist");
  cpSync("public", "dist", { recursive: true, filter: (p) => !p.endsWith("game.js") && !p.endsWith("game.js.map") });
  await esbuild.build({ ...common, outfile: "dist/game.js" });
}
