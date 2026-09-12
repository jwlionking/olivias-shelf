import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.setDefaultTimeout(60000);
await page.goto("http://127.0.0.1:8080/?book=", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForFunction(() => window.__storylight?.snap && window.__storylight?.view === "shelf", { timeout: 45000 });
console.log("on shelf");
const write = (name, data) => {
  if (data && data.startsWith("data:")) {
    fs.writeFileSync(`/workspace/screenshots/${name}.jpg`, Buffer.from(data.split(",")[1], "base64"));
    console.log("wrote", name, Math.round(data.length / 1024), "KB");
  } else console.log("MISS", name);
};
write("row-shelf", await page.evaluate(() => window.__storylight.snap(0.78)));
await page.evaluate(() => window.__storylight.selectBook("elon-physics-wonder"));
await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.book, { timeout: 50000 });
await page.evaluate(() => window.__storylight.setCamera([0.72, 2.08, 5.55], [0.12, 0.05, 0.16]));
write("elon-closed", await page.evaluate(() => window.__storylight.snap(0.78)));
await browser.close();
console.log("done");
