import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.setDefaultTimeout(60000);
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/?book=&v=elonface", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForFunction(() => window.__storylight?.snap && window.__storylight?.view === "shelf", { timeout: 45000 });
await page.waitForTimeout(800);
const write = (name, data) => {
  if (data && data.startsWith("data:")) {
    fs.writeFileSync(`/workspace/screenshots/${name}.jpg`, Buffer.from(data.split(",")[1], "base64"));
    console.log("wrote", name, Math.round(data.length / 1024), "KB");
  } else console.log("MISS", name);
};
write("row-shelf", await page.evaluate(() => window.__storylight.snap(0.78)));
const info = await page.evaluate(() => {
  const api = window.__storylight;
  const c = api?.textures?.covers?.["elon-physics-wonder"];
  return {
    books: api?.library?.books?.slice(0, 4).map((b) => b.id),
    coverW: c?.image?.width || 0,
    coverH: c?.image?.height || 0,
  };
});
console.log("SHELF", JSON.stringify(info));

await page.evaluate(() => window.__storylight.selectBook("elon-physics-wonder"));
await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.book, { timeout: 50000 });
await page.waitForTimeout(600);
write("elon-closed", await page.evaluate(() => window.__storylight.snap(0.78)));

await page.evaluate(() => window.__storylight.openBook());
await page.waitForFunction(() => (window.__storylight?.book?.openAmount || 0) > 0.85, { timeout: 20000 }).catch(() => {});
await page.evaluate(() => {
  const api = window.__storylight;
  if (api.book) {
    api.book.setOpen(1);
    api.book.opening = null;
  }
  if (api.state?.diorama) api.state.diorama.setProgress(1);
  api.updateFraming?.();
});
await page.waitForTimeout(700);
const open = await page.evaluate(() => {
  const api = window.__storylight;
  const art = api?.textures?.art?.["elon-stand"];
  return {
    heading: document.getElementById("page-heading")?.textContent,
    names: api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [],
    openAmt: api?.book?.openAmount,
    elonW: art?.texture?.image?.width || art?.width || 0,
    elonH: art?.texture?.image?.height || art?.height || 0,
  };
});
console.log("OPEN", JSON.stringify(open));
write("elon-page1", await page.evaluate(() => window.__storylight.snap(0.78)));
await browser.close();
console.log("done");
