// @ts-nocheck
/* Olivia and the Sticky Floor — friction is a quiet grab. */
import { paperLit, elon, olivia, Diorama, backCard, figure, sfx } from "../elon-shared.js";

function mat(d) {
  const card = paperLit(figure(d, "mat", { width: 0.32, x: 0.04, z: 0.42, delay: 0.2, name: "mat", label: "mat", radius: 0.16, onTap: () => grab() }), 0.2);
  if (!card) return null;
  const s = { hop: 0 };
  const grab = () => { s.hop = 1; sfx(d, "thunk", true); d.ctx.sound.chime(3, 0.25); };
  d.action("mat", "grab", grab);
  d.action("rocket", "fly", grab);
  d.action("rocket", "push", grab);
  d.updaters.push((dt) => {
    s.hop = Math.max(0, s.hop - dt * 2.2);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.03;
  });
  return card;
}

const builders = {
  workshop: (ctx) => { const d = new Diorama(ctx); paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22); elon(d, { x: 0.28 }); olivia(d, { x: -0.3 }); mat(d); return d; },
  "apple-fall": (ctx) => builders.workshop(ctx),
  "rocket-push": (ctx) => builders.workshop(ctx),
  launch: (ctx) => builders.workshop(ctx),
  magnets: (ctx) => builders.workshop(ctx),
  "star-board": (ctx) => builders.workshop(ctx),
  "ask-why": (ctx) => builders.workshop(ctx),
  end: (ctx) => builders.workshop(ctx),
};

export default builders;
