// @ts-nocheck
/* Olivia and the Invisible Ocean — air is real. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function fan(d) {
  const card = paperLit(figure(d, "fan", { width: 0.22, x: 0.02, z: 0.4, delay: 0.22, name: "fan", label: "fan", radius: 0.12, onTap: () => wave() }), 0.22);
  if (!card) return null;
  const s = { hop: 0 };
  const wave = () => { s.hop = 1; sfx(d, "whoosh", true); d.ctx.sound.chime(8, 0.28); };
  d.action("fan", "wave", wave);
  d.action("rocket", "fly", wave);
  d.action("rocket", "push", wave);
  d.action("stars", "glow", wave);
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.5);
    card.group.rotation.z = Math.sin(t * 3 + s.hop * 8) * (0.08 + s.hop * 0.35);
    card.group.position.y = 0.02 + Math.sin(s.hop * Math.PI) * 0.04;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d); olivia(d); fan(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "stars", label: "mountain" }), 0.22); elon(d); olivia(d); fan(d); d.action("stars", "glow", () => { d.ctx.sound.sparkle(); d.ctx.sound.chime(9, 0.3); }); return d; },
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
