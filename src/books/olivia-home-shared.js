// @ts-nocheck
/* Shared Olivia, Zero, and Belle paper figures for the home books. */
import * as THREE from "three";
import { Diorama, backCard, figure, sfx } from "../scenes.js";

export function paperLit(card, emit = 0.28) {
  if (!card || !card.material) return card;
  if (card.mesh) {
    card.mesh.castShadow = false;
    card.mesh.receiveShadow = false;
  }
  if (card.material.map) {
    card.material.emissiveMap = card.material.map;
    card.material.emissive = new THREE.Color(0xffffff);
    card.material.emissiveIntensity = emit;
    card.material.color = new THREE.Color(0xffffff);
  }
  return card;
}

export function olivia(d, opts = {}) {
  const { x = -0.22, z = 0.34, width = 0.32, delay = 0.3 } = opts;
  const card = paperLit(
    figure(d, "olivia-stand", {
      width, x, y: 0, z, delay, name: "olivia", label: "Olivia", radius: width * 0.5,
      onTap: () => hop(),
    }),
    0.3,
  );
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
  return card;
}

export function zero(d, opts = {}) {
  const { x = 0.22, z = 0.3, width = 0.5, delay = 0.28 } = opts;
  const card = paperLit(
    figure(d, "zero", {
      width, x, y: 0, z, delay, name: "zero", label: "Zero", radius: width * 0.4,
      onTap: () => wag(),
    }),
    0.3,
  );
  if (!card) return null;
  const s = { hop: 0 };
  const wag = () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(4, 0.26); sfx(d, "whoosh", false); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.4);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.035 + Math.sin(t * 1.05) * 0.006;
    card.group.rotation.z = Math.sin(t * 1.6) * 0.018;
  });
  d.action("zero", "wag", wag);
  d.action("zero", "sniff", () => { card.bounce(); d.ctx.sound.chime(3, 0.22); });
  d.action("zero", "sleep", () => { card.bounce(); d.ctx.sound.chime(1, 0.2); });
  d.action("zero", "run", () => { s.hop = 1; sfx(d, "whoosh", true); });
  return card;
}

export function belle(d, opts = {}) {
  const { x = 0.28, z = 0.32, width = 0.52, delay = 0.34 } = opts;
  const card = paperLit(
    figure(d, "belle", {
      width, x, y: 0, z, delay, name: "belle", label: "Belle", radius: width * 0.4,
      onTap: () => bounce(),
    }),
    0.3,
  );
  if (!card) return null;
  const s = { hop: 0 };
  const bounce = () => { s.hop = 1; card.bounce(); d.ctx.sound.chime(8, 0.28); sfx(d, "whoosh", false); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.9);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.07 + Math.sin(t * 2.4) * 0.016;
    card.group.rotation.z = Math.sin(t * 3.2) * 0.05;
  });
  d.action("belle", "wag", bounce);
  d.action("belle", "run", () => { s.hop = 1; sfx(d, "whoosh", true); });
  d.action("belle", "wreck", () => { s.hop = 1; sfx(d, "whoosh", true); d.ctx.sound.chime(11, 0.3); });
  d.action("belle", "bite", bounce);
  return card;
}

export function rockCard(d, opts = {}) {
  const { x = 0.02, z = 0.4, width = 0.18, delay = 0.36 } = opts;
  const card = paperLit(
    figure(d, "rock", {
      width, x, y: 0, z, delay, name: "rock", label: "rock", radius: 0.1,
      onTap: () => clack(),
    }),
    0.32,
  );
  if (!card) return null;
  const clack = () => { card.bounce(); d.ctx.sound.chime(2, 0.25); if (d.onRock) d.onRock(); };
  d.action("rock", "find", clack);
  d.action("rock", "clack", clack);
  return card;
}

export function canCard(d, opts = {}) {
  const { x = 0.04, z = 0.4, width = 0.22, delay = 0.36 } = opts;
  const card = paperLit(
    figure(d, "can", {
      width, x, y: 0, z, delay, name: "can", label: "watering can", radius: 0.12,
      onTap: () => pour(),
    }),
    0.32,
  );
  if (!card) return null;
  const pour = () => { card.bounce(); d.ctx.sound.chime(6, 0.28); sfx(d, "splash", 0, 0.25); };
  d.action("can", "pour", pour);
  d.action("water", "pour", pour);
  return card;
}

export { THREE, Diorama, backCard, figure, sfx };
