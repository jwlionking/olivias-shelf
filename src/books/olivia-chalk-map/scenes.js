// @ts-nocheck
/* Olivia and the Map Drawn in Chalk Dust: moving chalk arrows and a story under the deck. */
import { paperLit, olivia, zero, belle, Diorama, backCard, figure, sfx } from "../olivia-home-shared.js";

function back(d, id, name, emit = 0.2) {
  const card = paperLit(backCard(d, id, { name, label: name }), emit);
  d.action(name, "hush", () => { if (card) card.bounce(); sfx(d, "whoosh", false); d.ctx.sound.chime(1, 0.2); });
  return card;
}

function prop(d, id, { x, z, width, delay = 0.4, label, emit = 0.36, note = 6 }) {
  const card = paperLit(figure(d, id, { width, x, y: 0, z, delay, name: id, label, radius: 0.12, onTap: () => { card.bounce(); d.ctx.sound.chime(note, 0.26); } }), emit);
  return card;
}

/** Chalk arrows that turn to point somewhere new, and settle when the story ends. */
function arrow(d, opts = {}) {
  const { x = 0.3, z = 0.48, width = 0.26 } = opts;
  const card = prop(d, "arrow", { x, z, width, label: "arrows", emit: 0.4, note: 5 });
  if (!card) return null;
  const s = { spin: 0, target: 0 };
  d.updaters.push((dt) => { s.spin += (s.target - s.spin) * Math.min(1, dt * 4); card.group.rotation.z = s.spin; });
  d.action("arrow", "turn", () => { s.target = s.target === 0 ? 0.5 : 0; card.bounce(); d.ctx.sound.chime(4, 0.24); sfx(d, "whoosh", false); });
  return card;
}

function chalk(d, opts = {}) {
  const { x = 0.04, z = 0.46, width = 0.18 } = opts;
  const card = prop(d, "chalk", { x, z, width, label: "chalk", emit: 0.36, note: 8 });
  if (!card) return null;
  d.action("chalk", "draw", () => { card.bounce(); d.ctx.sound.sparkle(); });
  return card;
}

/** M.'s unfinished story, chalked on an old board. */
function storyPage(d, opts = {}) {
  const { x = 0.3, z = 0.46, width = 0.28 } = opts;
  const card = prop(d, "page", { x, z, width, label: "the story", emit: 0.38, note: 7 });
  if (!card) return null;
  const s = { g: 0.38, target: 0.38 };
  const mat = card.material;
  d.updaters.push((dt, t) => { s.g += (s.target - s.g) * Math.min(1, dt * 3); if (mat) mat.emissiveIntensity = s.g + Math.sin(t * 1.6) * 0.03; });
  d.action("page", "read", () => { s.target = 0.7; card.bounce(); d.ctx.sound.chime(2, 0.24); setTimeout(() => { s.target = 0.38; }, 1400); });
  return card;
}

function lantern(d, opts = {}) {
  const { x = 0.02, z = 0.46, width = 0.14 } = opts;
  const card = prop(d, "lantern", { x, z, width, label: "lantern", emit: 0.5, note: 9 });
  if (!card) return null;
  d.action("lantern", "glow", () => { card.bounce(); d.ctx.sound.chime(9, 0.26); });
  return card;
}

function verbs(d) {
  const tap = (name, note) => () => { const o = d.objects && d.objects[name]; if (o && o.onTap) o.onTap(); else d.ctx.sound.chime(note, 0.24); };
  d.action("olivia", "think", tap("olivia", 6));
  d.action("olivia", "watch", tap("olivia", 6));
  d.action("zero", "sit", tap("zero", 3));
  d.action("belle", "bark", () => { tap("belle", 9)(); d.ctx.sound.chime(10, 0.3); });
  d.action("belle", "sleep", tap("belle", 2));
}

function cast(d, { o = -0.3, b = 0.16, z = 0.4 } = {}) {
  olivia(d, { x: o, z: 0.34 });
  belle(d, { x: b, z: 0.3, width: 0.44 });
  zero(d, { x: z, z: 0.26, width: 0.42 });
  verbs(d);
}

const builders = {
  drive: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "drive-chalk", "drive", 0.24);
    cast(d);
    arrow(d, { x: 0.02, z: 0.48 });
    chalk(d, { x: 0.38, z: 0.46 });
    return d;
  },
  garden: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "garden-dusk", "garden", 0.22);
    cast(d, { o: -0.34, b: -0.06, z: 0.16 });
    arrow(d, { x: 0.36, z: 0.48, width: 0.22 });
    return d;
  },
  coop: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "coop-dusk", "coop", 0.2);
    cast(d, { o: -0.34, b: -0.06, z: 0.16 });
    arrow(d, { x: 0.36, z: 0.48, width: 0.22 });
    return d;
  },
  "under-deck": (ctx) => {
    const d = new Diorama(ctx);
    back(d, "under-deck", "deck", 0.2);
    cast(d, { o: -0.36, b: -0.12, z: 0.1 });
    lantern(d, { x: -0.02, z: 0.48 });
    storyPage(d, { x: 0.34, z: 0.46 });
    arrow(d, { x: 0.44, z: 0.36, width: 0.16 });
    return d;
  },
  end: (ctx) => builders["under-deck"](ctx),
};

export default builders;
