// @ts-nocheck
/* Olivia and the Three Faces of Water. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function ice(d) {
  const card = paperLit(figure(d, "ice", { width: 0.2, x: 0.02, z: 0.4, delay: 0.22, name: "ice", label: "ice", radius: 0.12, onTap: () => melt() }), 0.22);
  if (!card) return null;
  const s = { melt: 0 };
  const melt = () => { s.melt = 1; sfx(d, "shimmer", 0.5); d.ctx.sound.chime(4, 0.28); };
  d.action("ice", "melt", melt);
  d.action("apple", "fall", melt);
  d.action("apple", "drop", melt);
  d.updaters.push((dt, t) => {
    s.melt = Math.max(0, s.melt - dt * 0.35);
    card.group.scale.setScalar(0.85 + (1 - s.melt) * 0.15);
    card.group.position.y = 0.02 + Math.sin(t * 1.4) * 0.01;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d); olivia(d); ice(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "window", { name: "stars", label: "cloud" }), 0.2); elon(d); olivia(d); ice(d); d.action("stars", "glow", () => { d.ctx.sound.sparkle(); d.ctx.sound.chime(9, 0.3); }); return d; },
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders["star-board"](ctx),
};

export default builders;
