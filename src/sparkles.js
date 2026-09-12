// @ts-nocheck
/* Cursor magic: glowing, twinkling stars. WebGL Sparkles is kept for GPUs that can spare a
   second renderer; CanvasSparkles is the default overlay (no extra WebGL context). */
import * as THREE from "three";

const MAX = 640;

const vertexShader = /* glsl */ `
  attribute vec2 aVel;
  attribute float aBirth;
  attribute float aLife;
  attribute float aSize;
  attribute float aSeed;
  attribute float aKind;
  uniform float uTime;
  uniform float uDpr;
  varying float vAlpha;
  varying float vSeed;
  varying float vKind;
  void main() {
    float age = uTime - aBirth;
    vSeed = aSeed;
    vKind = aKind;
    if (age < 0.0 || age > aLife) {
      gl_PointSize = 0.0;
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      vAlpha = 0.0;
      return;
    }
    float t = age / aLife;
    float drift = aKind > 2.5 ? -90.0 : 26.0;
    vec2 p = position.xy + aVel * age + vec2(sin(uTime * 3.0 + aSeed * 20.0) * 6.0 * t, drift * age * age);
    if (aKind < 0.5) p = position.xy;
    float twinkle = 0.7 + 0.3 * sin(uTime * (11.0 + aSeed * 9.0) + aSeed * 40.0);
    float pop = smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.5, 1.0, t));
    if (aKind < 0.5) pop = 1.0;
    vAlpha = pop * twinkle;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = aSize * uDpr * (0.55 + 0.75 * pop);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying float vAlpha;
  varying float vSeed;
  varying float vKind;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float ang = vSeed * 6.2832 + uTime * (0.6 + vSeed * 1.2);
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
    float glow = exp(-r * r * 26.0);
    float core = exp(-r * r * 160.0);
    float star = pow(max(0.0, 1.0 - (abs(q.x) + abs(q.y)) * 2.4), 3.0);
    float rays = pow(max(0.0, 1.0 - abs(abs(q.x) - abs(q.y)) * 7.0), 8.0) * (1.0 - smoothstep(0.08, 0.5, r));
    float a = glow * 0.7 + core * 1.5 + star * 1.2 + rays * 0.7;
    if (vKind < 0.5) a = glow * 1.1 + core * 0.2;
    vec3 gold = vec3(1.0, 0.84, 0.46);
    vec3 pink = vec3(1.0, 0.62, 0.78);
    vec3 sky = vec3(0.62, 0.84, 1.0);
    vec3 tint = vSeed < 0.3 ? pink : (vSeed < 0.55 ? sky : gold);
    vec3 col = mix(gold, tint, 0.65);
    col = mix(col, vec3(1.0), core * 0.9);
    float alpha = a * vAlpha * (vKind < 0.5 ? 0.34 : 1.0);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

export class Sparkles {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10);
    this.time = 0;
    this.next = 1;
    this.height = 1;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(MAX * 3);
    this.vel = new Float32Array(MAX * 2);
    this.birth = new Float32Array(MAX).fill(-100);
    this.life = new Float32Array(MAX).fill(1);
    this.size = new Float32Array(MAX);
    this.seed = new Float32Array(MAX);
    this.kind = new Float32Array(MAX);
    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute("aVel", new THREE.BufferAttribute(this.vel, 2));
    g.setAttribute("aBirth", new THREE.BufferAttribute(this.birth, 1));
    g.setAttribute("aLife", new THREE.BufferAttribute(this.life, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(this.size, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(this.seed, 1));
    g.setAttribute("aKind", new THREE.BufferAttribute(this.kind, 1));
    this.geometry = g;
    this.material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uDpr: { value: 1 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  resize(w, h, dpr) {
    this.height = h;
    this.camera.right = w;
    this.camera.top = h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uDpr.value = dpr;
  }

  dirty() {
    for (const name of ["position", "aVel", "aBirth", "aLife", "aSize", "aSeed", "aKind"]) this.geometry.attributes[name].needsUpdate = true;
  }

  get alive() { return !!this.cursorOn || (this.time - (this.lastSpawn == null ? -10 : this.lastSpawn)) < 2.2; }

  spawn(x, y, n = 1, kind = 1) {
    this.lastSpawn = this.time;
    for (let k = 0; k < n; k++) {
      const i = this.next;
      this.next = this.next + 1 >= MAX ? 1 : this.next + 1;
      const spread = kind === 3 ? 26 : 8;
      this.pos[i * 3] = x + (Math.random() - 0.5) * spread;
      this.pos[i * 3 + 1] = this.height - y + (Math.random() - 0.5) * spread;
      this.pos[i * 3 + 2] = 0;
      const speed = kind === 3 ? 90 : 40;
      const a = Math.random() * Math.PI * 2;
      this.vel[i * 2] = Math.cos(a) * speed * Math.random();
      this.vel[i * 2 + 1] = Math.sin(a) * speed * Math.random() + (kind === 3 ? 50 : 24);
      this.birth[i] = this.time + Math.random() * 0.05;
      this.life[i] = kind === 3 ? 0.9 + Math.random() * 0.7 : 0.7 + Math.random() * 0.6;
      this.size[i] = kind === 3 ? 34 + Math.random() * 40 : 20 + Math.random() * 26;
      this.seed[i] = Math.random();
      this.kind[i] = kind;
    }
    this.dirty();
  }

  setCursor(x, y, on) {
    this.cursorOn = !!on;
    this.pos[0] = x;
    this.pos[1] = this.height - y;
    this.birth[0] = on ? this.time - 1 : -100;
    this.life[0] = 1e6;
    this.size[0] = 220;
    this.seed[0] = 0.8;
    this.kind[0] = 0;
    this.dirty();
  }

  clear() {
    this.birth.fill(-100);
    this.dirty();
  }

  update(dt) {
    this.time += dt;
    this.material.uniforms.uTime.value = this.time;
  }

  render() {
    const r = this.renderer;
    const auto = r.autoClear;
    r.autoClear = false;
    r.render(this.scene, this.camera);
    r.autoClear = auto;
  }
}

/** Cursor magic without a second WebGL context — same API as Sparkles, drawn in 2D. */
export class CanvasSparkles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.time = 0;
    this.next = 1;
    this.w = 1;
    this.h = 1;
    this.dpr = 1;
    this.cursorOn = false;
    this.cursorX = 0;
    this.cursorY = 0;
    this.lastSpawn = -10;
    this.parts = new Array(640).fill(0).map(() => ({
      x: 0, y: 0, vx: 0, vy: 0, birth: -100, life: 1, size: 12, seed: 0, kind: 1,
    }));
  }

  resize(w, h, dpr) {
    this.w = w;
    this.h = h;
    this.dpr = dpr || 1;
    this.canvas.width = Math.max(1, Math.floor(w * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(h * this.dpr));
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
  }

  get alive() {
    return !!this.cursorOn || (this.time - (this.lastSpawn == null ? -10 : this.lastSpawn)) < 2.2;
  }

  spawn(x, y, n = 1, kind = 1) {
    this.lastSpawn = this.time;
    for (let k = 0; k < n; k++) {
      const p = this.parts[this.next];
      this.next = this.next + 1 >= this.parts.length ? 1 : this.next + 1;
      const spread = kind === 3 ? 26 : 8;
      const speed = kind === 3 ? 90 : 40;
      const a = Math.random() * Math.PI * 2;
      p.x = x + (Math.random() - 0.5) * spread;
      p.y = y + (Math.random() - 0.5) * spread;
      p.vx = Math.cos(a) * speed * Math.random();
      p.vy = Math.sin(a) * speed * Math.random() - (kind === 3 ? 50 : 24);
      p.birth = this.time + Math.random() * 0.05;
      p.life = kind === 3 ? 0.9 + Math.random() * 0.7 : 0.7 + Math.random() * 0.6;
      p.size = kind === 3 ? 14 + Math.random() * 18 : 8 + Math.random() * 12;
      p.seed = Math.random();
      p.kind = kind;
    }
  }

  setCursor(x, y, on) {
    this.cursorOn = !!on;
    this.cursorX = x;
    this.cursorY = y;
  }

  clear() {
    for (const p of this.parts) p.birth = -100;
    this.cursorOn = false;
    const ctx = this.ctx;
    if (ctx) ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(dt) {
    this.time += dt;
    for (const p of this.parts) {
      if (this.time - p.birth > p.life) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.kind > 2.5 ? -90 : 26) * dt * 0.35;
    }
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;
    const dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = "lighter";
    if (this.cursorOn) {
      const g = ctx.createRadialGradient(this.cursorX, this.cursorY, 0, this.cursorX, this.cursorY, 46);
      g.addColorStop(0, "rgba(255, 236, 170, 0.42)");
      g.addColorStop(0.35, "rgba(255, 196, 110, 0.16)");
      g.addColorStop(1, "rgba(255, 196, 110, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.cursorX, this.cursorY, 46, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const p of this.parts) {
      const age = this.time - p.birth;
      if (age < 0 || age > p.life) continue;
      const t = age / p.life;
      const pop = t < 0.1 ? t / 0.1 : 1 - Math.max(0, (t - 0.5) / 0.5);
      const tw = 0.7 + 0.3 * Math.sin(this.time * (11 + p.seed * 9) + p.seed * 40);
      const a = Math.max(0, pop * tw);
      if (a < 0.02) continue;
      this.drawStar(ctx, p.x, p.y, p.size * (0.55 + 0.75 * pop), a, p.seed);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  drawStar(ctx, x, y, size, alpha, seed) {
    const gold = seed < 0.3 ? [255, 158, 199] : seed < 0.55 ? [158, 214, 255] : [255, 214, 117];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(seed * 6.28 + this.time * (0.6 + seed * 1.2));
    ctx.fillStyle = `rgba(${gold[0]},${gold[1]},${gold[2]},${alpha})`;
    ctx.beginPath();
    const r = size * 0.55;
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.18, -r * 0.18);
    ctx.lineTo(r, 0);
    ctx.lineTo(r * 0.18, r * 0.18);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.18, r * 0.18);
    ctx.lineTo(-r, 0);
    ctx.lineTo(-r * 0.18, -r * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
