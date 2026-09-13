// @ts-nocheck
/* Olivia and the Hidden Jump — energy can hide, then run. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function hopper(d) {
  const card = paperLit(figure(d, "hopper", { width: 0.22, x: 0.02, z: 0.4, delay: 0.22, name: "hopper", label: "toy", radius: 0.12, onTap: () => hop() }), 0.22);
  if (!card) return null;
  const s = { hop: 0 };
  const hop = () => { s.hop = 1; sfx(d, "boing", true); d.ctx.sound.chime(10, 0.3); };
  d.action("hopper", "hop", hop);
  d.action("rocket", "fly", hop);
  d.action("rocket", "push", hop);
  d.action("apple", "fall", hop);
  d.action("apple", "drop", hop);
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.15);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.22 + Math.sin(t * 2) * 0.006;
    card.group.rotation.z = Math.sin(s.hop * Math.PI * 2) * 0.12;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d); olivia(d); hopper(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => builders.workshop(ctx),
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
