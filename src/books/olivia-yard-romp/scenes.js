// @ts-nocheck
import { paperLit, olivia, zero, belle, Diorama, backCard, sfx } from "../olivia-home-shared.js";

const builders = {
  patio: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "patio", { name: "yard", label: "yard" }), 0.22);
    olivia(d, { x: -0.22, z: 0.34 });
    belle(d, { x: 0.18, z: 0.34 });
    zero(d, { x: 0.4, z: 0.28, width: 0.46 });
    d.action("yard", "run", () => sfx(d, "whoosh", true));
    return d;
  },
  house: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "house", { name: "home", label: "home" }), 0.22);
    olivia(d, { x: -0.24, z: 0.34 });
    belle(d, { x: 0.12, z: 0.32 });
    zero(d, { x: 0.38, z: 0.28 });
    return d;
  },
  end: (ctx) => builders.house(ctx),
};

export default builders;
