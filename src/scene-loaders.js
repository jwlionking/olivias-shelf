// @ts-nocheck
/** Vite-static scene module map. Runtime `new URL(`../books/${id}/scenes.js`)` cannot be bundled. */

const loaders = {
  "lila-moonlit-pony": () => import("./books/lila-moonlit-pony/scenes.js"),
  "elon-physics-wonder": () => import("./books/elon-physics-wonder/scenes.js"),
  "elon-magnet-pull": () => import("./books/elon-magnet-pull/scenes.js"),
  "elon-electric-spark": () => import("./books/elon-electric-spark/scenes.js"),
  "elon-light-rainbow": () => import("./books/elon-light-rainbow/scenes.js"),
  "elon-sound-hum": () => import("./books/elon-sound-hum/scenes.js"),
  "elon-orbit-moon": () => import("./books/elon-orbit-moon/scenes.js"),
  "elon-heat-jiggle": () => import("./books/elon-heat-jiggle/scenes.js"),
  "elon-force-roll": () => import("./books/elon-force-roll/scenes.js"),
  "elon-float-boat": () => import("./books/elon-float-boat/scenes.js"),
  "elon-air-hug": () => import("./books/elon-air-hug/scenes.js"),
  "elon-ice-steam": () => import("./books/elon-ice-steam/scenes.js"),
  "elon-friction-grip": () => import("./books/elon-friction-grip/scenes.js"),
  "elon-lever-lift": () => import("./books/elon-lever-lift/scenes.js"),
  "elon-energy-spring": () => import("./books/elon-energy-spring/scenes.js"),
  "elon-balance-tip": () => import("./books/elon-balance-tip/scenes.js"),
  "elon-sky-blue": () => import("./books/elon-sky-blue/scenes.js"),
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
