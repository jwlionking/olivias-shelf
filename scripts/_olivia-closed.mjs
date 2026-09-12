import { chromium } from "playwright";
import fs from "fs";
const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.setDefaultTimeout(60000);
await page.goto("http://127.0.0.1:8080/?book=&v=olivia3", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForFunction(() => window.__storylight?.selectBook && window.__storylight?.view === "shelf", { timeout: 45000 });
await page.evaluate(() => window.__storylight.selectBook("elon-physics-wonder"));
await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.textures?.cover, { timeout: 50000 });
await page.waitForTimeout(800);
const meta = await page.evaluate(() => {
  const api = window.__storylight;
  return {
    title: document.title,
    hero: api?.story?.hero?.name,
    blurb: (api?.story?.blurb || "").slice(0, 100),
    art: Object.keys(api?.textures?.art || {}),
    coverW: api?.textures?.cover?.image?.width,
  };
});
console.log(JSON.stringify(meta));
const data = await page.evaluate(() => window.__storylight.snap(0.78));
if (data?.startsWith("data:")) {
  fs.writeFileSync("/workspace/screenshots/elon-closed.jpg", Buffer.from(data.split(",")[1], "base64"));
  console.log("wrote elon-closed", Math.round(data.length / 1024), "KB");
}
await browser.close();
