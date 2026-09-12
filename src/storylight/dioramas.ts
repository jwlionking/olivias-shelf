import * as THREE from "three";
import { sc } from "@/lib/sc";

export type DioramaContext = {
  bookId: string;
  scene: string;
  page: number;
  textures: Map<string, THREE.Texture>;
  hero?: THREE.Object3D | null;
  t: number;
};

type Piece = {
  art: string;
  w: number;
  h?: number;
  x?: number;
  y?: number;
  z?: number;
  rotX?: number;
  rotY?: number;
  name?: string;
  stand?: boolean;
  glow?: string;
};

function artKey(bookId: string, file: string) {
  const base = file.replace(/\.(png|jpg|jpeg|webp)$/i, "");
  const candidates = [
    `books/${bookId}/art/${file}`,
    `books/${bookId}/art/${base}.png`,
    `books/${bookId}/art/${base}.jpg`,
    `books/${bookId}/art/${base}.webp`,
  ];
  for (const c of candidates) {
    const url = sc(c);
    if (url && !url.startsWith("/sc/books") === false) return c;
    if (url.startsWith("/sc/")) return c;
  }
  return `books/${bookId}/art/${file}`;
}

function tex(ctx: DioramaContext, file: string) {
  const key = artKey(ctx.bookId, file);
  return ctx.textures.get(key) || ctx.textures.get(sc(key));
}

export function makeFigure(
  map: THREE.Texture | undefined,
  width: number,
  height?: number,
) {
  if (!map) return null;
  const img = map.image as HTMLImageElement | undefined;
  const aspect =
    height ??
    (img && img.width ? width * (img.height / img.width) : width * 1.15);
  const geo = new THREE.PlaneGeometry(width, aspect);
  const mat = new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    alphaTest: 0.12,
    roughness: 0.62,
    metalness: 0,
    side: THREE.DoubleSide,
    emissive: new THREE.Color("#1a1420"),
    emissiveIntensity: 0.08,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.position.y = aspect / 2;
  return mesh;
}

function addPiece(group: THREE.Group, ctx: DioramaContext, piece: Piece) {
  const map = tex(ctx, piece.art);
  const fig = makeFigure(piece.art.endsWith(".jpg") && !piece.stand ? map : map, piece.w, piece.h);
  if (!fig) return;
  if (!piece.stand && (piece.art.endsWith(".jpg") || piece.art.includes("sky") || piece.art.includes("wall") || piece.art.includes("forest") || piece.art.includes("field") || piece.art.includes("reef") || piece.art.includes("deep") || piece.art.includes("ship") || piece.art.includes("plankton") || piece.art.includes("hill") || piece.art.includes("river") || piece.art.includes("meadow") || piece.art.includes("cottage") || piece.art.includes("oak-wood") || piece.art.includes("home-wall") || piece.art.includes("shallows") || piece.art.includes("whale-blue"))) {
    fig.position.set(piece.x ?? 0, piece.y ?? piece.w * 0.42, piece.z ?? -0.16);
    fig.rotation.x = piece.rotX ?? 0;
    fig.castShadow = false;
  } else {
    fig.position.set(piece.x ?? 0, piece.y ?? 0, piece.z ?? 0.08);
    fig.rotation.y = piece.rotY ?? 0;
  }
  if (piece.name) {
    fig.name = piece.name;
    fig.userData.tap = piece.name;
    fig.traverse((c) => {
      c.userData.tap = piece.name;
    });
  }
  if (piece.glow) {
    const mat = fig.material as THREE.MeshStandardMaterial;
    mat.emissive = new THREE.Color(piece.glow);
    mat.emissiveIntensity = 0.35;
  }
  group.add(fig);
}

function addHero(group: THREE.Group, ctx: DioramaContext, x: number, z: number, scale = 0.55) {
  if (!ctx.hero) return;
  const h = ctx.hero.clone(true);
  h.scale.setScalar(scale);
  h.position.set(x, 0, z);
  h.name = "hero";
  h.userData.tap = "hero";
  h.traverse((c) => {
    c.userData.tap = "hero";
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true;
    }
  });
  group.add(h);
}

function balloon(group: THREE.Group, x: number, y: number, z: number) {
  const g = new THREE.Group();
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 24, 18),
    new THREE.MeshStandardMaterial({
      color: "#e24b3c",
      roughness: 0.35,
      emissive: "#6a120c",
      emissiveIntensity: 0.15,
    }),
  );
  sphere.position.y = 0.19;
  const knot = new THREE.Mesh(
    new THREE.ConeGeometry(0.025, 0.04, 8),
    new THREE.MeshStandardMaterial({ color: "#c43b30" }),
  );
  knot.position.y = 0.1;
  knot.rotation.x = Math.PI;
  const string = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.22, 6),
    new THREE.MeshStandardMaterial({ color: "#f6ead0" }),
  );
  string.position.y = -0.02;
  g.add(sphere, knot, string);
  g.position.set(x, y, z);
  g.name = "balloon";
  g.userData.tap = "balloon";
  g.userData.float = true;
  group.add(g);
}

const OTTO: Record<string, Piece[]> = {
  "bedroom-dark": [
    { art: "bedroom-wall.jpg", w: 1.05, z: -0.2, stand: false },
    { art: "bedroom-front.png", w: 1.02, z: 0.02, stand: true, y: 0, name: "window" },
  ],
  "bedroom-balloon": [
    { art: "bedroom-wall.jpg", w: 1.05, z: -0.2 },
    { art: "bedroom-front.png", w: 1.02, z: 0.0, stand: true, name: "window" },
  ],
  rooftops: [
    { art: "rooftops-sky.jpg", w: 1.12, z: -0.22 },
    { art: "cat.png", w: 0.2, x: 0.28, z: 0.16, stand: true, name: "cat" },
  ],
  clouds: [
    { art: "clouds-sky.jpg", w: 1.12, z: -0.22 },
    { art: "cloud-a.png", w: 0.42, x: -0.22, y: 0.18, z: 0.06, stand: true, name: "cloud" },
    { art: "cloud-b.png", w: 0.34, x: 0.26, y: 0.28, z: -0.02, stand: true, name: "cloud2" },
    { art: "cloud-sleepy.png", w: 0.38, x: 0.02, y: 0.08, z: 0.14, stand: true, name: "sleepy" },
  ],
  "owl-tree": [
    { art: "owl-forest.jpg", w: 1.12, z: -0.22 },
    { art: "owl-tree.png", w: 0.7, x: -0.08, z: 0.04, stand: true, name: "tree" },
    { art: "owl.png", w: 0.18, x: 0.12, y: 0.22, z: 0.18, stand: true, name: "owl" },
  ],
  "star-path": [
    { art: "stars-sky.jpg", w: 1.12, z: -0.22, glow: "#1a2044" },
  ],
  "behind-cloud": [
    { art: "stars-sky.jpg", w: 1.12, z: -0.24 },
    { art: "dark-cloud.png", w: 0.72, x: 0.04, y: 0.1, z: 0.08, stand: true, name: "cloud" },
    { art: "moon-face.png", w: 0.28, x: 0.1, y: 0.28, z: -0.02, stand: true, name: "moon", glow: "#e8c56a" },
  ],
  "moon-glow": [
    { art: "stars-sky.jpg", w: 1.12, z: -0.24 },
    { art: "moon-face.png", w: 0.46, x: 0.08, y: 0.16, z: 0.02, stand: true, name: "moon", glow: "#f3d27a" },
  ],
  descent: [
    { art: "rooftops-sky.jpg", w: 1.12, z: -0.22 },
    { art: "owl.png", w: 0.16, x: -0.28, y: 0.2, z: 0.12, stand: true, name: "owl" },
    { art: "cloud-a.png", w: 0.3, x: 0.3, y: 0.24, z: 0.04, stand: true, name: "cloud" },
  ],
  "bedroom-moonlit": [
    { art: "bedroom-wall-moon.jpg", w: 1.05, z: -0.2 },
    { art: "bedroom-front.png", w: 1.02, z: 0.0, stand: true, name: "window" },
    { art: "cat.png", w: 0.16, x: 0.32, z: 0.18, stand: true, name: "cat" },
    { art: "owl.png", w: 0.14, x: -0.3, y: 0.18, z: 0.12, stand: true, name: "owl" },
  ],
};

const NIA: Record<string, Piece[]> = {
  "kite-door": [
    { art: "cottage-front.jpg", w: 1.12, z: -0.22 },
    { art: "door.png", w: 0.28, x: 0.18, z: 0.08, stand: true, name: "door" },
    { art: "kite-blue.png", w: 0.22, x: -0.22, y: 0.22, z: 0.16, stand: true, name: "kite" },
  ],
  "kite-meadow": [
    { art: "meadow-sky.jpg", w: 1.12, z: -0.22 },
    { art: "grass.png", w: 1.0, z: 0.04, stand: true },
    { art: "kite-blue.png", w: 0.2, x: 0.22, y: 0.3, z: 0.14, stand: true, name: "kite" },
  ],
  "kite-letgo": [
    { art: "windy-field.jpg", w: 1.12, z: -0.22 },
    { art: "crow.png", w: 0.2, x: 0.24, y: 0.28, z: 0.12, stand: true, name: "crow" },
    { art: "kite-blue.png", w: 0.18, x: -0.1, y: 0.34, z: 0.16, stand: true, name: "kite" },
  ],
  "kite-river": [
    { art: "river.jpg", w: 1.12, z: -0.22 },
    { art: "ducks.png", w: 0.34, x: 0.1, z: 0.12, stand: true, name: "ducks" },
    { art: "riverbank.png", w: 1.0, z: 0.02, stand: true },
  ],
  "kite-hill": [
    { art: "hill.jpg", w: 1.12, z: -0.22 },
    { art: "sheep.png", w: 0.28, x: 0.16, z: 0.14, stand: true, name: "sheep" },
    { art: "fence.png", w: 0.7, z: 0.06, stand: true, name: "fence" },
  ],
  "kite-cloud": [
    { art: "clouds-sky.jpg", w: 1.12, z: -0.22 },
    { art: "cloud-sleepy.png", w: 0.42, y: 0.16, z: 0.1, stand: true, name: "cloud" },
    { art: "kite-face.png", w: 0.2, x: -0.22, y: 0.28, z: 0.16, stand: true, name: "kite" },
  ],
  "kite-oak": [
    { art: "oak-wood.jpg", w: 1.12, z: -0.22 },
    { art: "oak-tree.png", w: 0.7, z: 0.04, stand: true, name: "tree" },
    { art: "birches.png", w: 0.5, x: -0.28, z: 0.0, stand: true },
  ],
  "kite-festival": [
    { art: "festival-sky.jpg", w: 1.12, z: -0.22 },
    { art: "kite-blue.png", w: 0.16, x: -0.28, y: 0.3, z: 0.12, stand: true, name: "kite" },
    { art: "kite-face.png", w: 0.16, x: 0.22, y: 0.26, z: 0.14, stand: true },
  ],
  "kite-choice": [
    { art: "sunset-meadow.jpg", w: 1.12, z: -0.22 },
    { art: "kite-face.png", w: 0.28, y: 0.22, z: 0.12, stand: true, name: "kite" },
  ],
  "kite-home": [
    { art: "home-wall.jpg", w: 1.12, z: -0.22 },
    { art: "bedside.png", w: 0.5, x: 0.18, z: 0.08, stand: true, name: "bed" },
    { art: "kite-blue.png", w: 0.18, x: -0.24, y: 0.18, z: 0.14, stand: true, name: "kite" },
  ],
};

const FIN: Record<string, Piece[]> = {
  "sea-reef": [
    { art: "reef-dark.jpg", w: 1.12, z: -0.22 },
    { art: "coral-front.png", w: 1.0, z: 0.02, stand: true, name: "coral" },
    { art: "fish-dark.png", w: 0.22, x: 0.2, y: 0.16, z: 0.16, stand: true, name: "fish" },
  ],
  "sea-dive": [
    { art: "shallows.jpg", w: 1.12, z: -0.22 },
    { art: "rocks.png", w: 0.7, z: 0.04, stand: true },
  ],
  "sea-kelp": [
    { art: "kelp-forest.jpg", w: 1.12, z: -0.22 },
    { art: "kelp.png", w: 0.7, z: 0.04, stand: true, name: "kelp" },
    { art: "octopus.png", w: 0.28, x: 0.16, z: 0.14, stand: true, name: "octopus" },
  ],
  "sea-crab": [
    { art: "crab-rocks.jpg", w: 1.12, z: -0.22 },
    { art: "crab.png", w: 0.24, x: 0.12, z: 0.16, stand: true, name: "crab" },
  ],
  "sea-deep": [
    { art: "deep-dark.jpg", w: 1.12, z: -0.24 },
    { art: "jellies.png", w: 0.5, y: 0.12, z: 0.1, stand: true, name: "jellies", glow: "#6ad7e8" },
  ],
  "sea-ship": [
    { art: "ship-sand.jpg", w: 1.12, z: -0.22 },
    { art: "chest-open.png", w: 0.32, x: -0.1, z: 0.14, stand: true, name: "chest" },
  ],
  "sea-whale": [
    { art: "whale-blue.jpg", w: 1.12, z: -0.22 },
    { art: "whale.png", w: 0.7, z: 0.06, stand: true, name: "whale" },
  ],
  "sea-plankton": [
    { art: "plankton.jpg", w: 1.12, z: -0.22, glow: "#143a48" },
    { art: "fish-bright.png", w: 0.24, x: 0.2, y: 0.14, z: 0.14, stand: true, name: "fish", glow: "#7be7f2" },
  ],
  "sea-light": [
    { art: "reef-bright.jpg", w: 1.12, z: -0.22 },
    { art: "fish-bright.png", w: 0.28, z: 0.14, stand: true, name: "fish", glow: "#9ff5ff" },
  ],
  "sea-home": [
    { art: "shallows.jpg", w: 1.12, z: -0.22 },
    { art: "coral-front.png", w: 0.9, z: 0.04, stand: true },
    { art: "fish-bright.png", w: 0.22, x: 0.22, y: 0.1, z: 0.16, stand: true, name: "fish" },
  ],
};

const RECIPES: Record<string, Record<string, Piece[]>> = {
  "otto-shy-moon": OTTO,
  "nia-runaway-kite": NIA,
  "fin-glowing-sea": FIN,
};

export function buildDiorama(ctx: DioramaContext) {
  const group = new THREE.Group();
  const recipe = RECIPES[ctx.bookId]?.[ctx.scene] ?? [];
  for (const piece of recipe) addPiece(group, ctx, piece);

  if (ctx.bookId === "otto-shy-moon") {
    if (ctx.scene === "bedroom-dark") addHero(group, ctx, 0.22, 0.22, 0.5);
    else if (ctx.scene === "bedroom-balloon") {
      addHero(group, ctx, 0.08, 0.2, 0.46);
      balloon(group, -0.18, 0.28, 0.22);
    } else if (ctx.scene === "rooftops") {
      addHero(group, ctx, -0.16, 0.2, 0.42);
      balloon(group, -0.02, 0.42, 0.22);
    } else if (ctx.scene === "clouds" || ctx.scene === "owl-tree" || ctx.scene === "star-path") {
      addHero(group, ctx, -0.22, 0.18, 0.4);
      balloon(group, -0.08, 0.4, 0.2);
    } else if (ctx.scene === "behind-cloud" || ctx.scene === "moon-glow") {
      addHero(group, ctx, -0.26, 0.16, 0.4);
      balloon(group, -0.12, 0.38, 0.18);
    } else if (ctx.scene === "descent") {
      addHero(group, ctx, 0.04, 0.2, 0.4);
      balloon(group, 0.16, 0.42, 0.18);
    } else if (ctx.scene === "bedroom-moonlit") {
      addHero(group, ctx, 0.1, 0.2, 0.48);
    }
  } else if (ctx.bookId === "nia-runaway-kite") {
    addHero(group, ctx, -0.2, 0.2, 0.48);
  } else if (ctx.bookId === "fin-glowing-sea") {
    addHero(group, ctx, -0.16, 0.16, 0.42);
  }

  if (ctx.scene === "star-path" || ctx.scene === "moon-glow") {
    for (let i = 0; i < 10; i++) {
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 8, 8),
        new THREE.MeshStandardMaterial({
          color: "#fff6d2",
          emissive: "#f3d27a",
          emissiveIntensity: 0.9,
        }),
      );
      star.position.set((i % 5) * 0.16 - 0.32, 0.18 + (i % 3) * 0.16, 0.12 - (i % 2) * 0.04);
      star.name = "star";
      star.userData.tap = "star";
      star.userData.twinkle = 0.8 + i * 0.37;
      group.add(star);
    }
  }

  group.userData.pop = 0;
  group.scale.setScalar(0.001);
  return group;
}

export function artFilesFor(bookId: string) {
  const rec = RECIPES[bookId] ?? {};
  const files = new Set<string>();
  for (const pieces of Object.values(rec)) {
    for (const p of pieces) files.add(artKey(bookId, p.art));
  }
  return [...files];
}
