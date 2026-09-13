// @ts-nocheck
/* Shared Elon & Olivia paper figures for the physics pop-ups. */
import * as THREE from "three";
import { Diorama, backCard, figure, sfx } from "../scenes.js";

export function paperLit(card, emit = 0.28) {
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

export function elon(d, opts = {}) {
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

export function olivia(d, opts = {}) {
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

export function room(ctx, back = "workshop") {
  const d = new Diorama(ctx);
  paperLit(backCard(d, back, { name: back === "workshop" ? "workshop" : back, label: back === "workshop" ? "workshop" : back }), 0.22);
  elon(d);
  olivia(d);
  return d;
}

export { THREE, Diorama, backCard, figure, sfx };
