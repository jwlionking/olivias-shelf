import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
const start = Date.now();
await page.waitForFunction(() => !!window.__storylight, { timeout: 20000 }).catch(() => {});
const bootMs = Date.now() - start;
await page.waitForTimeout(1200);
const hud = await page.evaluate(() => {
  const loading = document.getElementById("loading");
  const api = window.__storylight;
  let gpu = "";
  try {
    const canvas = document.getElementById("gl");
    const gl = canvas?.getContext("webgl2") || canvas?.getContext("webgl");
    gpu = gl?.getParameter(gl.RENDERER) || "";
  } catch {
    gpu = "";
  }
  return {
    view: api?.view,
    loadingHidden: !loading || loading.hidden || loading.classList.contains("fade"),
    pick: document.body.innerText.includes("Pick a book"),
    canvas: !!document.getElementById("gl"),
    books: api?.library?.books?.length || 0,
    gpu,
  };
});
console.log("HUD", JSON.stringify({ ...hud, bootMs }, null, 2));
const snap = await page.evaluate(() => window.__storylight?.snap?.(0.72) || "");
if (snap) {
  fs.writeFileSync("/workspace/screenshots/gl-shelf.jpg", Buffer.from(snap.split(",")[1], "base64"));
  console.log("shelf snap", Math.round(snap.length / 1024), "KB");
}
await page.screenshot({ path: "/workspace/screenshots/app-live-hud.png" });
await page.evaluate(async () => {
  const api = window.__storylight;
  if (api?.selectBook) {
    await Promise.race([api.selectBook("otto-shy-moon"), new Promise((r) => setTimeout(r, 8000))]);
  }
});
await page.waitForTimeout(600);
const afterPick = await page.evaluate(() => ({
  view: window.__storylight?.view,
  openVisible: !document.getElementById("btn-open")?.hidden,
  text: (document.getElementById("loading-blurb")?.textContent || "").slice(0, 80),
}));
console.log("PICK", afterPick);
await page.evaluate(async () => {
  const api = window.__storylight;
  if (api?.openBook) {
    await Promise.race([api.openBook(), new Promise((r) => setTimeout(r, 4000))]);
  }
});
await page.waitForTimeout(900);
const afterOpen = await page.evaluate(() => ({
  view: window.__storylight?.view,
  heading: document.getElementById("page-heading")?.textContent,
  words: (document.getElementById("page-words")?.textContent || "").slice(0, 140),
  panel: !document.getElementById("text-panel")?.hidden,
  hero: !!window.__storylight?.textures?.heroGltf,
}));
console.log("OPEN", afterOpen);
const openSnap = await page.evaluate(() => window.__storylight?.snap?.(0.72) || "");
if (openSnap) {
  fs.writeFileSync("/workspace/screenshots/gl-open.jpg", Buffer.from(openSnap.split(",")[1], "base64"));
  console.log("open snap", Math.round(openSnap.length / 1024), "KB");
}
await browser.close();
