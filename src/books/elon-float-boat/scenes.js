// @ts-nocheck
/* Olivia and the Floating Rock — water hugs upward. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function boat(d) {
  const card = paperLit(figure(d, "boat", { width: 0.26, x: 0.02, z: 0.4, delay: 0.22, name: "boat", label: "boat", radius: 0.14, onTap: () => bob() }), 0.22);
  if (!card) return null;
  const s = { hop: 0 };
  const bob = () => { s.hop = 1; sfx(d, "splash", true); d.ctx.sound.chime(6, 0.28); };
  d.action("boat", "float", bob);
  d.action("rocket", "fly", bob);
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.1);
    card.group.position.y = 0.04 + Math.sin(t * 2.2) * 0.018 + Math.sin(s.hop * Math.PI) * 0.05;
    card.group.rotation.z = Math.sin(t * 1.6) * 0.05;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d, { x: 0.28 }); olivia(d, { x: -0.3 }); boat(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => builders.workshop(ctx),
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
