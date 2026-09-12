// @ts-nocheck
/* The spreads of "Lila and the Moonlit Pony": painted backs, paper-cut Lila and her shy
   moonlight pony, a lost silver bell, fireflies, and a ride home. Shared pop-up engine: src/scenes.js. */
import * as THREE from "three";
import * as P from "../../props.js";
import { Diorama, backCard, figure, starField, moonCard, sfx, splash, friend } from "../../scenes.js";

const { clamp } = P;

/** Night paintings sit in the book's shadow; a little self-light, not a glow. */
function paperLit(card, emit = 0.22) {
  if (!card || !card.material) return card;
  const mat = card.material;
  if (card.mesh) {
    card.mesh.castShadow = false;
    card.mesh.receiveShadow = false;
  }
  if (mat.map) {
    mat.emissiveMap = mat.map;
    mat.emissive = new THREE.Color(0xffffff);
    mat.emissiveIntensity = emit;
    mat.color = new THREE.Color(0xffffff);
    mat.toneMapped = true;
    mat.needsUpdate = true;
  }
  return card;
}

function nightLamp(d) {
  const fill = new THREE.PointLight(0xffefd4, 0.85, 3.4, 1.4);
  fill.position.set(0.06, 0.82, 0.95);
  d.group.add(fill);
}

function litBack(d, id, opts) {
  return paperLit(backCard(d, id, opts), 0.28);
}

function litMoon(d, opts) {
  const moon = moonCard(d, opts);
  if (moon && moon.card) paperLit(moon.card, 0.55);
  return moon;
}

function lila(d, { x = -0.22, z = 0.34, width = 0.4, pose = "stand", delay = 0.28 } = {}) {
  const sound = d.ctx.sound;
  const stars = d.burst(0xffd0e8, 40, 0.02);
  const id = pose === "bell" ? "lila-bell" : "lila-stand";
  const card = paperLit(figure(d, id, { width, x, y: 0, z, delay, name: "lila", label: "Lila", radius: width * 0.5, onTap: () => wave() }), 0.26);
  if (!card) return null;
  const s = { hop: 0, nod: 0 };
  const top = () => d.group.worldToLocal(card.worldPoint(0.5, 0.95, 0.04));
  const wave = () => {
    s.hop = 1; card.bounce();
    sound.chime(7, 0.35); setTimeout(() => sound.chime(9, 0.25), 160);
    stars.emit(top(), 8, 0.16, 0.6);
    if (d.onWave) d.onWave();
  };
  const nod = () => { s.nod = 1; card.bounce(); sound.chime(5, 0.3); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.8);
    s.nod = Math.max(0, s.nod - dt * 1.2);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.05;
    card.group.rotation.z = Math.sin(s.nod * Math.PI * 2) * 0.1 * s.nod + Math.sin(t * 1.4) * 0.012;
  });
  d.action("lila", "wave", wave);
  d.action("lila", "look", nod);
  d.action("lila", "whisper", nod);
  d.action("lila", "oh", wave);
  d.action("lila", "run", () => { s.hop = 1; sfx(d, "whoosh", true); card.bounce(); });
  d.action("lila", "sleep", () => { card.bounce(); sound.chime(2, 0.25); if (d.onSleep) d.onSleep(); });
  d.action("lila", "tie", () => { wave(); sfx(d, "shimmer", 0.5); });
  d.action("lila", "climb", () => { s.hop = 1; sound.pop(1.1); });
  return card;
}

function pony(d, { x = 0.22, z = 0.3, width = 0.7, pose = "stand", delay = 0.34 } = {}) {
  const sound = d.ctx.sound;
  const id = pose === "sleep" ? "pony-sleep" : "pony";
  const card = paperLit(figure(d, id, { width, x, y: 0, z, delay, name: "pony", label: "pony", radius: width * 0.4, onTap: () => nuzzle() }), 0.24);
  if (!card) return null;
  const s = { hop: 0, shy: 0 };
  const nuzzle = () => { s.hop = 1; sfx(d, "shimmer", 0.45); sound.chime(6, 0.3); if (d.onNuzzle) d.onNuzzle(); };
  d.updaters.push((dt, t) => {
    s.hop = Math.max(0, s.hop - dt * 1.6);
    s.shy = Math.max(0, s.shy - dt * 0.8);
    card.group.position.y = Math.sin(s.hop * Math.PI) * 0.045 + Math.sin(t * 1.1) * 0.008;
    card.group.rotation.z = Math.sin(t * 0.9) * 0.02 - s.shy * 0.08;
  });
  d.action("pony", "nuzzle", nuzzle);
  d.action("pony", "toss", () => { s.hop = 1; sfx(d, "boing", 2, 0.3); card.bounce(); });
  d.action("pony", "shy", () => { s.shy = 1; sound.chime(3, 0.2); });
  d.action("pony", "come", nuzzle);
  d.action("pony", "ride", () => { s.hop = 1; sfx(d, "whoosh", true); if (d.onRide) d.onRide(); });
  d.action("pony", "sleep", () => { card.bounce(); sound.chime(1, 0.2); });
  return card;
}

function bellCard(d, { x = 0.08, y = 0.12, z = 0.36, width = 0.16, delay = 0.4, hidden = false } = {}) {
  const card = paperLit(figure(d, "bell", { width, x, y, z, delay, name: "bell", label: "silver bell", radius: 0.1, onTap: () => ring() }), 0.4);
  if (!card) return null;
  const glints = d.burst(0xfff2b0, 50, 0.018);
  const s = { ring: 0, found: !hidden, drag: new THREE.Vector3() };
  if (hidden) card.group.position.set(x + 0.22, y - 0.02, z);
  const ring = () => {
    s.ring = 1; sfx(d, "shimmer", 0.6); d.ctx.sound.chime(10, 0.35);
    glints.emit(d.group.worldToLocal(card.worldPoint(0.5, 0.5, 0.04)), 10, 0.12, 0.5);
    if (d.onBell) d.onBell();
  };
  d.updaters.push((dt, t) => {
    s.ring = Math.max(0, s.ring - dt * 1.4);
    card.group.rotation.z = Math.sin(s.ring * 18) * 0.22 * s.ring + Math.sin(t * 2.2) * 0.03;
    if (!s.found) card.group.position.y = y + Math.sin(t * 1.6) * 0.01;
  });
  d.action("bell", "ring", ring);
  d.action("bell", "find", () => { s.found = true; card.group.position.set(0, 0, 0); ring(); });
  d.action("bell", "glow", ring);
  d.action("bell", "tie", ring);
  const entry = d.objects.bell;
  if (entry) {
    entry.onDrag = (worldPoint) => {
      const local = d.group.worldToLocal(worldPoint.clone());
      card.group.position.x = clamp(local.x - x, -0.35, 0.4);
      card.group.position.y = clamp(local.y - y, -0.1, 0.28);
    };
    entry.onDragEnd = () => { s.found = true; ring(); };
  }
  return card;
}

function blooms(d, { x = 0.32, z = 0.2, width = 0.22, delay = 0.4 } = {}) {
  const card = paperLit(figure(d, "flowers", { width, x, y: 0, z, delay, name: "flowers", label: "flowers", radius: 0.12, onTap: () => bloom() }), 0.28);
  if (!card) return null;
  const s = { bloom: 0 };
  const bloom = () => {
    s.bloom = 1;
    splash(d, new THREE.Vector3(x, 0.16, z + 0.03), { color: 0xff9ab8, count: 14, size: 0.02, speed: 0.22, up: 0.7 });
    d.ctx.sound.chime(8, 0.3);
  };
  d.updaters.push((dt) => { s.bloom = Math.max(0, s.bloom - dt * 0.8); card.group.scale.setScalar(1 + Math.sin(s.bloom * Math.PI) * 0.28); });
  d.action("flowers", "bloom", bloom);
  return card;
}

const builders = {
  "bedroom-window": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    const wall = litBack(d, "bedroom-window", { name: "window", label: "window" });
    const moon = litMoon(d, { width: 0.24, x: 0.3, y: 0.5, z: -0.4, delay: 0.18, glow: 0.7, onTap: () => ctx.sound.chime(6, 0.4) });
    starField(d, [new THREE.Vector3(-0.42, 0.86, -0.46), new THREE.Vector3(0.44, 0.9, -0.48), new THREE.Vector3(-0.08, 0.96, -0.5)], { delay: 0.22, size: 0.034 });
    if (wall) {
      d.hotspot(wall, "meadow", [0.45, 0.35, 0.4, 0.4], { label: "meadow", onTap: () => { wall.bounce(); ctx.sound.chime(4, 0.3); } });
      d.action("window", "glow", () => { wall.bounce(); moon && moon.pulse(); ctx.sound.glow(); });
    }
    lila(d, { x: -0.24, z: 0.38, width: 0.42 });
    return d;
  },

  "meadow-meet": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "meadow", { name: "meadow", label: "meadow" });
    let greeted = false;
    d.onWave = () => { if (!greeted) { greeted = true; ctx.onMagic("hello"); } };
    lila(d, { x: -0.32, z: 0.36, width: 0.4 });
    pony(d, { x: 0.24, z: 0.28, width: 0.74 });
    litMoon(d, { width: 0.2, x: 0.38, y: 0.64, z: -0.42, delay: 0.12, glow: 0.65, onTap: () => ctx.sound.chime(6, 0.4) });
    return d;
  },

  "lost-bell": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    const grass = litBack(d, "meadow", { name: "grass", label: "grass" });
    let found = false;
    d.onBell = () => { if (!found) { found = true; ctx.onMagic("bell"); } };
    pony(d, { x: -0.3, z: 0.26, width: 0.58 });
    lila(d, { x: 0.3, z: 0.36, width: 0.34 });
    bellCard(d, { x: 0.02, y: 0.08, z: 0.4, width: 0.16, hidden: true });
    d.action("grass", "lean", () => { grass.bounce(); sfx(d, "rustle", 0, 0.4); });
    return d;
  },

  "silver-stream": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    const water = litBack(d, "stream", { name: "stream", label: "stream" });
    const drops = d.burst(0xbfe8ff, 80, 0.022);
    const splashWater = () => {
      water.bounce();
      sfx(d, "splash", 0, 0.45);
      drops.emit(new THREE.Vector3(0.08, 0.12, -0.2), 16, 0.28, 0.7);
    };
    if (water) {
      d.hotspot(water, "water", [0.05, 0.0, 0.9, 0.45], { label: "water", onTap: splashWater });
      d.action("stream", "splash", splashWater);
    }
    litMoon(d, { width: 0.18, x: -0.34, y: 0.6, z: -0.42, delay: 0.12, glow: 0.7 });
    lila(d, { x: -0.24, z: 0.36, width: 0.34 });
    pony(d, { x: 0.26, z: 0.26, width: 0.56 });
    return d;
  },

  "oak-hollow": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "oak-sky", { name: "sky", label: "woods" });
    const tree = paperLit(figure(d, "oak-tree", { width: 0.62, x: -0.08, z: -0.18, delay: 0.08, pop: "hinge", name: "oak", label: "oak", radius: 0.32, onTap: () => rustle() }), 0.3);
    const rustle = () => { if (tree) tree.bounce(); sfx(d, "rustle", 0, 0.5); d.ctx.sound.puff(); };
    d.action("oak", "rustle", rustle);
    d.action("oak", "hollow", () => { rustle(); if (d.objects.bell) d.objects.bell.onTap(); });
    blooms(d, { x: 0.34, z: 0.2, width: 0.2 });
    lila(d, { x: 0.3, z: 0.36, width: 0.32 });
    paperLit(friend(d, "bell", { name: "bell", label: "ribbon", width: 0.12, x: -0.02, z: 0.14, delay: 0.4, call: "shimmer", note: 8, verb: "glow", radius: 0.08 }), 0.4);
    return d;
  },

  "firefly-hill": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "fireflies", { name: "hill", label: "hill" });
    const bugs = d.burst(0xd8ff7a, 90, 0.022);
    d.every(0.22, () => bugs.emit(new THREE.Vector3((Math.random() - 0.5) * 0.9, 0.08 + Math.random() * 0.5, 0.05 + (Math.random() - 0.5) * 0.4), 1, 0.05, 1));
    d.register("fireflies", d.group, { label: "fireflies", radius: 0.4, onTap: () => { ctx.sound.sparkle(); ctx.onMagic("fireflies"); } });
    d.action("fireflies", "glow", () => { ctx.sound.glow(); bugs.emit(new THREE.Vector3(0, 0.3, 0.1), 18, 0.3, 1); });
    let found = false;
    d.onBell = () => { if (!found) { found = true; ctx.onMagic("bell"); } };
    blooms(d, { x: 0.3, z: 0.2, width: 0.24 });
    bellCard(d, { x: 0.18, y: 0.14, z: 0.32, width: 0.14 });
    lila(d, { x: -0.32, z: 0.36, width: 0.34 });
    pony(d, { x: -0.02, z: 0.24, width: 0.52 });
    return d;
  },

  "rose-ribbon": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "meadow", { name: "meadow", label: "meadow" });
    lila(d, { x: -0.28, z: 0.36, width: 0.38, pose: "bell" });
    pony(d, { x: 0.26, z: 0.26, width: 0.62 });
    blooms(d, { x: 0.02, z: 0.2, width: 0.2 });
    bellCard(d, { x: -0.04, y: 0.24, z: 0.4, width: 0.14 });
    return d;
  },

  "moonlight-ride": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "ride", { name: "meadow", label: "meadow" });
    const moon = litMoon(d, { width: 0.26, x: 0.36, y: 0.58, z: -0.38, delay: 0.1, glow: 0.45, onTap: () => ctx.sound.chime(6, 0.5) });
    const sparkle = d.burst(0xfff0b8, 100, 0.032);
    const state = { warmth: 0, ridden: false };
    d.updaters.push((dt) => {
      if (!moon) return;
      const moonWorld = moon.card.worldPoint(0.5, 0.5);
      const dist = Math.hypot(d.pointer.x - moonWorld.x, d.pointer.y - moonWorld.y);
      const near = clamp(1 - (dist - 0.22) / 0.55, 0, 1);
      state.warmth += (near - state.warmth) * Math.min(1, dt * 0.9);
      moon.setGlow(0.45 + state.warmth * 0.55);
      if (!state.ridden && state.warmth > 0.85) {
        state.ridden = true;
        moon.pulse();
        sparkle.emit(new THREE.Vector3(0.1, 0.4, -0.1), 28, 0.4, 1);
        ctx.sound.glow();
        ctx.onMagic("ride");
      }
    });
    d.onRide = () => { if (!state.ridden) { state.ridden = true; ctx.onMagic("ride"); } };
    starField(d, [new THREE.Vector3(-0.44, 0.82, -0.4), new THREE.Vector3(-0.1, 0.94, -0.46), new THREE.Vector3(0.48, 0.78, -0.38)], { delay: 0.2, size: 0.034 });
    pony(d, { x: 0.04, z: 0.26, width: 0.64 });
    lila(d, { x: -0.34, z: 0.38, width: 0.3 });
    bellCard(d, { x: 0.2, y: 0.3, z: 0.34, width: 0.12 });
    return d;
  },

  "window-sill": (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    const wall = litBack(d, "bedroom-window", { name: "window", label: "window" });
    d.action("window", "glow", () => { wall.bounce(); ctx.sound.chime(6, 0.35); });
    lila(d, { x: -0.3, z: 0.36, width: 0.36 });
    pony(d, { x: 0.26, z: 0.22, width: 0.52, pose: "sleep" });
    bellCard(d, { x: 0.08, y: 0.2, z: 0.38, width: 0.14 });
    return d;
  },

  goodnight: (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "goodnight", { name: "meadow", label: "meadow" });
    const moon = litMoon(d, { width: 0.24, x: 0.34, y: 0.6, z: -0.38, delay: 0.1, glow: 0.7 });
    d.onSleep = () => { ctx.onMagic("sleep"); moon && moon.pulse(); };
    lila(d, { x: -0.32, z: 0.36, width: 0.34 });
    pony(d, { x: 0.14, z: 0.22, width: 0.6, pose: "sleep" });
    blooms(d, { x: -0.08, z: 0.18, width: 0.2 });
    starField(d, [new THREE.Vector3(-0.46, 0.88, -0.46), new THREE.Vector3(0.1, 0.96, -0.5), new THREE.Vector3(0.46, 0.8, -0.42)], { delay: 0.2, size: 0.032 });
    return d;
  },

  end: (ctx) => {
    const d = new Diorama(ctx);
    nightLamp(d);
    litBack(d, "meadow", { name: "sky", label: "meadow" });
    litMoon(d, { width: 0.32, x: 0.02, y: 0.44, z: -0.2, delay: 0.1, glow: 0.65, onTap: () => ctx.sound.chime(6, 0.4) });
    const stars = starField(d, [new THREE.Vector3(-0.45, 0.78, -0.3), new THREE.Vector3(-0.2, 0.96, -0.4), new THREE.Vector3(0.4, 0.92, -0.38), new THREE.Vector3(0.5, 0.55, -0.28), new THREE.Vector3(-0.5, 0.32, -0.2)], { delay: 0.2, size: 0.04 });
    const sparkle = d.burst(0xfff0b8, 80, 0.03);
    d.every(0.9, () => { const s = stars[Math.floor(Math.random() * stars.length)]; s.twinkle(); sparkle.emit(s.group.position, 5, 0.12, 1); });
    lila(d, { x: -0.32, z: 0.34, width: 0.34 });
    pony(d, { x: 0.28, z: 0.28, width: 0.56 });
    blooms(d, { x: 0.0, z: 0.2, width: 0.18 });
    return d;
  },
};

export default builders;
