// @ts-nocheck
import { paperLit, olivia, zero, belle, Diorama, backCard } from "../olivia-home-shared.js";

const builders = {
  house: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "house", { name: "home", label: "home" }), 0.22);
    olivia(d, { x: -0.18, z: 0.34 });
    zero(d, { x: 0.18, z: 0.3 });
    belle(d, { x: 0.4, z: 0.32, width: 0.46 });
    return d;
  },
  garden: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "garden", { name: "garden", label: "garden" }), 0.22);
    olivia(d, { x: -0.22, z: 0.34 });
    zero(d, { x: 0.14, z: 0.3 });
    belle(d, { x: 0.38, z: 0.32 });
    return d;
  },
  end: (ctx) => builders.house(ctx),
};

export default builders;
