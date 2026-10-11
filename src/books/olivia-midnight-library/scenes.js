// @ts-nocheck
/* Olivia and the Midnight Library on the Hill: the attic library and the hungry book. */
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

/** The hungry unfinished book: glows, whispers, and finally closes. */
function book(d, opts = {}) {
  const { x = 0.06, z = 0.46, width = 0.28 } = opts;
  const card = prop(d, "book", { x, z, width, label: "the book", emit: 0.4, note: 7 });
  if (!card) return null;
  const s = { g: 0.4, target: 0.4, closed: 0 };
  const mat = card.material;
  d.updaters.push((dt, t) => {
    s.g += (s.target - s.g) * Math.min(1, dt * 3);
    if (mat) mat.emissiveIntensity = s.g + Math.sin(t * 2.2) * 0.04 * (1 - s.closed);
    card.group.rotation.z = Math.sin(t * 1.4) * 0.02 * (1 - s.closed);
  });
  d.action("book", "glow", () => { s.target = 0.75; card.bounce(); d.ctx.sound.sparkle(); setTimeout(() => { s.target = 0.4; }, 1200); });
  d.action("book", "whisper", () => { s.target = 0.6; sfx(d, "whoosh", false); d.ctx.sound.chime(2, 0.2); setTimeout(() => { s.target = 0.4; }, 1200); });
  d.action("book", "close", () => { s.closed = 1; s.target = 0.25; card.bounce(); d.ctx.sound.chime(1, 0.3); setTimeout(() => { s.closed = 0; s.target = 0.4; }, 2000); });
  return card;
}

function quill(d, opts = {}) {
  const { x = 0.34, z = 0.44, width = 0.14 } = opts;
  const card = prop(d, "quill", { x, z, width, label: "quill", emit: 0.42, note: 9 });
  if (!card) return null;
  d.updaters.push((dt, t) => { card.group.position.y = 0.04 + Math.sin(t * 1.8) * 0.02; });
  d.action("quill", "write", () => { card.bounce(); d.ctx.sound.sparkle(); });
  return card;
}

function clock(d, opts = {}) {
  const { x = 0.04, z = 0.42, width = 0.2 } = opts;
  const card = prop(d, "clock", { x, z, width, label: "clock", emit: 0.34, note: 3 });
  if (!card) return null;
  d.action("clock", "chime", () => { card.bounce(); [0, 300, 600].forEach((ms) => setTimeout(() => d.ctx.sound.chime(1, 0.32), ms)); });
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
  house: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "house-night", "house", 0.22);
    cast(d);
    clock(d, { x: 0.02, z: 0.44 });
    return d;
  },
  attic: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "attic-library", "attic", 0.22);
    cast(d, { o: -0.34, b: -0.08, z: 0.14 });
    book(d, { x: 0.32, z: 0.46, width: 0.24 });
    quill(d, { x: 0.44, z: 0.4 });
    return d;
  },
  "attic-glow": (ctx) => {
    const d = new Diorama(ctx);
    back(d, "attic-glow", "attic", 0.2);
    cast(d, { o: -0.34, b: -0.08, z: 0.14 });
    book(d, { x: 0.32, z: 0.46, width: 0.26 });
    quill(d, { x: 0.46, z: 0.4 });
    return d;
  },
  "attic-dawn": (ctx) => {
    const d = new Diorama(ctx);
    back(d, "attic-dawn", "attic", 0.24);
    cast(d);
    clock(d, { x: 0.02, z: 0.44 });
    return d;
  },
  end: (ctx) => builders["attic-dawn"](ctx),
};

export default builders;
