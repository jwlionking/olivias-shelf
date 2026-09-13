// @ts-nocheck
import { paperLit, olivia, canCard, Diorama, backCard } from "../olivia-home-shared.js";

const builders = {
  garden: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "garden", { name: "garden", label: "garden" }), 0.22);
    olivia(d, { x: -0.22, z: 0.34 });
    canCard(d, { x: 0.18, z: 0.4, width: 0.22 });
    return d;
  },
  house: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "house", { name: "home", label: "home" }), 0.22);
    olivia(d, { x: -0.1, z: 0.34 });
    canCard(d, { x: 0.22, z: 0.38, width: 0.2 });
    return d;
  },
  end: (ctx) => builders.garden(ctx),
};

export default builders;
