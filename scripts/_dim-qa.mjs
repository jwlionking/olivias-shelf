import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/?book=", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => window.__storylight?.view === "shelf", { timeout: 40000 });
await page.waitForTimeout(800);

const snap = async (name) => {
  const data = await page.evaluate(() => {
    const api = window.__storylight;
    api?.step?.(16, 4);
    return api?.snap?.(0.82) || "";
  });
  if (data) {
    fs.writeFileSync(`/workspace/screenshots/${name}.jpg`, Buffer.from(data.split(",")[1], "base64"));
    console.log("wrote", name, Math.round(data.length / 1024), "KB");
  } else {
    console.log("MISS", name);
  }
};

const closedCam = async () => {
  await page.evaluate(() => {
    const api = window.__storylight;
    const { w, h } = { w: window.innerWidth, h: window.innerHeight };
    if (w < h * 1.05) api.setCamera([1.15, 2.22, 7.35], [0.18, 0.02, 0.28]);
    else api.setCamera([0.92, 2.05, 6.45], [0.12, 0.02, 0.18]);
    api.step(16, 6);
  });
};

const openCam = async () => {
  await page.evaluate(() => {
    const api = window.__storylight;
    const book = api.book;
    if (book?.opening) book.opening = null;
    if (book) book.setOpen(1);
    if (api.state) api.state.opened = true;
    if (api.state?.diorama?.setProgress) api.state.diorama.setProgress(1);
    api.updateFraming?.();
    const target = [book?.pageCenterX ?? 0.5, 0.42, -0.1];
    const dist = api.framing?.distance || 5.2;
    const len = Math.hypot(0.06, 0.63, 1);
    const pos = [
      target[0] + (0.06 / len) * dist,
      target[1] + (0.63 / len) * dist,
      target[2] + (1 / len) * dist,
    ];
    api.setCamera(pos, target);
    api.step(16, 8);
  });
};

const shelf = await page.evaluate(() => {
  const api = window.__storylight;
  return {
    view: api?.view,
    books: api?.library?.books?.slice(0, 5).map((b) => b.id),
    fov: api?.camera?.fov,
    pos: api?.camera?.position?.toArray?.(),
    exposure: api?.renderer?.toneMappingExposure,
  };
});
console.log("SHELF", JSON.stringify(shelf));
await snap("row-shelf");

const runBook = async (id, tag) => {
  await page.evaluate((book) => window.__storylight.selectBook(book), id);
  await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.book, { timeout: 50000 });
  await page.waitForTimeout(300);
  await closedCam();
  const closed = await page.evaluate(() => {
    const api = window.__storylight;
    const p = api.camera.position;
    return { id: api.bookId, fov: api.camera.fov, pos: [p.x, p.y, p.z], opened: api.state.opened };
  });
  console.log("CLOSED", JSON.stringify(closed));
  await snap(`${tag}-closed`);

  await page.evaluate(() => window.__storylight.openBook());
  await page.waitForFunction(() => window.__storylight?.state?.opened, { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(400);
  await openCam();
  const open = await page.evaluate(() => {
    const api = window.__storylight;
    return {
      id: api?.bookId,
      heading: document.getElementById("page-heading")?.textContent,
      names: api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [],
      dist: api?.framing?.distance,
      openAmt: api?.book?.openAmount,
      fov: api?.camera?.fov,
    };
  });
  console.log("OPEN", JSON.stringify(open));
  await snap(`${tag}-page1`);

  await page.evaluate(async () => {
    const api = window.__storylight;
    if (api.closeBook) await Promise.race([api.closeBook(), new Promise((r) => setTimeout(r, 5000))]);
  });
  await page.waitForFunction(() => window.__storylight?.view === "shelf", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(250);
};

await runBook("elon-physics-wonder", "elon");
await runBook("zero-and-belle", "zero");
await runBook("lila-moonlit-pony", "lila-dim");
await browser.close();
console.log("done");
