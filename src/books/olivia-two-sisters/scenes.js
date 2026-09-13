// @ts-nocheck
import { paperLit, olivia, zero, belle, rockCard, Diorama, backCard } from "../olivia-home-shared.js";

const builders = {
  couch: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "couch", label: "couch" }), 0.22);
    olivia(d, { x: -0.08, z: 0.34, width: 0.3 });
    zero(d, { x: -0.36, z: 0.28, width: 0.5 });
    belle(d, { x: 0.32, z: 0.32, width: 0.5 });
    return d;
  },
  patio: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "patio", { name: "yard", label: "yard" }), 0.22);
    olivia(d, { x: -0.2, z: 0.34 });
    zero(d, { x: 0.08, z: 0.3 });
    belle(d, { x: 0.36, z: 0.32 });
    return d;
  },
  end: (ctx) => builders.couch(ctx),
};

export default builders;
