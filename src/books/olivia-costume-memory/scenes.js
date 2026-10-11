// @ts-nocheck
/* Olivia and the Costume That Remembered Someone Else: a fox costume with a second heartbeat. */
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

/** The copper fox costume on its hanger: swishes, pulses with a second heartbeat, tugs. */
function costume(d, opts = {}) {
  const { x = 0.32, z = 0.42, width = 0.26 } = opts;
  const card = prop(d, "costume", { x, z, width, label: "costume", emit: 0.36, note: 6 });
  if (!card) return null;
  const s = { pulse: 0, lean: 0, target: 0 };
  const mat = card.material;
  d.updaters.push((dt, t) => {
    s.pulse = Math.max(0, s.pulse - dt * 0.8);
    s.lean += (s.target - s.lean) * Math.min(1, dt * 3);
    card.group.rotation.z = s.lean + Math.sin(t * 1.2) * 0.015;
    if (mat) mat.emissiveIntensity = 0.36 + Math.max(0, Math.sin(t * 7)) * 0.25 * s.pulse;
  });
  d.action("costume", "swish", () => { card.bounce(); sfx(d, "whoosh", false); });
  d.action("costume", "pulse", () => { s.pulse = 1; d.ctx.sound.chime(2, 0.26); setTimeout(() => d.ctx.sound.chime(2, 0.18), 260); });
  d.action("costume", "tug", () => { s.target = -0.3; card.bounce(); sfx(d, "whoosh", false); setTimeout(() => { s.target = 0; }, 1300); });
  return card;
}

/** Mrs. Penhallow's faceless dress form: very still, and then, just once, it sways. */
function mannequin(d, opts = {}) {
  const { x = 0.36, z = 0.32, width = 0.24 } = opts;
  const card = prop(d, "mannequin", { x, z, width, label: "dress form", emit: 0.32, note: 3 });
  if (!card) return null;
  const s = { sway: 0 };
  d.updaters.push((dt, t) => { s.sway = Math.max(0, s.sway - dt * 0.7); card.group.rotation.z = Math.sin(t * 2.4) * 0.04 * s.sway; });
  d.action("mannequin", "still", () => { s.sway = 1; d.ctx.sound.chime(1, 0.22); });
  return card;
}

function spool(d, opts = {}) {
  const { x = 0.04, z = 0.48, width = 0.14 } = opts;
  const card = prop(d, "spool", { x, z, width, label: "spool", emit: 0.38, note: 8 });
  if (!card) return null;
  const s = { spin: 0 };
  d.updaters.push((dt) => { s.spin = Math.max(0, s.spin - dt); card.group.rotation.y = s.spin * Math.PI * 2; });
  d.action("spool", "spin", () => { s.spin = 1; d.ctx.sound.sparkle(); });
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
  bedroom: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "bedroom", "room", 0.24);
    cast(d, { o: -0.34, b: -0.06, z: 0.14 });
    costume(d, { x: 0.36, z: 0.42 });
    spool(d, { x: 0.12, z: 0.5 });
    return d;
  },
  street: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "street-dusk", "street", 0.22);
    cast(d, { o: -0.34, b: -0.06, z: 0.14 });
    costume(d, { x: 0.38, z: 0.42, width: 0.22 });
    return d;
  },
  workshop: (ctx) => {
    const d = new Diorama(ctx);
    back(d, "workshop", "shop", 0.2);
    cast(d, { o: -0.36, b: -0.12, z: 0.08 });
    mannequin(d, { x: 0.36, z: 0.32 });
    spool(d, { x: 0.18, z: 0.5 });
    return d;
  },
  end: (ctx) => builders.bedroom(ctx),
};

export default builders;
