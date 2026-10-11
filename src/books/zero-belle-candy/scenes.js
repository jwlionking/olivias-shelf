// @ts-nocheck
/* Zero, Belle, and the Candy That Walked Away: a Halloween trail into the woods. */
import { paperLit, olivia, zero, belle, Diorama, backCard, figure, sfx } from "../olivia-home-shared.js";

function back(d, id, name, emit = 0.2) {
  const card = paperLit(backCard(d, id, { name, label: name }), emit);
  d.action(name, "hush", () => { if (card) card.bounce(); sfx(d, "whoosh", false); d.ctx.sound.chime(1, 0.2); });
  return card;
}

/** Candy bag and Belle's rainbow chew: rattles, and can vanish (and come back). */
function candy(d, opts = {}) {
  const { x = 0.04, z = 0.44, width = 0.24, delay = 0.36 } = opts;
  const card = paperLit(figure(d, "candy", { width, x, y: 0, z, delay, name: "candy", label: "candy", radius: 0.12, onTap: () => rattle() }), 0.34);
  if (!card) return null;
  const s = { gone: 0, target: 0 };
  const rattle = () => { card.bounce(); d.ctx.sound.chime(8, 0.26); d.ctx.sound.chime(10, 0.2); };
  const gone = () => { s.target = 1; sfx(d, "whoosh", false); setTimeout(() => { s.target = 0; }, 1500); };
  d.updaters.push((dt) => {
    s.gone += (s.target - s.gone) * Math.min(1, dt * 4);
    card.group.scale.setScalar(Math.max(0.02, 1 - s.gone));
  });
  d.action("candy", "rattle", rattle);
  d.action("candy", "gone", gone);
  return card;
}

/** Foil wrappers on the ground: they glint. */
function foil(d, opts = {}) {
  const { x = 0.3, z = 0.46, width = 0.26, delay = 0.4 } = opts;
  const card = paperLit(figure(d, "foil", { width, x, y: 0, z, delay, name: "foil", label: "foil", radius: 0.12, onTap: () => glint() }), 0.4);
  if (!card) return null;
  const s = { g: 0 };
  const mat = card.material;
  const glint = () => { s.g = 1; card.bounce(); d.ctx.sound.sparkle(); };
  d.updaters.push((dt, t) => { s.g = Math.max(0, s.g - dt * 1.2); if (mat) mat.emissiveIntensity = 0.4 + s.g * 0.5 + Math.sin(t * 5) * 0.03; });
  d.action("foil", "glint", glint);
  return card;
}

/** Theo, the small lost astronaut. */
function boy(d, opts = {}) {
  const { x = 0.36, z = 0.32, width = 0.28, delay = 0.5 } = opts;
  const card = paperLit(figure(d, "boy", { width, x, y: 0, z, delay, name: "boy", label: "Theo", radius: 0.14, onTap: () => shy() }), 0.32);
  if (!card) return null;
  const s = { hop: 0 };
  const shy = () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(5, 0.24); };
  d.updaters.push((dt, t) => { s.hop = Math.max(0, s.hop - dt * 1.8); card.group.position.y = Math.sin(s.hop * Math.PI) * 0.03; card.group.rotation.z = Math.sin(t * 1.1) * 0.01; });
  d.action("boy", "shy", shy);
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
  yard: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "yard-dusk", "yard", 0.24);
    cast(d);
    candy(d, { x: 0.0, z: 0.46 });
    foil(d, { x: 0.36, z: 0.48, width: 0.2 });
    return d;
  },
  treeline: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "treeline", "woods", 0.2);
    cast(d, { o: -0.32, b: 0.06, z: 0.36 });
    foil(d, { x: 0.1, z: 0.48, width: 0.2 });
    return d;
  },
  woods: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "woods-dark", "woods", 0.18);
    cast(d, { o: -0.34, b: -0.04, z: 0.2 });
    foil(d, { x: 0.38, z: 0.46, width: 0.22 });
    return d;
  },
  "woods-find": (ctx) => {
    const d = new Diorama(ctx);
    back(d, "woods-dark", "woods", 0.18);
    cast(d, { o: -0.36, b: -0.14, z: 0.06 });
    boy(d, { x: 0.36, z: 0.32 });
    candy(d, { x: 0.22, z: 0.46, width: 0.18 });
    foil(d, { x: 0.02, z: 0.5, width: 0.18 });
    return d;
  },
  "yard-home": (ctx) => {
    const d = new Diorama(ctx);
    back(d, "yard-night", "yard", 0.22);
    cast(d);
    candy(d, { x: 0.02, z: 0.46 });
    foil(d, { x: 0.38, z: 0.48, width: 0.18 });
    return d;
  },
  end: (ctx) => builders["yard-home"](ctx),
};

export default builders;
