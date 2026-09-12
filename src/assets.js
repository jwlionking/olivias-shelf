// @ts-nocheck
import catalog from "./lib/sc-catalog.json";
import { isPublicAsset } from "./book-access.js";

const MAP = catalog;

let loaded = 0;
let expected = 0;
let files = 0;

function stripOrigin(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  let path = url;
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      path = new URL(url).pathname;
    }
  } catch {
    /* keep path */
  }
  return path.replace(/^\.\//, "");
}

function catalogKey(path) {
  return path.replace(/^\//, "").split("?")[0];
}

/**
 * Map a logical StoryComet asset path (books/…, public/…) onto the hashed
 * files we host under /sc, or onto the unhashed JSON we keep in /public.
 */
export function assetUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  const path = stripOrigin(url);
  if (path.startsWith("/sc/")) return path;
  const key = catalogKey(path);
  if (MAP[key]) return MAP[key];
  if (key === "books/index.json") return "/books/index.json";
  if (key === "public/models/toys/manifest.json") return "/models/toys/manifest.json";
  if (key === "public/audio/sfx/manifest.json") return "/audio/sfx/manifest.json";
  if (/^books\/[^/]+\/(story\.json|art\/manifest\.json|words\/manifest\.json)$/.test(key)) {
    return `/${key}`;
  }
  // Original books host unhashed paintings under /books and /textures.
  if (/^books\/[^/]+\/art\//.test(key) && /\.(png|jpe?g|webp|gif)$/i.test(key)) {
    return `/${key}`;
  }
  if (/^public\/textures\/walls\//.test(key) && /\.(png|jpe?g|webp)$/i.test(key)) {
    return `/${key.replace(/^public\//, "")}`;
  }
  // Unmapped pictures (pins, portraits) would 404 as HTML and flood the console.
  if (/\.(png|jpe?g|webp|gif)$/i.test(key)) {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
  if (key.startsWith("public/") || key.startsWith("books/")) return `/sc/${key}`;
  return path.startsWith("/") ? path : `/${path}`;
}

export function downloadProgress() {
  return { loaded, expected, arrived: loaded, files };
}

/** Original engine prefetches signed public assets; ours are already local. */
export async function loadPublicAssets(_opts = {}) {
  return true;
}

export function isMapped(url) {
  if (!url || typeof url !== "string") return false;
  const path = stripOrigin(url);
  const key = catalogKey(path);
  return Boolean(MAP[key]);
}

export { isPublicAsset };
