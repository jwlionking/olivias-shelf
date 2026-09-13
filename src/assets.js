// @ts-nocheck
import catalog from "./lib/sc-catalog.json";
import { isPublicAsset } from "./book-access.js";
import { cdn } from "./lib/cdn.ts";

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

function shareElonArt(key) {
  return key.replace(/^books\/elon-[^/]+\//, "books/elon-physics-wonder/");
}

/**
 * Map a logical StoryComet asset path (books/…, public/…) onto the hashed
 * files we host under /sc, or onto the unhashed JSON we keep in /public.
 */
export function assetUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  const path = stripOrigin(url);
  if (path.startsWith("/sc/")) return cdn(path);
  const key = catalogKey(path);
  if (MAP[key]) return cdn(MAP[key]);
  if (key === "books/index.json") return cdn("/books/index.json");
  if (key === "public/models/toys/manifest.json") return cdn("/models/toys/manifest.json");
  if (key === "public/audio/sfx/manifest.json") return cdn("/audio/sfx/manifest.json");
  if (/^books\/[^/]+\/(story\.json|art\/manifest\.json|words\/manifest\.json)$/.test(key)) {
    return cdn(`/${key}`);
  }
  // Later Elon & Olivia physics books share the first book's paintings.
  if (/^books\/elon-(?!physics-wonder)[^/]+\/art\//.test(key) && /\.(png|jpe?g|webp|gif)$/i.test(key)) {
    return cdn("/" + shareElonArt(key));
  }
  if (/^public\/textures\/walls\/elon-(?!physics-wonder)/.test(key)) {
    return cdn("/textures/walls/elon-physics-wonder.jpg");
  }
  // Original books host unhashed paintings under /books and /textures.
  if (/^books\/[^/]+\/art\//.test(key) && /\.(png|jpe?g|webp|gif)$/i.test(key)) {
    return cdn(`/${key}`);
  }
  if (/^public\/textures\/walls\//.test(key) && /\.(png|jpe?g|webp)$/i.test(key)) {
    return cdn(`/${key.replace(/^public\//, "")}`);
  }
  // Unmapped pictures (pins, portraits) would 404 as HTML and flood the console.
  if (/\.(png|jpe?g|webp|gif)$/i.test(key)) {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
  if (key.startsWith("public/") || key.startsWith("books/")) return cdn(`/sc/${key}`);
  const fallback = path.startsWith("/") ? path : `/${path}`;
  return cdn(fallback);
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
  return Boolean(MAP[key]) || /^books\/elon-/.test(key);
}

export { isPublicAsset };
