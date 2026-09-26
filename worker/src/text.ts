// The game renders roast text in a bitmap style font that has no dash glyph beyond the ASCII
// hyphen, so every dash the model writes is normalised before the text leaves the Worker.
const DASHES = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g;

export function stripDashes(text: string): string {
  return text.replace(DASHES, "-").replace(/\s+/g, " ").trim();
}

export function clampRoast(text: string, max = 200): string {
  const clean = stripDashes(text);
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + ".";
}

export function twoWordTitle(text: string): string {
  const words = stripDashes(text).split(" ").filter(Boolean).slice(0, 2);
  return words.join(" ");
}
