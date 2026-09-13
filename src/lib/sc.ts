import catalog from "./sc-catalog.json";
import { cdn } from "./cdn";

const map = catalog as Record<string, string>;

export const FREE_BOOK_IDS = [
  "lila-moonlit-pony",
  "elon-physics-wonder",
  "elon-magnet-pull",
  "elon-electric-spark",
  "elon-light-rainbow",
  "elon-sound-hum",
  "elon-orbit-moon",
  "elon-heat-jiggle",
  "elon-force-roll",
  "elon-float-boat",
  "elon-air-hug",
  "elon-ice-steam",
  "elon-friction-grip",
  "elon-lever-lift",
  "elon-energy-spring",
  "elon-balance-tip",
  "elon-sky-blue",
  "zero-and-belle",
  "otto-shy-moon",
  "nia-runaway-kite",
  "fin-glowing-sea",
] as const;

function elonArt(id: string, file: string) {
  const own = `books/${id}/${file}`;
  if (map[own]) return map[own];
  if (id.startsWith("elon-") && id !== "elon-physics-wonder") {
    return map[`books/elon-physics-wonder/${file}`] || `/books/elon-physics-wonder/${file}`;
  }
  return `/books/${id}/${file}`;
}

export function sc(key: string): string {
  return cdn(map[key] ?? `/sc/${key}`);
}

export function isFreeBook(id: string) {
  return (FREE_BOOK_IDS as readonly string[]).includes(id);
}

export function coverUrl(id: string) {
  return cdn(elonArt(id, "art/cover.jpg"));
}

export function shelfCoverUrl(id: string) {
  return cdn(elonArt(id, "art/cover-shelf.webp"));
}

export function logoUrl(id: string) {
  return cdn(map[`books/${id}/art/logo.png`] || `/books/${id}/art/logo.png`);
}

export function wallUrl(id: string) {
  if (id.startsWith("elon-") && id !== "elon-physics-wonder") {
    return cdn(map[`public/textures/walls/elon-physics-wonder.jpg`] || `/textures/walls/elon-physics-wonder.jpg`);
  }
  return cdn(map[`public/textures/walls/${id}.jpg`] || `/textures/walls/${id}.jpg`);
}

export function heroModelUrl(id: string, file: string) {
  const found = map[`books/${id}/${file}`];
  return found ? cdn(found) : found;
}

export function voiceUrl(id: string, page: number) {
  const found = map[`books/${id}/voice/page-${page + 1}.mp3`];
  return found ? cdn(found) : found;
}

export function wordCardUrl(id: string, word: string) {
  const key = `books/${id}/words/cards/${word.toLowerCase()}.jpg`;
  const found = map[key];
  return found ? cdn(found) : found;
}

export const BRAND = {
  symbol: sc("public/brand/storycomet-symbol.png"),
  wordmark: sc("public/brand/storycomet-wordmark.png"),
  moon: sc("public/ui/moon.webp"),
  sky: sc("public/ui/sky.jpg"),
  paper: sc("public/textures/paper.jpg"),
  wood: sc("public/textures/wood.jpg"),
  planks: sc("public/textures/wood-planks.jpg"),
  planksNormal: sc("public/textures/wood-planks-normal.jpg"),
  wall: sc("public/textures/wall-nursery.jpg"),
  cloth: sc("public/textures/cloth-neutral.jpg"),
  edges: sc("public/textures/page-edges.jpg"),
  paperNormal: sc("public/textures/paper-normal.jpg"),
  town: sc("public/textures/town-strip.png"),
  corner: sc("public/ui/corner.png"),
  flags: {
    en: sc("public/ui/flags/en.png"),
    fr: sc("public/ui/flags/fr.png"),
    es: sc("public/ui/flags/es.png"),
    ja: sc("public/ui/flags/ja.png"),
    zh: sc("public/ui/flags/zh.png"),
  },
};

export const TOY_MODELS = [
  "moon",
  "owl",
  "kite",
  "tree",
  "sheep",
  "cat",
  "house",
  "jar",
  "turtle",
  "lantern",
  "rocket",
  "boat",
  "elephant",
  "rose",
  "train",
] as const;

export function toyUrl(name: string) {
  const found = map[`public/models/toys/${name}.glb`];
  return found ? cdn(found) : found;
}
