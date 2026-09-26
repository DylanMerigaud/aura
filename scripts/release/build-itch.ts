// Produces aura-itch.zip for an itch.io HTML5 upload: stages the build (stage.ts: build, relative URLs, localhost,
// cross origin isolation, key and file case checks), checks the itch.io upload limits, prints the size per asset
// type, zips the staged folder with index.html at the zip root and verifies the zip it wrote.
//
//   tsx scripts/release/build-itch.ts [--skip-build]     exits 1 on a FAIL, and then writes no zip
//
// itch.io limits (https://itch.io/docs/creators/html5): 1,000 files, 500 MB extracted, 200 MB per file,
// 240 characters per path. The zip itself is also held under 1 GB.
import { existsSync, rmSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { stageWebBuild } from "./stage.ts";
import { ROOT, human, printTable, row, sample, sh, type Row } from "./lib.ts";

const MB = 1024 * 1024;
const LIMITS = { files: 1000, totalBytes: 500 * MB, fileBytes: 200 * MB, pathChars: 240, zipBytes: 1024 * MB };
const ZIP = join(ROOT, "aura-itch.zip");

const staged = stageWebBuild({ skipBuild: process.argv.includes("--skip-build") });
const rows: Row[] = [...staged.rows];

if (staged.files.length) {
  const sizes = staged.files.map((f) => ({ f, bytes: statSync(join(staged.stage, f)).size }));
  const total = sizes.reduce((a, s) => a + s.bytes, 0);
  const biggest = sizes.reduce((a, s) => (s.bytes > a.bytes ? s : a));
  const longPaths = staged.files.filter((f) => f.length > LIMITS.pathChars);

  const byType = new Map<string, { count: number; bytes: number }>();
  for (const s of sizes) {
    const t = extname(s.f).slice(1).toLowerCase() || "(none)";
    const e = byType.get(t) ?? { count: 0, bytes: 0 };
    e.count++;
    e.bytes += s.bytes;
    byType.set(t, e);
  }
  console.log("\nSize per asset type\n");
  console.log(`${"TYPE".padEnd(8)}  ${"FILES".padStart(5)}  ${"SIZE".padStart(10)}  SHARE`);
  for (const [t, e] of [...byType.entries()].sort((a, b) => b[1].bytes - a[1].bytes)) {
    console.log(`${t.padEnd(8)}  ${String(e.count).padStart(5)}  ${human(e.bytes).padStart(10)}  ${((100 * e.bytes) / total).toFixed(1)}%`);
  }
  console.log(`${"total".padEnd(8)}  ${String(sizes.length).padStart(5)}  ${human(total).padStart(10)}`);

  rows.push(row("itch: total size", total <= LIMITS.totalBytes, `${human(total)} (limit 500 MB extracted)`, `${human(total)} is over 500 MB extracted`));
  rows.push(row("itch: file count", sizes.length <= LIMITS.files, `${sizes.length} files (limit 1,000)`, `${sizes.length} files, over 1,000`));
  rows.push(
    row("itch: largest file", biggest.bytes <= LIMITS.fileBytes, `${biggest.f} ${human(biggest.bytes)} (limit 200 MB)`, `${biggest.f} is ${human(biggest.bytes)}, over 200 MB`),
  );
  rows.push(row("itch: path length", longPaths.length === 0, "every path at most 240 characters", `over 240 characters: ${sample(longPaths)}`));
}

rmSync(ZIP, { force: true }); // never leave an older zip behind to be uploaded by mistake
if (rows.some((r) => r.status === "FAIL")) {
  rows.push({ check: "aura-itch.zip", status: "FAIL", detail: "not written: fix the FAIL lines first" });
} else {
  const z = sh("zip", ["-q", "-r", "-X", ZIP, ".", "-x", "*.DS_Store"], { cwd: staged.stage });
  if (z.code !== 0 || !existsSync(ZIP)) {
    rows.push({ check: "aura-itch.zip", status: "FAIL", detail: `zip exit ${z.code}: ${z.err.trim()}` });
  } else {
    const listing = sh("unzip", ["-Z1", ZIP]).out.split("\n").filter((l) => l && !l.endsWith("/"));
    const zipBytes = statSync(ZIP).size;
    rows.push(row("zip: index.html at the root", listing.includes("index.html"), "index.html is a root entry, not inside a folder", "no root index.html entry in the zip"));
    rows.push(
      row(
        "zip: complete",
        listing.length === staged.files.length,
        `${listing.length} entries = ${staged.files.length} staged files`,
        `${listing.length} entries for ${staged.files.length} staged files`,
      ),
    );
    rows.push(row("zip: size", zipBytes <= LIMITS.zipBytes, `aura-itch.zip ${human(zipBytes)} (under 1 GB)`, `aura-itch.zip is ${human(zipBytes)}, over 1 GB`));
  }
}

printTable("itch.io release checklist", rows);
const ok = !rows.some((r) => r.status === "FAIL");
if (ok) console.log(`\nUpload ${ZIP} (docs/release.md has the itch.io field values).`);
process.exit(ok ? 0 : 1);
