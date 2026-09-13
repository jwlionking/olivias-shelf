// @ts-nocheck
/* Olivia and the Wobbly Ruler — heavy middles stand tall. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function ruler(d) {
  const card = paperLit(figure(d, "ruler", { width: 0.12, x: 0.04, z: 0.4, delay: 0.22, name: "ruler", label: "ruler", radius: 0.1, onTap: () => tip() }), 0.22);
  if (!card) return null;
  const s = { lean: 0, dir: 1 };
  const tip = () => { s.lean = 1; s.dir *= -1; sfx(d, "thunk", true); d.ctx.sound.chime(3, 0.25); };
  d.action("ruler", "tip", tip);
  d.action("rocket", "fly", tip);
  d.action("rocket", "push", tip);
  d.action("apple", "fall", tip);
  d.updaters.push((dt, t) => {
    s.lean = Math.max(0, s.lean - dt * 0.9);
    card.group.rotation.z = Math.sin(t * 2.4) * 0.08 + s.dir * Math.sin(s.lean * Math.PI) * 0.55;
    card.group.position.y = 0.04;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d, { x: 0.28 }); olivia(d, { x: -0.3 }); ruler(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => builders.workshop(ctx),
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
