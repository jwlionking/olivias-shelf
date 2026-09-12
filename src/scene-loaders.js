// @ts-nocheck
/** Vite-static scene module map. Runtime `new URL(\`../books/${id}/scenes.js\`)` cannot be bundled. */

const loaders = {
  "lila-moonlit-pony": () => import("./books/lila-moonlit-pony/scenes.js"),
  "elon-physics-wonder": () => import("./books/elon-physics-wonder/scenes.js"),
  "zero-and-belle": () => import("./books/zero-and-belle/scenes.js"),
  "otto-shy-moon": () => import("./books/otto-shy-moon/scenes.js"),
  "nia-runaway-kite": () => import("./books/nia-runaway-kite/scenes.js"),
  "fin-glowing-sea": () => import("./books/fin-glowing-sea/scenes.js"),
  "pim-big-wish": () => import("./books/pim-big-wish/scenes.js"),
  "mila-firebird": () => import("./books/mila-firebird/scenes.js"),
  "lucia-tooth-mouse": () => import("./books/lucia-tooth-mouse/scenes.js"),
  "kiko-paper-crane": () => import("./books/kiko-paper-crane/scenes.js"),
  "kaguya-moon-bamboo": () => import("./books/kaguya-moon-bamboo/scenes.js"),
  "mei-year-beast": () => import("./books/mei-year-beast/scenes.js"),
  "nadim-swordfish": () => import("./books/nadim-swordfish/scenes.js"),
  "noy-rain-rocket": () => import("./books/noy-rain-rocket/scenes.js"),
  "pong-water-festival": () => import("./books/pong-water-festival/scenes.js"),
  "colette-paris-postcard": () => import("./books/colette-paris-postcard/scenes.js"),
  "whit-london-bells": () => import("./books/whit-london-bells/scenes.js"),
  "ruby-golden-gate": () => import("./books/ruby-golden-gate/scenes.js"),
};

export function loadScenes(id) {
  const load = loaders[id];
  if (!load) return Promise.reject(new Error(`No pop-up scenes for ${id}`));
  return load();
}
