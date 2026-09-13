import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import library from "@/data/stories/index.json";
import {
  BRAND,
  coverUrl,
  isFreeBook,
  sc,
  shelfCoverUrl,
  toyCardUrl,
  TOY_MODELS,
  wallUrl,
  heroStandUrl,
} from "@/lib/sc";
import { playSfx } from "@/lib/sc-sound";
import { artFilesFor, buildDiorama, makeFigure } from "./dioramas";

export type WorldView = "loading" | "shelf" | "read";

export type WorldApi = {
  setView: (view: WorldView) => void;
  openBook: (id: string) => Promise<void>;
  setPage: (page: number, scene: string) => void;
  setLook: (on: boolean) => void;
  pointer: (nx: number, ny: number, down?: boolean) => string | null;
  tap: (nx: number, ny: number) => string | null;
  shelfPage: () => number;
  shelfPages: () => number;
  slideShelf: (dir: number) => number;
  dispose: () => void;
};

type BookMeta = (typeof library.books)[number];

const PAGE_W = 1.0;
const PAGE_H = 1.26;
const BOOK_W = 1.03;
const BOOK_H = 1.3;
const BOOK_D = 0.14;
const SHELF_SCALE = 0.62;
const PER_PAGE = 3;
const SPACING = 1.05;

function easeOutBack(t: number) {
  const c = 1.70158;
  const x = t - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export async function createWorld(
  canvas: HTMLCanvasElement,
  opts: {
    onProgress: (p: number, copy: string) => void;
    onBookPick: (id: string) => void;
    onTap: (name: string) => void;
  },
): Promise<WorldApi> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor("#141a33");
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#141a33", 7, 16);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 40);
  const camPos = new THREE.Vector3(0.12, 2.15, 2.95);
  const camTarget = new THREE.Vector3(0.05, 0.1, -0.18);
  const camPosCur = camPos.clone();
  const camTargetCur = camTarget.clone();
  camera.position.copy(camPos);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1280, 720), 0.18, 0.42, 0.82);
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const hemi = new THREE.HemisphereLight("#9ec4ee", "#c9a074", 0.55);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#fff1d2", 1.35);
  sun.position.set(-2.4, 4.6, 3.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.4;
  sun.shadow.camera.far = 16;
  sun.shadow.camera.left = -5;
  sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5;
  sun.shadow.camera.bottom = -5;
  scene.add(sun);
  const lamp = new THREE.PointLight("#f3c27a", 1.1, 7, 1.6);
  lamp.position.set(0.55, 1.35, 0.4);
  scene.add(lamp);
  const moonLight = new THREE.PointLight("#b7d4ff", 0.7, 10);
  moonLight.position.set(-2.2, 3.4, -1.4);
  scene.add(moonLight);

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  const textures = new Map<string, THREE.Texture>();

  const loadTex = (key: string, url: string, srgb = true) =>
    new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(
        url,
        (t) => {
          if (srgb) t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          textures.set(key, t);
          resolve(t);
        },
        undefined,
        reject,
      );
    });

  const copies = [
    "Fluffing the clouds…",
    "Warming the paper…",
    "Waking the toys…",
    "Lighting the moon…",
    "Tucking in the words…",
  ];
  let step = 0;
  const tick = (label: string) => {
    step += 1;
    opts.onProgress(Math.min(0.96, step / 14), label);
  };

  await loadTex("paper", BRAND.paper);
  tick(copies[0]);
  await loadTex("wood", BRAND.wood);
  tick(copies[1]);
  await loadTex("planks", BRAND.planks);
  await loadTex("planksN", BRAND.planksNormal, false);
  tick(copies[2]);
  await loadTex("wall", BRAND.wall);
  await loadTex("cloth", BRAND.cloth);
  await loadTex("town", BRAND.town);
  tick(copies[3]);

  const books = library.books as BookMeta[];
  for (const b of books) {
    await loadTex(`cover:${b.id}`, coverUrl(b.id));
  }
  tick(copies[4]);

  const wood = textures.get("wood")!;
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(3.2, 2.2);
  const planks = textures.get("planks")!;
  planks.wrapS = planks.wrapT = THREE.RepeatWrapping;
  planks.repeat.set(4, 3);
  const wall = textures.get("wall")!;
  wall.wrapS = wall.wrapT = THREE.MirroredRepeatWrapping;
  wall.repeat.set(7, 2.6);

  const wallMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 5.4),
    new THREE.MeshStandardMaterial({
      map: wall,
      roughness: 0.86,
      metalness: 0,
    }),
  );
  wallMesh.position.set(0, 2.2, -3.02);
  wallMesh.receiveShadow = true;
  scene.add(wallMesh);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 10),
    new THREE.MeshStandardMaterial({
      map: planks,
      roughness: 0.7,
      metalness: 0.02,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1.4);
  floor.receiveShadow = true;
  scene.add(floor);

  const skirting = new THREE.Mesh(
    new THREE.BoxGeometry(22, 0.16, 0.06),
    new THREE.MeshStandardMaterial({ color: "#f6ead0", roughness: 0.6 }),
  );
  skirting.position.set(0, 0.08, -2.96);
  skirting.receiveShadow = true;
  scene.add(skirting);

  const table = new THREE.Mesh(
    new RoundedBoxGeometry(1.85, 0.08, 1.05, 3, 0.04),
    new THREE.MeshStandardMaterial({
      map: wood,
      roughness: 0.48,
      metalness: 0.04,
    }),
  );
  table.position.set(0.35, 0.36, 0.85);
  table.castShadow = true;
  table.receiveShadow = true;
  scene.add(table);
  const legMat = new THREE.MeshStandardMaterial({
    map: wood,
    roughness: 0.55,
    color: "#c9a074",
  });
  for (const [x, z] of [
    [-0.4, 1.22],
    [1.05, 1.22],
    [-0.4, 0.48],
    [1.05, 0.48],
  ] as [number, number][]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.42, 10), legMat);
    leg.position.set(x, 0.21, z);
    leg.castShadow = true;
    scene.add(leg);
  }

  const windowCard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.42),
    new THREE.MeshStandardMaterial({
      map: textures.get("town"),
      roughness: 0.5,
      emissive: "#1b2744",
      emissiveIntensity: 0.2,
    }),
  );
  windowCard.position.set(-1.7, 1.55, -2.99);
  scene.add(windowCard);

  /* ----- shelf ----- */
  const shelfRoot = new THREE.Group();
  shelfRoot.position.set(0, 0, -2.62);
  scene.add(shelfRoot);
  const slider = new THREE.Group();
  shelfRoot.add(slider);

  const plankMat = new THREE.MeshStandardMaterial({
    map: planks.clone(),
    roughness: 0.5,
    metalness: 0.02,
    color: "#f0cfa0",
  });
  (plankMat.map as THREE.Texture).repeat.set(3.2, 1);
  const plankGeo = new RoundedBoxGeometry(5.6, 0.07, 0.42, 2, 0.02);
  const lower = new THREE.Mesh(plankGeo, plankMat);
  lower.position.set(0, 0.86, 0);
  lower.castShadow = true;
  lower.receiveShadow = true;
  slider.add(lower);
  const upper = new THREE.Mesh(plankGeo, plankMat);
  upper.position.set(0, 1.72, 0);
  upper.castShadow = true;
  slider.add(upper);

  const bracketMat = new THREE.MeshStandardMaterial({ color: "#c9a074", roughness: 0.45 });
  for (const x of [-2.2, 0, 2.2]) {
    for (const y of [0.86, 1.72]) {
      const br = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.18), bracketMat);
      br.position.set(x, y - 0.16, -0.12);
      slider.add(br);
    }
  }

  type ShelfBook = {
    id: string;
    group: THREE.Group;
    baseX: number;
    hover: number;
    locked: boolean;
  };
  const shelfBooks: ShelfBook[] = [];
  const pages = Math.ceil(books.length / PER_PAGE);
  let shelfPage = 0;
  let shelfSlide = 0;
  let shelfSlideTo = 0;

  books.forEach((meta, i) => {
    const g = new THREE.Group();
    const cover = textures.get(`cover:${meta.id}`);
    const board = new THREE.Mesh(
      new RoundedBoxGeometry(BOOK_W, BOOK_H, BOOK_D, 2, 0.03),
      new THREE.MeshStandardMaterial({
        color: meta.spine,
        roughness: 0.48,
        metalness: 0.05,
      }),
    );
    const pageBlock = new THREE.Mesh(
      new THREE.BoxGeometry(BOOK_W * 0.92, BOOK_H * 0.94, BOOK_D * 0.7),
      new THREE.MeshStandardMaterial({ color: "#f3e8cf", roughness: 0.82 }),
    );
    pageBlock.position.z = 0.012;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(BOOK_W * 0.94, BOOK_H * 0.94),
      new THREE.MeshStandardMaterial({
        map: cover,
        roughness: 0.5,
        metalness: 0,
      }),
    );
    face.position.z = BOOK_D / 2 + 0.002;
    g.add(board, pageBlock, face);
    if (!isFreeBook(meta.id)) {
      const lock = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 12),
        new THREE.MeshStandardMaterial({
          color: "#e6bd66",
          metalness: 0.6,
          roughness: 0.3,
          emissive: "#8a5a12",
          emissiveIntensity: 0.2,
        }),
      );
      lock.position.set(0.32, -0.48, 0.1);
      g.add(lock);
    }
    const col = i % PER_PAGE;
    const row = Math.floor(i / PER_PAGE);
    const x = (col - 1) * SPACING;
    g.position.set(x + row * (PER_PAGE * SPACING + 0.4), 0.86 + BOOK_H * SHELF_SCALE * 0.5 + 0.04, 0.08);
    g.scale.setScalar(SHELF_SCALE);
    g.userData.bookId = meta.id;
    g.userData.tap = `book:${meta.id}`;
    slider.add(g);
    shelfBooks.push({
      id: meta.id,
      group: g,
      baseX: g.position.x,
      hover: 0,
      locked: !isFreeBook(meta.id),
    });
  });

  const toyGroup = new THREE.Group();
  toyGroup.position.set(0, 1.76, 0.02);
  slider.add(toyGroup);

  /* ----- open book on table ----- */
  const bookRoot = new THREE.Group();
  bookRoot.position.set(0.08, 0.48, 0.12);
  bookRoot.visible = false;
  scene.add(bookRoot);

  const clothTex = textures.get("cloth")!;
  clothTex.wrapS = clothTex.wrapT = THREE.RepeatWrapping;
  const paperTex = textures.get("paper")!;
  paperTex.wrapS = paperTex.wrapT = THREE.RepeatWrapping;

  const leftBoard = new THREE.Mesh(
    new RoundedBoxGeometry(PAGE_W + 0.06, 0.03, PAGE_H + 0.06, 2, 0.02),
    new THREE.MeshStandardMaterial({
      map: clothTex,
      color: "#1b2450",
      roughness: 0.62,
    }),
  );
  leftBoard.rotation.x = -0.18;
  leftBoard.position.set(-0.58, 0.04, 0);
  const rightBoard = leftBoard.clone();
  rightBoard.position.set(0.58, 0.02, 0);
  rightBoard.rotation.x = 0.02;
  const leftPage = new THREE.Mesh(
    new THREE.PlaneGeometry(PAGE_W, PAGE_H),
    new THREE.MeshStandardMaterial({
      map: paperTex,
      color: "#f8f0dd",
      roughness: 0.7,
    }),
  );
  leftPage.rotation.x = -Math.PI / 2 - 0.18;
  leftPage.position.set(-0.54, 0.07, 0);
  const rightPage = new THREE.Mesh(
    new THREE.PlaneGeometry(PAGE_W, PAGE_H),
    new THREE.MeshStandardMaterial({
      map: paperTex,
      color: "#f6ead0",
      roughness: 0.68,
    }),
  );
  rightPage.rotation.x = -Math.PI / 2;
  rightPage.position.set(0.54, 0.055, 0);
  rightPage.receiveShadow = true;

  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.11, PAGE_H + 0.04),
    new THREE.MeshStandardMaterial({ color: "#1b2450", roughness: 0.55 }),
  );
  spine.position.set(0.0, 0.06, 0);

  const coverFace = new THREE.Mesh(
    new THREE.PlaneGeometry(PAGE_W * 0.92, PAGE_H * 0.92),
    new THREE.MeshStandardMaterial({ roughness: 0.5 }),
  );
  coverFace.rotation.x = Math.PI / 2 - 0.18;
  coverFace.rotation.z = Math.PI;
  coverFace.position.set(-0.58, 0.025, 0);

  bookRoot.add(leftBoard, rightBoard, leftPage, rightPage, spine, coverFace);

  const dioramaHost = new THREE.Group();
  dioramaHost.position.set(0.54, 0.06, 0);
  bookRoot.add(dioramaHost);
  let diorama: THREE.Group | null = null;
  const heroes = new Map<string, THREE.Texture>();

  let view: WorldView = "loading";
  let look = false;
  let currentBook = "";
  let currentPage = 0;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hoverBook: ShelfBook | null = null;
  let raf = 0;
  let last = performance.now();

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
  }
  resize();

  function shelfCamera() {
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const distance = THREE.MathUtils.clamp(1.9 / Math.tan(hfov / 2), 3.4, 8);
    const target = new THREE.Vector3(0, 0.7, -2.62);
    const dir = new THREE.Vector3(0, 0.42, 1).normalize();
    return { target, pos: target.clone().add(dir.multiplyScalar(distance)) };
  }

  function applyCam() {
    if (view === "shelf" || view === "loading") {
      const c = shelfCamera();
      camPos.copy(c.pos);
      camTarget.copy(c.target);
    } else {
      const target = new THREE.Vector3(0.5, 0.42, -0.1);
      const dir = new THREE.Vector3(0.06, 0.63, 1).normalize();
      const distance = 3.2 * (look ? 0.62 : 1);
      camTarget.copy(target);
      camPos.copy(target).add(dir.multiplyScalar(distance));
    }
  }

  function pick(nx: number, ny: number) {
    ndc.set(nx * 2 - 1, -(ny * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(scene.children, true);
    return hits[0] ?? null;
  }

  async function loadHero(id: string) {
    if (heroes.has(id)) return heroes.get(id)!;
    const url = heroStandUrl(id);
    if (!url) return null;
    try {
      const t = await loadTex(`hero:${id}`, url);
      heroes.set(id, t);
      return t;
    } catch {
      return null;
    }
  }

  async function loadArt(id: string) {
    const files = artFilesFor(id);
    await Promise.all(
      files.map(async (key) => {
        if (textures.has(key)) return;
        try {
          await loadTex(key, sc(key));
        } catch {
          /* missing painting */
        }
      }),
    );
  }

  async function openBook(id: string) {
    currentBook = id;
    currentPage = 0;
    const meta = books.find((b) => b.id === id);
    const cover = textures.get(`cover:${id}`);
    if (cover) {
      (coverFace.material as THREE.MeshStandardMaterial).map = cover;
      (coverFace.material as THREE.MeshStandardMaterial).needsUpdate = true;
      (leftBoard.material as THREE.MeshStandardMaterial).color.set(meta?.spine ?? "#1b2450");
      (spine.material as THREE.MeshStandardMaterial).color.set(meta?.spine ?? "#1b2450");
    }
    const wallMapUrl = wallUrl(id);
    if (wallMapUrl) {
      try {
        const t = textures.get(`wall:${id}`) || (await loadTex(`wall:${id}`, wallMapUrl));
        t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
        t.repeat.set(7, 2.6);
        (wallMesh.material as THREE.MeshStandardMaterial).map = t;
        (wallMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      } catch {
        /* keep nursery */
      }
    }
    await loadArt(id);
    await loadHero(id);
    bookRoot.visible = true;
    bookRoot.scale.setScalar(0.001);
    bookRoot.userData.pop = 0;
    view = "read";
    applyCam();
    playSfx("thunk", 0.35);
  }

  function setPage(page: number, sceneName: string) {
    currentPage = page;
    if (diorama) {
      dioramaHost.remove(diorama);
      diorama = null;
    }
    const hero = heroes.get(currentBook) ?? null;
    diorama = buildDiorama({
      bookId: currentBook,
      scene: sceneName,
      page,
      textures,
      hero,
      t: 0,
    });
    dioramaHost.add(diorama);
    playSfx("rustle", 0.3);
  }

  function setView(next: WorldView) {
    view = next;
    bookRoot.visible = next === "read";
    applyCam();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);

  const clock = { t: 0 };
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    clock.t += dt;

    shelfSlide += (shelfSlideTo - shelfSlide) * Math.min(1, dt * 6);
    slider.position.x = -shelfSlide * (PER_PAGE * SPACING + 0.4);

    for (const b of shelfBooks) {
      const want = hoverBook === b ? 1 : 0;
      b.hover += (want - b.hover) * Math.min(1, dt * 10);
      b.group.position.y =
        0.86 + BOOK_H * SHELF_SCALE * 0.5 + 0.04 + b.hover * 0.08;
      b.group.rotation.y = b.hover * -0.08;
    }

    if (bookRoot.visible) {
      const pop = Math.min(1, (bookRoot.userData.pop ?? 0) + dt * 1.8);
      bookRoot.userData.pop = pop;
      bookRoot.scale.setScalar(Math.max(0.001, easeOutBack(pop)));
    }
    if (diorama) {
      const pop = Math.min(1, (diorama.userData.pop ?? 0) + dt * 1.7);
      diorama.userData.pop = pop;
      const s = Math.max(0.001, easeOutBack(pop));
      diorama.scale.setScalar(s);
      diorama.traverse((o) => {
        if (o.userData.float) {
          o.position.y = (o.userData.baseY ?? o.position.y) + Math.sin(clock.t * 1.6) * 0.03;
        }
        if (o.userData.twinkle) {
          const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (m?.emissiveIntensity !== undefined) {
            m.emissiveIntensity = 0.5 + Math.sin(clock.t * 3 + o.userData.twinkle) * 0.45;
          }
        }
      });
    }

    camPosCur.lerp(camPos, 1 - Math.exp(-dt * 3.2));
    camTargetCur.lerp(camTarget, 1 - Math.exp(-dt * 3.2));
    camera.position.copy(camPosCur);
    camera.lookAt(camTargetCur);
    composer.render();
  };
  raf = requestAnimationFrame(loop);

  // toys after first paint: painted cards, not generated meshes
  setTimeout(() => {
    TOY_MODELS.slice(0, 10).forEach((name, i) => {
      const url = toyCardUrl(name);
      if (!url) return;
      loader.load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        const fig = makeFigure(t, 0.18);
        if (!fig) return;
        fig.position.set((i - 4.5) * 0.42, 0, 0);
        toyGroup.add(fig);
      });
    });
  }, 400);

  opts.onProgress(1, "Best with sound on");

  return {
    setView,
    openBook,
    setPage,
    setLook: (on) => {
      look = on;
      applyCam();
    },
    pointer: (nx, ny) => {
      const hit = pick(nx, ny);
      if (view === "shelf") {
        const obj = hit?.object;
        let cur: THREE.Object3D | undefined = obj;
        let id: string | null = null;
        while (cur) {
          if (cur.userData.bookId) {
            id = cur.userData.bookId;
            break;
          }
          cur = cur.parent ?? undefined;
        }
        hoverBook = shelfBooks.find((b) => b.id === id) ?? null;
        canvas.style.cursor = hoverBook ? "pointer" : "default";
        return id;
      }
      const name = hit?.object.userData.tap as string | undefined;
      canvas.style.cursor = name ? "pointer" : "default";
      return name ?? null;
    },
    tap: (nx, ny) => {
      const hit = pick(nx, ny);
      if (!hit) return null;
      if (view === "shelf") {
        let cur: THREE.Object3D | undefined = hit.object;
        while (cur) {
          if (cur.userData.bookId) {
            opts.onBookPick(cur.userData.bookId);
            playSfx("boing", 0.4);
            return cur.userData.bookId;
          }
          cur = cur.parent ?? undefined;
        }
      }
      const name = hit.object.userData.tap as string | undefined;
      if (name) {
        const obj = hit.object;
        const start = obj.scale.x;
        obj.scale.setScalar(start * 1.12);
        setTimeout(() => obj.scale.setScalar(start), 220);
        playSfx("boing", 0.35);
        opts.onTap(name);
      }
      return name ?? null;
    },
    shelfPage: () => shelfPage,
    shelfPages: () => pages,
    slideShelf: (dir: number) => {
      shelfPage = Math.max(0, Math.min(pages - 1, shelfPage + dir));
      shelfSlideTo = shelfPage;
      playSfx("flutter", 0.3);
      return shelfPage;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      composer.dispose();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
    },
  };
}

export { lerp, shelfCoverUrl };
