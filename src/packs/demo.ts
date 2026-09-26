// Entry for the standalone demo page public/packs/index.html: always runs the ?packs=1 demo.
import { maybeRunPacksDemo } from "./index";

if (!new URLSearchParams(location.search).has("packs")) {
  const q = new URLSearchParams(location.search);
  q.set("packs", "1");
  history.replaceState(null, "", `${location.pathname}?${q}`);
  maybeRunPacksDemo();
}
