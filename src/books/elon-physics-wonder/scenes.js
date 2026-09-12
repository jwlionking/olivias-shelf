// @ts-nocheck
/* Spreads of "Elon and the Physics of Wonder". */
import * as THREE from "three";
import * as P from "../../props.js";
import { Diorama, backCard, figure, sfx } from "../../scenes.js";

function paperLit(card, emit = 0.28) {
  if (!card || !card.material) return card;
  if (card.mesh) { card.mesh.castShadow = false; card.mesh.receiveShadow = false; }
  if (card.material.map) {
    card.material.emissiveMap = card.material.map;
    card.material.emissive = new THREE.Color(0xffffff);
    card.material.emissiveIntensity = emit;
    card.material.color = new THREE.Color(0xffffff);
  }
  return card;
}

function elon(d, opts = {}) {
  const { x = 0.22, z = 0.3, width = 0.36, delay = 0.28 } = opts;
  const card = paperLit(figure(d, "elon-stand", { width, x, y: 0, z, delay, name: "elon", label: "Elon", radius: width * 0.45, onTap: () => wave() }), 0.3);
  if (!card) return null;
  const s = { hop: 0 };
  const wave = () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(6, 0.3); if (d.onWave) d.onWave(); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.7);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.04;
    card.group.rotation.z = Math.sin(t * 1.1) * 0.012;
  });
  d.action("elon", "wave", wave);
  d.action("elon", "teach", wave);
  d.action("elon", "look", () => { card.bounce(); d.ctx.sound.chime(4, 0.25); });
  return card;
}

function olivia(d, opts = {}) {
  const { x = -0.26, z = 0.34, width = 0.3, delay = 0.32 } = opts;
  const card = paperLit(figure(d, "olivia-stand", { width, x, y: 0, z, delay, name: "olivia", label: "Olivia", radius: width * 0.5, onTap: () => hop() }), 0.3);
  if (!card) return null;
  const s = { hop: 0 };
  const hop = () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(8, 0.28); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.8);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.05;
    card.group.rotation.z = Math.sin(t * 1.3) * 0.014;
  });
  d.action("olivia", "ask", hop);
  d.action("olivia", "wave", hop);
  d.action("olivia", "run", () => { s.hop = 1; sfx(d, "whoosh", true); });
  d.action("pip", "ask", hop);
  d.action("pip", "wave", hop);
  d.action("pip", "run", () => { s.hop = 1; sfx(d, "whoosh", true); });
  return card;
}

const builders = {
  workshop: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22);
    elon(d, { x: 0.24, z: 0.28, width: 0.38 });
    olivia(d, { x: -0.28, z: 0.34, width: 0.3 });
    paperLit(figure(d, "rocket", { width: 0.16, x: 0.02, z: 0.4, delay: 0.4, name: "rocket", label: "rocket", radius: 0.1, onTap: () => { sfx(d, "whoosh", true); ctx.sound.chime(10, 0.3); } }), 0.2);
    return d;
  },
  "apple-fall": (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "orchard", { name: "orchard", label: "orchard" }), 0.22);
    const apple = paperLit(figure(d, "apple", { width: 0.16, x: 0.06, y: 0.42, z: 0.38, delay: 0.2, pop: "rise", name: "apple", label: "apple", radius: 0.1, onTap: () => drop() }), 0.22);
    const s = { y: 0.42, v: 0, falling: false };
    const drop = () => { s.falling = true; s.v = 0; sfx(d, "whoosh", false); if (d.onDrop) d.onDrop(); };
    d.action("apple", "fall", drop);
    d.action("apple", "drop", drop);
    d.updaters.push((dt) => {
      if (!apple) return;
      if (s.falling) {
        s.v += 2.8 * dt;
        s.y -= s.v * dt;
        if (s.y <= 0.02) { s.y = 0.02; s.v *= -0.28; if (Math.abs(s.v) < 0.15) { s.falling = false; s.v = 0; ctx.sound.chime(2, 0.25); } }
      }
      apple.group.position.y = s.y;
    });
    elon(d, { x: 0.28, z: 0.26, width: 0.34 });
    olivia(d, { x: -0.3, z: 0.32, width: 0.28 });
    return d;
  },
  "rocket-push": (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "launch", { name: "pad", label: "launch pad" }), 0.22);
    const rocket = paperLit(figure(d, "rocket", { width: 0.22, x: 0.0, z: 0.32, delay: 0.22, name: "rocket", label: "rocket", radius: 0.12, onTap: () => fly() }), 0.2);
    const s = { y: 0, hop: 0 };
    const fly = () => { s.hop = 1; sfx(d, "whoosh", true); ctx.sound.chime(11, 0.35); if (d.onLaunch) d.onLaunch(); };
    d.action("rocket", "fly", fly);
    d.action("rocket", "push", fly);
    d.updaters.push((dt, t) => {
      if (!rocket) return;
      s.hop = Math.max(0, s.hop - dt * 0.7);
      rocket.group.position.y = s.hop * 0.55 + Math.sin(t * 2) * 0.01;
    });
    elon(d, { x: 0.3, z: 0.26, width: 0.32 });
    olivia(d, { x: -0.3, z: 0.32, width: 0.26 });
    return d;
  },
  magnets: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "workshop", { name: "lab", label: "workshop" }), 0.22);
    paperLit(figure(d, "magnet", { width: 0.22, x: 0.02, z: 0.38, delay: 0.24, name: "magnet", label: "magnet", radius: 0.12, onTap: () => { sfx(d, "shimmer", 0.5); ctx.sound.chime(7, 0.3); } }), 0.22);
    d.action("magnet", "pull", () => { sfx(d, "shimmer", 0.6); ctx.sound.chime(7, 0.35); });
    elon(d, { x: 0.28, z: 0.26, width: 0.34 });
    olivia(d, { x: -0.3, z: 0.34, width: 0.28 });
    return d;
  },
  "star-board": (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "stars", { name: "stars", label: "stars" }), 0.18);
    d.action("stars", "glow", () => { ctx.sound.sparkle(); ctx.sound.chime(9, 0.3); });
    elon(d, { x: 0.26, z: 0.28, width: 0.34 });
    olivia(d, { x: -0.28, z: 0.34, width: 0.28 });
    return d;
  },
  launch: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "launch", { name: "sky", label: "sky" }), 0.22);
    let flown = false;
    d.onLaunch = () => { if (!flown) { flown = true; ctx.onMagic("launch"); } };
    const rocket = paperLit(figure(d, "rocket", { width: 0.24, x: 0.02, z: 0.3, delay: 0.18, name: "rocket", label: "rocket", radius: 0.12, onTap: () => fly() }), 0.2);
    const s = { y: 0 };
    const fly = () => { s.y = 1; sfx(d, "whoosh", true); if (d.onLaunch) d.onLaunch(); };
    d.action("rocket", "fly", fly);
    d.updaters.push((dt) => { if (rocket) { s.y = Math.max(0, s.y - dt * 0.35); rocket.group.position.y = (1 - Math.pow(1 - s.y, 2)) * 0.7; } });
    elon(d, { x: 0.3, z: 0.24, width: 0.3 });
    olivia(d, { x: -0.3, z: 0.3, width: 0.26 });
    return d;
  },
  "ask-why": (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "workshop", { name: "workshop", label: "workshop" }), 0.22);
    elon(d, { x: 0.22, z: 0.28, width: 0.36 });
    olivia(d, { x: -0.28, z: 0.34, width: 0.3 });
    paperLit(figure(d, "apple", { width: 0.12, x: 0.0, z: 0.4, delay: 0.4, name: "apple", label: "apple", radius: 0.08 }), 0.2);
    return d;
  },
  end: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "stars", { name: "sky", label: "stars" }), 0.18);
    elon(d, { x: 0.26, z: 0.28, width: 0.34 });
    olivia(d, { x: -0.28, z: 0.32, width: 0.28 });
    paperLit(figure(d, "rocket", { width: 0.18, x: 0.0, z: 0.22, delay: 0.2, name: "rocket", label: "rocket", radius: 0.1 }), 0.2);
    return d;
  },
};

export default builders;
