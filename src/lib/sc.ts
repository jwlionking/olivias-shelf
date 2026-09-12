import catalog from "./sc-catalog.json";

const map = catalog as Record<string, string>;

export const FREE_BOOK_IDS = [
  "lila-moonlit-pony",
  "elon-physics-wonder",
  "zero-and-belle",
  "otto-shy-moon",
  "nia-runaway-kite",
  "fin-glowing-sea",
] as const;

export function sc(key: string): string {
  return map[key] ?? `/sc/${key}`;
}

export function isFreeBook(id: string) {
  return (FREE_BOOK_IDS as readonly string[]).includes(id);
}

export function coverUrl(id: string) {
  return (
    map[`books/${id}/art/cover.jpg`] ||
    map[`books/${id}/art/cover-shelf.webp`] ||
    `/books/${id}/art/cover.jpg`
  );
}

export function shelfCoverUrl(id: string) {
  return map[`books/${id}/art/cover-shelf.webp`] || `/books/${id}/art/cover-shelf.webp`;
}

export function logoUrl(id: string) {
  return map[`books/${id}/art/logo.png`] || `/books/${id}/art/logo.png`;
}

export function wallUrl(id: string) {
  return (
    map[`public/textures/walls/${id}.jpg`] ||
    `/textures/walls/${id}.jpg`
  );
}

export function heroModelUrl(id: string, file: string) {
  return map[`books/${id}/${file}`];
}

export function voiceUrl(id: string, page: number) {
  return map[`books/${id}/voice/page-${page + 1}.mp3`];
}

export function wordCardUrl(id: string, word: string) {
  const key = `books/${id}/words/cards/${word.toLowerCase()}.jpg`;
  return map[key];
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
  return map[`public/models/toys/${name}.glb`];
}
