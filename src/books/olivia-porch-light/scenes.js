// @ts-nocheck
/* Olivia and the Porch That Wouldn't Stay Lit: Halloween on the home porch. */
import { paperLit, olivia, zero, belle, Diorama, backCard, figure, sfx } from "../olivia-home-shared.js";

function porch(d, id, emit = 0.2) {
  return paperLit(backCard(d, id, { name: "porch", label: "porch" }), emit);
}

/** Three jack-o'-lanterns that glow, dim (something sips them) and lean in to share. */
function pumpkins(d, opts = {}) {
  const { x = 0.02, z = 0.42, width = 0.42, delay = 0.36, lit = 0.34 } = opts;
  const card = paperLit(
    figure(d, "pumpkins", {
      width, x, y: 0, z, delay, name: "pumpkin", label: "jack-o'-lanterns", radius: 0.16,
      onTap: () => glow(),
    }),
    lit,
  );
  if (!card) return null;
  const s = { target: lit, glow: lit };
  const mat = card.material;
  const glow = () => { s.target = 0.55; card.bounce(); d.ctx.sound.chime(7, 0.28); setTimeout(() => { s.target = lit; }, 900); };
  const dim = () => { s.target = 0.04; card.bounce(); sfx(d, "whoosh", false); d.ctx.sound.chime(1, 0.22); setTimeout(() => { s.target = lit; }, 1600); };
  const share = () => { s.target = 0.6; card.bounce(); d.ctx.sound.sparkle(); setTimeout(() => { s.target = lit; }, 1400); };
  d.updaters.push((dt, t) => {
    s.glow += (s.target - s.glow) * Math.min(1, dt * 3);
    if (mat) mat.emissiveIntensity = s.glow + Math.sin(t * 7.3) * 0.02;
  });
  d.action("pumpkin", "glow", glow);
  d.action("pumpkin", "dim", dim);
  d.action("pumpkin", "share", share);
  return card;
}

/** The shy wind spirit: drifts, flinches, sips, then learns to sit still. */
function wind(d, opts = {}) {
  const { x = 0.36, z = 0.3, width = 0.3, delay = 0.5 } = opts;
  const card = paperLit(
    figure(d, "wind", {
      width, x, y: 0, z, delay, name: "wind", label: "the wind", radius: 0.14,
      onTap: () => shy(),
    }),
    0.36,
  );
  if (!card) return null;
  const s = { drift: 1, hop: 0 };
  const shy = () => { s.hop = 1; card.bounce(); sfx(d, "whoosh", false); };
  const still = () => { s.drift = 0.15; card.bounce(); d.ctx.sound.chime(5, 0.24); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.6);
    card.group.position.y = 0.03 + Math.sin(t * 1.7) * 0.025 * s.drift + Math.sin(s.hop * Math.PI) * 0.06;
    card.group.position.x = x + Math.sin(t * 0.9) * 0.03 * s.drift;
    card.group.rotation.z = Math.sin(t * 2.1) * 0.06 * s.drift;
  });
  d.action("wind", "swirl", () => { s.drift = 1.6; shy(); setTimeout(() => { s.drift = 1; }, 1500); });
  d.action("wind", "shy", shy);
  d.action("wind", "sip", () => { shy(); d.ctx.sound.chime(1, 0.2); });
  d.action("wind", "sit", still);
  d.action("wind", "still", still);
  return card;
}

function lantern(d, opts = {}) {
  const { x = 0.06, z = 0.44, width = 0.16, delay = 0.4 } = opts;
  const card = paperLit(
    figure(d, "lantern", {
      width, x, y: 0, z, delay, name: "lantern", label: "lantern", radius: 0.1,
      onTap: () => glow(),
    }),
    0.45,
  );
  if (!card) return null;
  const glow = () => { card.bounce(); d.ctx.sound.chime(9, 0.26); };
  d.action("lantern", "glow", glow);
  return card;
}

/** Extra verbs this story asks of the home-series figures. */
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
  dusk: (ctx) => {
    const d = new Diorama(ctx);
    porch(d, "porch-dusk", 0.24);
    cast(d);
    pumpkins(d, { x: 0.02, z: 0.44 });
    return d;
  },
  dark: (ctx) => {
    const d = new Diorama(ctx);
    porch(d, "porch-dark", 0.16);
    cast(d);
    pumpkins(d, { x: 0.02, z: 0.44, lit: 0.14 });
    return d;
  },
  stakeout: (ctx) => builders.dark(ctx),
  wind: (ctx) => {
    const d = new Diorama(ctx);
    porch(d, "porch-dark", 0.16);
    cast(d, { o: -0.34, b: -0.06, z: 0.12 });
    pumpkins(d, { x: 0.3, z: 0.44, width: 0.34, lit: 0.12 });
    wind(d, { x: 0.38, z: 0.36 });
    return d;
  },
  bargain: (ctx) => {
    const d = new Diorama(ctx);
    porch(d, "porch-dark", 0.2);
    cast(d, { o: -0.34, b: -0.06, z: 0.12 });
    wind(d, { x: 0.38, z: 0.34 });
    return d;
  },
  shared: (ctx) => {
    const d = new Diorama(ctx);
    porch(d, "porch-lit", 0.24);
    cast(d, { o: -0.36, b: -0.12, z: 0.1 });
    pumpkins(d, { x: 0.18, z: 0.44, width: 0.36, lit: 0.42 });
    wind(d, { x: 0.42, z: 0.32, width: 0.26 });
    return d;
  },
  after: (ctx) => {
    const d = new Diorama(ctx);
    porch(d, "porch-lit", 0.22);
    cast(d);
    lantern(d, { x: 0.02, z: 0.46 });
    return d;
  },
  end: (ctx) => builders.after(ctx),
};

export default builders;
