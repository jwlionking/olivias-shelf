import { chromium } from "playwright";
import fs from "fs";

const url = "http://127.0.0.1:8080/?book=";
const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => window.__storylight?.view === "shelf", { timeout: 25000 });
await page.waitForTimeout(1200);
const snap = async (name) => {
  const data = await page.evaluate(() => window.__storylight?.snap?.(0.78) || "");
  if (data) fs.writeFileSync(`/workspace/screenshots/${name}.jpg`, Buffer.from(data.split(",")[1], "base64"));
};
await snap("lila-lit-shelf");
await page.evaluate(() => window.__storylight.selectBook("lila-moonlit-pony"));
await page.waitForFunction(() => {
  const api = window.__storylight;
  return api?.view === "book" && api?.book?.materials?.coverArt?.map;
}, { timeout: 40000 });
await page.waitForTimeout(500);
await snap("lila-lit-closed");
await page.evaluate(() => window.__storylight.openBook());
await page.waitForFunction(() => {
  const api = window.__storylight;
  const names = api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [];
  return api?.state?.opened && (api?.book?.openAmount || 0) > 0.85 && names.includes("lila");
}, { timeout: 20000 }).catch(() => {});
await page.evaluate(() => {
  const api = window.__storylight;
  if (api.book) api.book.setOpen(1);
  if (api.state.diorama) api.state.diorama.setProgress(1);
  api.updateFraming?.();
});
await page.waitForTimeout(400);
await snap("lila-lit-page1");
const info = await page.evaluate(() => {
  const api = window.__storylight;
  return {
    view: api?.view,
    opened: api?.state?.opened,
    openAmt: api?.book?.openAmount,
    heading: document.getElementById("page-heading")?.textContent,
    names: api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [],
  };
});
console.log(JSON.stringify(info));
await browser.close();
