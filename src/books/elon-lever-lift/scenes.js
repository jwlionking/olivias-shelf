// @ts-nocheck
/* Olivia and the Long Stick — a lever borrows strength. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function stick(d) {
  const card = paperLit(figure(d, "stick", { width: 0.34, x: 0.04, z: 0.38, delay: 0.22, name: "stick", label: "stick", radius: 0.16, onTap: () => lift() }), 0.22);
  if (!card) return null;
  const s = { hop: 0 };
  const lift = () => { s.hop = 1; sfx(d, "whoosh", true); d.ctx.sound.chime(6, 0.3); };
  d.action("stick", "lift", lift);
  d.action("rocket", "fly", lift);
  d.action("rocket", "push", lift);
  d.action("apple", "fall", lift);
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.2);
    card.group.rotation.z = -0.18 + Math.sin(s.hop * Math.PI) * 0.28;
    card.group.position.y = 0.02 + Math.sin(t * 1.1) * 0.008;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d, { x: 0.28 }); olivia(d, { x: -0.3 }); stick(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => builders.workshop(ctx),
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
