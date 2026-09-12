// @ts-nocheck
/* Spreads of "Zero and Belle" — Zero the sable eight-year-old, Belle the black puppy. */
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

function dog(d, id, { x, z = 0.3, width = 0.52, delay = 0.3, name, label, wild = false } = {}) {
  const card = paperLit(figure(d, id, { width, x, y: 0, z, delay, name, label, radius: width * 0.4, onTap: () => wag() }), 0.3);
  if (!card) return null;
  const s = { hop: 0 };
  const wag = () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(wild ? 8 : 4, 0.28); sfx(d, "whoosh", false); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * (wild ? 1.9 : 1.4));
    const idle = wild ? Math.sin(t * 2.4) * 0.016 : Math.sin(t * 1.05) * 0.006;
    card.group.position.y = Math.sin(s.hop * Math.PI) * (wild ? 0.07 : 0.035) + idle;
    card.group.rotation.z = Math.sin(t * (wild ? 3.2 : 1.6)) * (wild ? 0.05 : 0.018);
  });
  d.action(name, "wag", wag);
  d.action(name, "run", () => { s.hop = 1; sfx(d, "whoosh", true); });
  d.action(name, "sniff", () => { card.bounce(); d.ctx.sound.chime(3, 0.22); });
  d.action(name, "sleep", () => { card.bounce(); d.ctx.sound.chime(1, 0.2); });
  d.action(name, "bite", () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(9, 0.22); sfx(d, "whoosh", false); });
  d.action(name, "wreck", () => { s.hop = 1; sfx(d, "whoosh", true); d.ctx.sound.chime(11, 0.3); });
  return card;
}

function rockCard(d, opts = {}) {
  const { x = 0.02, z = 0.38, width = 0.18, delay = 0.36 } = opts;
  const card = paperLit(figure(d, "rock", { width, x, y: 0, z, delay, name: "rock", label: "rock", radius: 0.1, onTap: () => clack() }), 0.32);
  if (!card) return null;
  const clack = () => { card.bounce(); d.ctx.sound.chime(2, 0.25); if (d.onRock) d.onRock(); };
  d.action("rock", "find", clack);
  d.action("rock", "clack", clack);
  return card;
}

function candyCard(d, opts = {}) {
  const { x = 0.04, z = 0.4, width = 0.28, delay = 0.4 } = opts;
  const card = paperLit(figure(d, "candy", { width, x, y: 0, z, delay, name: "candy", label: "candy", radius: 0.12, onTap: () => bounce() }), 0.32);
  if (!card) return null;
  const bounce = () => { card.bounce(); d.ctx.sound.chime(10, 0.28); };
  d.action("candy", "play", bounce);
  return card;
}

const builders = {
  couch: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "couch", label: "couch" }), 0.22);
    dog(d, "zero", { x: -0.28, z: 0.3, width: 0.54, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.28, z: 0.32, width: 0.58, delay: 0.34, name: "belle", label: "Belle", wild: true });
    return d;
  },
  rocks: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "home", label: "home" }), 0.22);
    dog(d, "zero", { x: -0.24, z: 0.3, width: 0.54, name: "zero", label: "Zero" });
    rockCard(d, { x: 0.08, z: 0.38, width: 0.18 });
    dog(d, "belle", { x: 0.32, z: 0.3, width: 0.56, delay: 0.4, name: "belle", label: "Belle", wild: true });
    return d;
  },
  wreck: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "pillows", label: "pillows" }), 0.22);
    dog(d, "zero", { x: -0.32, z: 0.28, width: 0.5, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.18, z: 0.32, width: 0.58, delay: 0.22, name: "belle", label: "Belle", wild: true });
    return d;
  },
  steal: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "floor", label: "floor" }), 0.22);
    dog(d, "zero", { x: -0.3, z: 0.28, width: 0.52, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.24, z: 0.34, width: 0.58, delay: 0.2, name: "belle", label: "Belle", wild: true });
    rockCard(d, { x: 0.06, z: 0.42, width: 0.16 });
    return d;
  },
  yard: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "yard", { name: "yard", label: "yard" }), 0.22);
    dog(d, "zero", { x: -0.28, z: 0.3, width: 0.54, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.26, z: 0.32, width: 0.58, delay: 0.3, name: "belle", label: "Belle", wild: true });
    candyCard(d, { x: 0.02, z: 0.4, width: 0.22 });
    return d;
  },
  creek: (ctx) => {
    const d = new Diorama(ctx);
    const water = paperLit(backCard(d, "creek", { name: "creek", label: "creek" }), 0.22);
    const splash = () => { if (water) water.bounce(); sfx(d, "splash", 0, 0.4); };
    d.action("creek", "splash", splash);
    dog(d, "zero", { x: -0.26, z: 0.3, width: 0.52, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.26, z: 0.32, width: 0.58, delay: 0.28, name: "belle", label: "Belle", wild: true });
    rockCard(d, { x: 0.0, z: 0.4, width: 0.18 });
    return d;
  },
  find: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "yard", { name: "grass", label: "grass" }), 0.22);
    let found = false;
    d.onRock = () => { if (!found) { found = true; ctx.onMagic("rock"); } };
    dog(d, "zero", { x: -0.28, z: 0.3, width: 0.54, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.26, z: 0.3, width: 0.58, delay: 0.32, name: "belle", label: "Belle", wild: true });
    rockCard(d, { x: 0.0, z: 0.38, width: 0.2 });
    return d;
  },
  home: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "couch", label: "couch" }), 0.22);
    dog(d, "zero", { x: -0.28, z: 0.28, width: 0.56, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.24, z: 0.3, width: 0.58, delay: 0.36, name: "belle", label: "Belle", wild: true });
    rockCard(d, { x: -0.08, z: 0.4, width: 0.16 });
    candyCard(d, { x: 0.12, z: 0.42, width: 0.22 });
    return d;
  },
  end: (ctx) => {
    const d = new Diorama(ctx);
    paperLit(backCard(d, "couch", { name: "home", label: "home" }), 0.22);
    dog(d, "zero", { x: -0.28, z: 0.3, width: 0.56, name: "zero", label: "Zero" });
    dog(d, "belle", { x: 0.26, z: 0.3, width: 0.58, name: "belle", label: "Belle", wild: true });
    rockCard(d, { x: -0.04, z: 0.22, width: 0.16 });
    candyCard(d, { x: 0.08, z: 0.22, width: 0.2 });
    return d;
  },
};

export default builders;
