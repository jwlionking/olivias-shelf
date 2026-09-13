// @ts-nocheck
/* Olivia and the Stubborn Cart — a force is a push or a pull. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function cart(d) {
  const card = paperLit(figure(d, "cart", { width: 0.28, x: -0.08, z: 0.4, delay: 0.22, name: "cart", label: "cart", radius: 0.14, onTap: () => roll() }), 0.22);
  if (!card) return null;
  const s = { x: -0.08, v: 0 };
  const roll = () => { s.v = 0.55; sfx(d, "whoosh", true); d.ctx.sound.chime(5, 0.25); };
  d.action("cart", "roll", roll);
  d.action("rocket", "fly", roll);
  d.action("rocket", "push", roll);
  d.action("rocket", "whoosh", roll);
  d.updaters.push((dt) => {
    s.x += s.v * dt;
    s.v *= Math.max(0, 1 - dt * 0.35);
    if (s.x > 0.38) { s.x = 0.38; s.v *= -0.2; }
    card.group.position.x = s.x;
    card.group.rotation.z = -s.v * 0.12;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d, { x: 0.28 }); olivia(d, { x: -0.32 }); cart(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => builders.workshop(ctx),
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
