// @ts-nocheck
import { paperLit, olivia, zero, belle, rockCard, Diorama, backCard } from "../olivia-home-shared.js";

const builders = {
  patio: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "patio", { name: "yard", label: "yard" }), 0.22);
    olivia(d, { x: -0.3, z: 0.34 });
    zero(d, { x: -0.02, z: 0.3 });
    belle(d, { x: 0.34, z: 0.32 });
    rockCard(d, { x: 0.08, z: 0.42, width: 0.16 });
    return d;
  },
  garden: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "garden", { name: "garden", label: "garden" }), 0.22);
    let found = false;
    d.onRock = () => { if (!found) { found = true; ctx.onMagic("rock"); } };
    olivia(d, { x: -0.28, z: 0.34 });
    zero(d, { x: 0.02, z: 0.3 });
    belle(d, { x: 0.34, z: 0.32 });
    rockCard(d, { x: 0.0, z: 0.4, width: 0.2 });
    return d;
  },
  end: (ctx) => builders.garden(ctx),
};

export default builders;
