// @ts-nocheck
/* Olivia and the Quiet Fire — heat is a tiny dance. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function stone(d, opts = {}) {
  const { x = 0.02, z = 0.4, width = 0.2 } = opts;
  const card = paperLit(figure(d, "stone", { width, x, z, delay: 0.22, name: "stone", label: "stone", radius: 0.12, onTap: () => glow() }), 0.34);
  if (!card) return null;
  const s = { hop: 0 };
  const glow = () => { s.hop = 1; sfx(d, "shimmer", 0.5); d.ctx.sound.chime(7, 0.3); };
  d.action("stone", "dance", glow);
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.4);
    card.group.position.y = 0.02 + Math.sin(s.hop * Math.PI) * 0.06 + Math.sin(t * 6) * 0.008;
    card.group.rotation.z = Math.sin(t * 5) * 0.04;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d); olivia(d); stone(d); return d; },
  "apple-fall": (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d, { x: 0.28 }); olivia(d, { x: -0.3 }); stone(d, { x: 0.04, z: 0.42, width: 0.24 }); return d; },
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "stars", label: "Sun" }), 0.22); elon(d); olivia(d); stone(d, { x: 0, z: 0.22, width: 0.16 }); d.action("stars", "glow", () => { d.ctx.sound.sparkle(); d.ctx.sound.chime(9, 0.3); }); return d; },
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders["star-board"](ctx),
};

export default builders;
