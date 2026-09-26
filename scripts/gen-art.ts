// Generates AURA level backgrounds, opponent portraits, and title art with Gemini gemini-3.1-flash-image (Nano Banana 2).

import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ART_DIR = join(ROOT, "public", "art");
const CACHE_DIR = join(ROOT, ".cache", "gen-art");

mkdirSync(ART_DIR, { recursive: true });
mkdirSync(CACHE_DIR, { recursive: true });

const STYLE_SUFFIX =
  "stylized neon night illustration, cinematic, saturated magenta cyan purple palette, " +
  "painterly anime background art, no text, no letters, no people or characters, " +
  "the center third and the lower half kept clear and darker so characters can be drawn over it, " +
  "wide establishing shot";

const PORTRAIT_SUFFIX =
  "bust portrait, stylized neon anime, smug expression, dark background, no text, no letters";

type Asset = {
  name: string;
  file: string;
  aspectRatio: "16:9" | "1:1";
  width: number;
  height: number;
  prompt: string;
};

const BACKGROUNDS: Asset[] = [
  {
    name: "metro",
    file: "metro.jpg",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    prompt:
      `Paris metro platform at 2am, empty, generic unbranded platform signage with no readable words, ` +
      `blank posters, blank station roundels with no letters inside them, ${STYLE_SUFFIX}, absolutely no writing anywhere in the scene`,
  },
  {
    name: "kebab",
    file: "kebab.jpg",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    prompt: `kebab shop at 4am, neon sign glowing, empty street outside, ${STYLE_SUFFIX}`,
  },
  {
    name: "rooftop",
    file: "rooftop.jpg",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    prompt: `Paris rooftop at night, city lights spread below, ${STYLE_SUFFIX}`,
  },
  {
    name: "club",
    file: "club.jpg",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    prompt:
      `nightclub interior, lasers and smoke, empty dance floor, unbranded signage with no readable words, ` +
      `abstract glowing shapes instead of any lettering, ${STYLE_SUFFIX}, absolutely no writing anywhere in the scene`,
  },
  {
    name: "stage",
    file: "stage.jpg",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    prompt: `huge concert stage with giant screens, final boss vibe, empty stage, ${STYLE_SUFFIX}`,
  },
];

const PORTRAITS: Asset[] = [
  {
    name: "opp-metro",
    file: "opp-metro.jpg",
    aspectRatio: "1:1",
    width: 512,
    height: 512,
    prompt: `"Kevin Shades", sunglasses, underground look, hoodie, ${PORTRAIT_SUFFIX}`,
  },
  {
    name: "opp-kebab",
    file: "opp-kebab.jpg",
    aspectRatio: "1:1",
    width: 512,
    height: 512,
    prompt:
      `a kebab chef, plain unbranded apron with no writing on it, gold chain, blurred unbranded shop background ` +
      `with no signage and no readable words anywhere, ${PORTRAIT_SUFFIX}, absolutely no writing anywhere in the image`,
  },
  {
    name: "opp-rooftop",
    file: "opp-rooftop.jpg",
    aspectRatio: "1:1",
    width: 512,
    height: 512,
    prompt: `"Luna Drip", fashion influencer, silver jacket, ${PORTRAIT_SUFFIX}`,
  },
  {
    name: "opp-club",
    file: "opp-club.jpg",
    aspectRatio: "1:1",
    width: 512,
    height: 512,
    prompt: `"DJ Sigma", headphones, lasers reflected in shades, ${PORTRAIT_SUFFIX}`,
  },
  {
    name: "opp-stage",
    file: "opp-stage.jpg",
    aspectRatio: "1:1",
    width: 512,
    height: 512,
    prompt: `"The Aura Lord", final boss, glowing golden aura, crown of light, ${PORTRAIT_SUFFIX}`,
  },
];

const TITLE: Asset[] = [
  {
    name: "title",
    file: "title.jpg",
    aspectRatio: "16:9",
    width: 1280,
    height: 720,
    prompt:
      "two silhouetted figures facing off, huge glowing aura clashing between them, cyan versus magenta, " +
      "crowd silhouettes in the background, dramatic, space kept clear in the upper middle for a logo, no text, no letters, " +
      STYLE_SUFFIX,
  },
];

const ALL_ASSETS: Asset[] = [...BACKGROUNDS, ...PORTRAITS, ...TITLE];

function getApiKey(): string {
  const key = execFileSync(
    "security",
    ["find-generic-password", "-s", "gemini-api-key-hackathon", "-a", "dylanmerigaud", "-w"],
    { encoding: "utf8" },
  ).trim();
  if (!key) {
    throw new Error("empty key from keychain");
  }
  return key;
}

function parseForceArg(argv: string[]): Set<string> {
  const forced = new Set<string>();
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--force" && argv[i + 1]) {
      forced.add(argv[i + 1]);
    }
  }
  return forced;
}

let callCount = 0;

async function callGemini(apiKey: string, asset: Asset): Promise<Buffer> {
  callCount++;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent`;
  const body = {
    contents: [{ parts: [{ text: asset.prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: asset.aspectRatio },
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${asset.name}: ${text.slice(0, 300)}`);
  }
  const json: any = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p: any) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(`no inlineData image part for ${asset.name}: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function generateAsset(apiKey: string, asset: Asset): Promise<{ ok: boolean; error?: string }> {
  const maxAttempts = 3;
  let lastError = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const raw = await callGemini(apiKey, asset);
      const rawPath = join(CACHE_DIR, `${asset.name}.raw.jpg`);
      writeFileSync(rawPath, raw);
      const finalPath = join(ART_DIR, asset.file);
      resizeAndCompress(rawPath, finalPath, asset.width, asset.height);
      return { ok: true };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`  attempt ${attempt}/${maxAttempts} failed for ${asset.name}: ${lastError}`);
    }
  }
  return { ok: false, error: lastError };
}

function resizeAndCompress(srcPath: string, destPath: string, width: number, height: number) {
  if (existsSync(destPath)) {
    rmSync(destPath);
  }
  execFileSync("sips", ["-z", String(height), String(width), srcPath, "--out", destPath]);
  execFileSync("sips", ["-s", "formatOptions", "80", destPath]);
}

async function main() {
  const argv = process.argv.slice(2);
  const forced = parseForceArg(argv);

  const apiKey = getApiKey();

  const results: { name: string; status: string; error?: string }[] = [];

  for (const asset of ALL_ASSETS) {
    const destPath = join(ART_DIR, asset.file);
    const isForced = forced.has(asset.name);
    if (existsSync(destPath) && !isForced) {
      results.push({ name: asset.name, status: "skipped (exists)" });
      continue;
    }
    console.error(`Generating ${asset.name} (${asset.aspectRatio})...`);
    const result = await generateAsset(apiKey, asset);
    if (result.ok) {
      results.push({ name: asset.name, status: isForced ? "regenerated" : "generated" });
    } else {
      results.push({ name: asset.name, status: "FAILED", error: result.error });
    }
  }

  console.error("\n--- gen-art report ---");
  for (const r of results) {
    console.error(`${r.name}: ${r.status}${r.error ? ` (${r.error})` : ""}`);
  }
  console.error(`Total API calls: ${callCount}`);
}

main().catch((err) => {
  console.error("gen-art fatal error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
