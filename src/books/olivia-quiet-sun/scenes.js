// @ts-nocheck
import { paperLit, olivia, Diorama, backCard } from "../olivia-home-shared.js";

const builders = {
  solar: (ctx) => {
    const d = new Diorama(ctx);
    const back = paperLit(backCard(d, "solar", { name: "sun", label: "sun" }), 0.24);
    const glow = () => { if (back) back.bounce(); d.ctx.sound.sparkle(); d.ctx.sound.chime(9, 0.3); };
    d.action("sun", "glow", glow);
    d.action("panels", "glow", glow);
    olivia(d, { x: -0.16, z: 0.34 });
    return d;
  },
  house: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "house", { name: "home", label: "home" }), 0.22);
    olivia(d, { x: -0.08, z: 0.34 });
    return d;
  },
  end: (ctx) => builders.solar(ctx),
};

export default builders;
