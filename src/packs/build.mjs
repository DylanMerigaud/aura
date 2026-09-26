// Builds the standalone demo bundle: node src/packs/build.mjs -> public/packs/packs.js
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/packs/demo.ts"],
  outfile: "public/packs/packs.js",
  bundle: true,
  format: "iife",
  target: "es2020",
  minify: true,
  logLevel: "info",
});
