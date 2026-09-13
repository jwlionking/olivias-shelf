// @ts-nocheck
/* Olivia and the Painted Sky — air is a quiet prism. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function prism(d) {
  const card = paperLit(figure(d, "prism", { width: 0.2, x: 0.02, z: 0.38, delay: 0.22, name: "prism", label: "prism", radius: 0.12, onTap: () => spill() }), 0.28);
  if (!card) return null;
  const s = { hop: 0 };
  const spill = () => { s.hop = 1; sfx(d, "shimmer", 0.6); d.ctx.sound.sparkle(); d.ctx.sound.chime(9, 0.3); };
  d.action("prism", "spill", spill);
  d.action("stars", "glow", spill);
  d.action("rocket", "fly", spill);
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.1);
    card.group.rotation.y = t * 0.4;
    card.group.position.y = 0.04 + Math.sin(t * 1.8) * 0.012 + Math.sin(s.hop * Math.PI) * 0.04;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d); olivia(d); prism(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "sky", { name: "sky", label: "sky" }), 0.2); elon(d); olivia(d); prism(d); return d; },
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "sky", { name: "stars", label: "sky" }), 0.2); elon(d); olivia(d); prism(d); d.action("stars", "glow", () => { d.ctx.sound.sparkle(); d.ctx.sound.chime(9, 0.3); }); return d; },
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders["star-board"](ctx),
};

export default builders;
