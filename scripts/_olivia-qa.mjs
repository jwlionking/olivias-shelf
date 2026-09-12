import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.setDefaultTimeout(50000);
const gotoShelf = async () => {
  await page.goto("http://127.0.0.1:8080/?book=&v=olivia2", { waitUntil: "domcontentloaded", timeout: 40000 });
  await page.waitForFunction(() => window.__storylight?.snap && window.__storylight?.view === "shelf", { timeout: 45000 });
  await page.waitForTimeout(1200);
};
await gotoShelf();
const write = (name, data) => {
  if (data && data.startsWith("data:")) {
    fs.writeFileSync(`/workspace/screenshots/${name}.jpg`, Buffer.from(data.split(",")[1], "base64"));
    console.log("wrote", name, Math.round(data.length / 1024), "KB");
  } else console.log("MISS", name);
};
try {
  const title = await page.title();
  const eyebrow = await page.evaluate(() => document.querySelector(".eyebrow")?.textContent?.trim());
  console.log("title", title, "eyebrow", eyebrow);
} catch {
  console.log("reload, retrying");
  await gotoShelf();
  console.log("title", await page.title());
}
write("row-shelf", await page.evaluate(() => window.__storylight.snap(0.78)));
await page.evaluate(() => window.__storylight.selectBook("elon-physics-wonder"));
await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.book, { timeout: 50000 });
await page.waitForTimeout(900);
const meta = await page.evaluate(() => {
  const api = window.__storylight;
  return {
    heading: document.getElementById("page-heading")?.textContent,
    hero: api?.story?.hero?.name,
    blurb: (api?.story?.blurb || "").slice(0, 90),
    art: Object.keys(api?.textures?.art || {}),
    coverW: api?.textures?.cover?.image?.width,
  };
});
console.log("BOOK", JSON.stringify(meta));
write("elon-closed", await page.evaluate(() => window.__storylight.snap(0.78)));
await browser.close();
console.log("done");
