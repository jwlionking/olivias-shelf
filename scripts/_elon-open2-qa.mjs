import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.setDefaultTimeout(50000);
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/?book=&v=elonface3", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForFunction(() => window.__storylight?.view === "shelf", { timeout: 40000 });
await page.evaluate(() => window.__storylight.selectBook("elon-physics-wonder"));
await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.textures?.art?.["elon-stand"], { timeout: 50000 });
console.log("book+art ready");
await page.evaluate(() => window.__storylight.openBook());
await page.waitForFunction(() => {
  const d = window.__storylight?.state?.diorama;
  return d && d.objects && d.objects.elon;
}, { timeout: 25000 }).catch(() => console.log("no diorama elon"));
await page.evaluate(() => {
  const api = window.__storylight;
  if (api.book) { api.book.setOpen(1); api.book.opening = null; }
  if (api.state?.diorama) api.state.diorama.setProgress(1);
  api.updateFraming?.(true);
});
await page.waitForTimeout(500);
const open = await page.evaluate(() => {
  const api = window.__storylight;
  return {
    names: api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [],
    openAmt: api?.book?.openAmount,
    elonW: api?.textures?.art?.["elon-stand"]?.width,
  };
});
console.log("OPEN", JSON.stringify(open));
const data = await page.evaluate(() => window.__storylight.snap(0.78));
if (data && data.startsWith("data:")) {
  fs.writeFileSync("/workspace/screenshots/elon-page1.jpg", Buffer.from(data.split(",")[1], "base64"));
  console.log("wrote elon-page1", Math.round(data.length / 1024), "KB");
} else console.log("MISS");
await browser.close();
console.log("done");
