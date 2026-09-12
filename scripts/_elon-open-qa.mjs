import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 720, height: 960 } });
page.setDefaultTimeout(40000);
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/?book=elon-physics-wonder&v=elonface2", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForFunction(() => window.__storylight?.selectBook, { timeout: 40000 });
const view = await page.evaluate(() => window.__storylight?.view);
console.log("view", view);
if (view !== "book") {
  await page.evaluate(() => window.__storylight.selectBook("elon-physics-wonder"));
  await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.book, { timeout: 40000 });
}
await page.waitForFunction(() => window.__storylight?.textures?.art?.["elon-stand"], { timeout: 30000 }).catch(() => console.log("no elon-stand yet"));
await page.evaluate(() => {
  const api = window.__storylight;
  if (api.book) { api.book.setOpen(1); api.book.opening = null; }
  if (api.state?.diorama) api.state.diorama.setProgress(1);
  if (api.setCamera) api.setCamera([0.15, 1.55, 4.2], [0.05, 0.35, 0.1]);
});
await page.waitForTimeout(400);
const open = await page.evaluate(() => {
  const api = window.__storylight;
  const art = api?.textures?.art?.["elon-stand"];
  return {
    view: api?.view,
    heading: document.getElementById("page-heading")?.textContent,
    names: api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [],
    openAmt: api?.book?.openAmount,
    elonW: art?.width || art?.texture?.image?.width || 0,
    elonFile: art?.file,
  };
});
console.log("OPEN", JSON.stringify(open));
const data = await page.evaluate(() => window.__storylight.snapLite(0.72));
if (data && data.startsWith("data:")) {
  fs.writeFileSync("/workspace/screenshots/elon-page1.jpg", Buffer.from(data.split(",")[1], "base64"));
  console.log("wrote elon-page1", Math.round(data.length / 1024), "KB");
} else console.log("MISS page1");
await browser.close();
console.log("done");
