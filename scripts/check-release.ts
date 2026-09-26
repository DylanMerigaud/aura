// The pre submission checklist, run from the repo root: README sections, docs/apis.md coverage, no en or em dash in
// tracked text, no key in the git history, .gitignore coverage, the MIT LICENSE, and a first commit dated today.
// Read only: it fixes nothing, it prints a table and exits 1 on a FAIL.
//
//   tsx scripts/check-release.ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { HISTORY_KEY_PATTERNS, ROOT, fail, isText, printTable, readBuf, row, sample, sh, type Row } from "./release/lib.ts";

const rows: Row[] = [];
const read = (p: string): string | null => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : null);
const tracked = sh("git", ["ls-files", "-z"]).out.split("\0").filter(Boolean);

// 1. README sections: a heading that contains the name, any case ("## Assets and credits" counts for Credits).
const README_SECTIONS = ["How to play", "Partner technologies", "Architecture", "Build and deploy", "Credits"];
const readme = read("README.md");
const headings = (readme ?? "").split("\n").flatMap((l) => {
  const m = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(l);
  return m ? [m[1]] : [];
});
for (const s of README_SECTIONS) {
  const h = headings.find((x) => x.toLowerCase().includes(s.toLowerCase()));
  rows.push(row(`README: ${s}`, !!h, `"${h}"`, readme === null ? "README.md is missing" : "no heading with this name"));
}

// 2. docs/apis.md covers every package.json dependency and every external host the shipped code names.
const apis = read("docs/apis.md");
rows.push(row("docs/apis.md exists", apis !== null, "docs/apis.md", "docs/apis.md is missing"));
const apisLower = (apis ?? "").toLowerCase();
const pkg = JSON.parse(read("package.json") ?? "{}") as Record<string, Record<string, string> | undefined>;
const deps = [
  ...new Set(["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"].flatMap((k) => Object.keys(pkg[k] ?? {}))),
].sort();
const missingDeps = deps.filter((d) => !apisLower.includes(d.toLowerCase()));
rows.push(
  row("apis.md lists every dependency", missingDeps.length === 0, `${deps.length} of ${deps.length} named`, `missing ${missingDeps.length} of ${deps.length}: ${missingDeps.join(", ")}`),
);

// Hosts from src/ and public/ (the pages load fonts from there too). Comment lines are skipped, the project's own
// GitHub Pages host is not an external API.
const origin = sh("git", ["remote", "get-url", "origin"]).out.trim();
const owner = /github\.com[:/]([^/]+)\//.exec(origin)?.[1]?.toLowerCase();
const ownHosts = new Set(owner ? [`${owner}.github.io`] : []);
const hosts = new Map<string, string>();
for (const f of tracked.filter((f) => /^(src|public)\//.test(f))) {
  const buf = readBuf(join(ROOT, f));
  if (!buf || !isText(f, buf)) continue;
  for (const line of buf.toString("utf8").split("\n")) {
    if (/^\s*(\/\/|\*|\/\*|<!--)/.test(line)) continue;
    for (const m of line.matchAll(/https:\/\/([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g)) {
      const h = m[1].toLowerCase();
      if (!ownHosts.has(h) && !hosts.has(h)) hosts.set(h, f);
    }
  }
}
const missingHosts = [...hosts.entries()].filter(([h]) => !apisLower.includes(h)).map(([h, f]) => `${h} (${f})`);
rows.push(
  row(
    "apis.md lists every external host",
    missingHosts.length === 0,
    hosts.size ? `${hosts.size} host(s) named: ${[...hosts.keys()].join(", ")}` : "no external https host in src/ or public/",
    `missing: ${missingHosts.join(", ")}`,
  ),
);

// 3. No en dash (U+2013) or em dash (U+2014) in any tracked text file. Built from code points so this file
// never holds the characters it looks for.
const DASH = new RegExp(`[${String.fromCodePoint(0x2013, 0x2014)}]`, "u");
const dashHits: string[] = [];
let textFiles = 0;
for (const f of tracked) {
  const buf = readBuf(join(ROOT, f));
  if (!buf || !isText(f, buf)) continue;
  textFiles++;
  buf
    .toString("utf8")
    .split("\n")
    .forEach((l, i) => {
      if (DASH.test(l)) dashHits.push(`${f}:${i + 1}`);
    });
}
rows.push(row("no en or em dash", dashHits.length === 0, `${textFiles} tracked text files clean`, `${dashHits.length} line(s): ${sample(dashHits, 8)}`));

// 4. No Gemini key shape anywhere in the history of every branch (binary files show as "Binary files differ").
const log = sh("git", ["log", "-p", "--all", "--no-color", "--no-ext-diff", "--no-textconv", "--format=commit %h"]);
const keyHits: string[] = [];
let commit = "";
let file = "";
for (const line of log.out.split("\n")) {
  if (line.startsWith("commit ")) commit = line.slice(7);
  else if (line.startsWith("+++ b/") || line.startsWith("--- a/")) file = line.slice(6);
  else for (const { name, re } of HISTORY_KEY_PATTERNS) if (re.test(line)) keyHits.push(`${commit} ${file} ("${name}")`);
}
const commits = sh("git", ["rev-list", "--all", "--count"]).out.trim();
rows.push(
  log.code !== 0
    ? fail("no key in git history", `git log failed: ${log.err.trim()}`)
    : row(
        "no key in git history",
        keyHits.length === 0,
        `${commits} commits on all branches scanned for ${HISTORY_KEY_PATTERNS.map((p) => p.name).join(", ")}`,
        sample([...new Set(keyHits)]),
      ),
);

// 5. .gitignore covers what must never be committed (git check-ignore, so any pattern that covers it counts).
const IGNORED: Record<string, string> = {
  node_modules: "node_modules/x",
  dist: "dist/x",
  ".cache": ".cache/x",
  "*.log": "x.log",
  "assets/instants/": "assets/instants/x.png",
};
const ignored = (probe: string): boolean => {
  const code = sh("git", ["check-ignore", "-q", "--no-index", "--", probe]).code;
  // 128: git refuses a path beyond a symlink (a linked node_modules), so ask about the folder name itself.
  return code === 0 || (code === 128 && probe.includes("/") && ignored(probe.slice(0, probe.lastIndexOf("/"))));
};
const notIgnored = Object.entries(IGNORED)
  .filter(([, probe]) => !ignored(probe))
  .map(([n]) => n);
rows.push(row(".gitignore coverage", notIgnored.length === 0, Object.keys(IGNORED).join(", "), `not ignored: ${notIgnored.join(", ")}`));

// 6. An MIT LICENSE naming Dylan Merigaud.
const licenseFile = ["LICENSE", "LICENSE.md", "LICENSE.txt"].find((f) => existsSync(join(ROOT, f)));
const license = licenseFile ? (read(licenseFile) ?? "") : "";
rows.push(
  !licenseFile
    ? fail("LICENSE (MIT, Dylan Merigaud)", "no LICENSE file")
    : row(
        "LICENSE (MIT, Dylan Merigaud)",
        /MIT License/i.test(license) && license.includes("Dylan Merigaud"),
        `${licenseFile}: MIT, Dylan Merigaud`,
        `${licenseFile} is not an MIT license naming Dylan Merigaud`,
      ),
);

// 7. The first commit is dated today (local time): the project was started during the hackathon.
const localDay = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const roots = sh("git", ["log", "--max-parents=0", "--format=%h %at", "HEAD"]).out.trim().split("\n").filter(Boolean);
const first = roots.map((l) => l.split(" ")).sort((a, b) => Number(a[1]) - Number(b[1]))[0];
const today = localDay(new Date());
if (!first) rows.push(fail("first commit dated today", "no commit found"));
else {
  const at = new Date(Number(first[1]) * 1000);
  const when = `${localDay(at)} ${String(at.getHours()).padStart(2, "0")}:${String(at.getMinutes()).padStart(2, "0")}`;
  rows.push(row("first commit dated today", localDay(at) === today, `${first[0]} ${when} (today ${today})`, `${first[0]} ${when}, today is ${today}`));
}

printTable("Release checklist", rows);
process.exit(rows.some((r) => r.status === "FAIL") ? 1 : 0);
