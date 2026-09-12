import { useEffect, useRef } from "react";
import * as THREE from "three";

export function PopupHero() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#1a2744");
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    el.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight("#fff4e0", 1.35);
    light.position.set(2, 4, 3);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight("#6b7aa8", 0.55));
    const rim = new THREE.PointLight("#d45a3a", 1.2, 12);
    rim.position.set(-2, 2, 1);
    scene.add(rim);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.12, 3),
      new THREE.MeshStandardMaterial({ color: "#5c3d28", roughness: 0.8 }),
    );
    table.position.y = -0.55;
    table.receiveShadow = true;
    scene.add(table);

    const book = new THREE.Group();
    const paperMat = new THREE.MeshStandardMaterial({
      color: "#f6f0e4",
      roughness: 0.55,
    });
    const coverMat = new THREE.MeshStandardMaterial({
      color: "#d45a3a",
      roughness: 0.45,
    });
    const left = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 2), coverMat);
    left.position.set(-0.78, 0, 0);
    left.rotation.z = 0.08;
    const right = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 2), paperMat);
    right.position.set(0.78, 0.02, 0);
    right.rotation.z = -0.05;
    book.add(left, right);

    const tree = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.9, 5),
      new THREE.MeshStandardMaterial({ color: "#4a7c59" }),
    );
    tree.position.set(-0.35, 0.55, 0.1);
    tree.castShadow = true;
    book.add(tree);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 24, 24),
      new THREE.MeshStandardMaterial({
        color: "#fff8ee",
        emissive: "#e8b86d",
        emissiveIntensity: 0.35,
      }),
    );
    moon.position.set(0.55, 0.85, 0.15);
    book.add(moon);

    const balloon = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 20),
      new THREE.MeshStandardMaterial({ color: "#d45a3a" }),
    );
    balloon.position.set(0.15, 0.7, 0.2);
    book.add(balloon);

    const comet = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12),
      new THREE.MeshStandardMaterial({
        color: "#f6f0e4",
        emissive: "#d45a3a",
        emissiveIntensity: 0.8,
      }),
    );
    comet.position.set(-1.6, 1.5, -0.6);
    scene.add(comet);

    scene.add(book);

    const stars = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 80 }, () =>
          new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            Math.random() * 4 + 0.4,
            -2 - Math.random() * 3,
          ),
        ),
      ),
      new THREE.PointsMaterial({ color: "#f6f0e4", size: 0.03 }),
    );
    scene.add(stars);

    let raf = 0;
    let t = 0;
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const loop = () => {
      t += 0.012;
      tree.rotation.y = Math.sin(t) * 0.08;
      balloon.position.y = 0.7 + Math.sin(t * 1.4) * 0.08;
      moon.position.y = 0.85 + Math.sin(t * 0.8) * 0.04;
      comet.position.x = -1.6 + Math.sin(t * 0.4) * 0.3;
      book.rotation.y = Math.sin(t * 0.35) * 0.12;
      raf = requestAnimationFrame(loop);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-night shadow-soft ring-1 ring-white/10">
      <div ref={host} className="h-[min(52vh,480px)] w-full overflow-hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-night to-transparent p-5 pt-16">
        <p className="font-display text-xs font-medium tracking-[0.18em] text-star uppercase">
          A pop-up book for Olivia
        </p>
        <p className="mt-1 max-w-md text-sm text-cream/80">
          Pop-up stories that read themselves aloud, light up every word, and
          jump out of the page when you touch them.
        </p>
      </div>
    </div>
  );
}
