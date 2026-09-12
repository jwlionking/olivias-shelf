import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--disable-gpu", "--use-gl=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1032, height: 1376 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/?book=", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForFunction(() => window.__storylight?.view === "shelf", { timeout: 25000 });
await page.waitForTimeout(1500);
const snap = async (name) => {
  const data = await page.evaluate(() => window.__storylight?.snap?.(0.78) || "");
  if (data) {
    fs.writeFileSync(`/workspace/screenshots/${name}.jpg`, Buffer.from(data.split(",")[1], "base64"));
    console.log("wrote", name, Math.round(data.length / 1024), "KB");
  }
};
const info = await page.evaluate(() => {
  const api = window.__storylight;
  return {
    view: api?.view,
    books: api?.library?.books?.slice(0, 4).map((b) => b.id),
    covers: ["lila-moonlit-pony", "elon-physics-wonder", "zero-and-belle"].map((id) => ({
      id,
      w: api?.textures?.covers?.[id]?.image?.width || 0,
    })),
    dist: api?.framing?.distance,
  };
});
console.log("SHELF", JSON.stringify(info));
await snap("row-shelf");

const openBook = async (id, tag) => {
  await page.evaluate((book) => window.__storylight.selectBook(book), id);
  await page.waitForFunction(() => window.__storylight?.view === "book" && window.__storylight?.book, { timeout: 40000 });
  await page.waitForTimeout(400);
  await snap(`${tag}-closed`);
  await page.evaluate(() => window.__storylight.openBook());
  await page.waitForFunction(() => window.__storylight?.state?.opened && (window.__storylight?.book?.openAmount || 0) > 0.8, { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => {
    const api = window.__storylight;
    if (api.book) api.book.setOpen(1);
    if (api.state.diorama) api.state.diorama.setProgress(1);
    api.updateFraming?.();
  });
  await page.waitForTimeout(500);
  const open = await page.evaluate(() => {
    const api = window.__storylight;
    return {
      id: api?.bookId,
      heading: document.getElementById("page-heading")?.textContent,
      names: api?.state?.diorama ? Object.keys(api.state.diorama.objects) : [],
      dist: api?.framing?.distance,
      openAmt: api?.book?.openAmount,
    };
  });
  console.log("OPEN", JSON.stringify(open));
  await snap(`${tag}-page1`);
  await page.evaluate(async () => {
    const api = window.__storylight;
    if (api.closeBook) await Promise.race([api.closeBook(), new Promise((r) => setTimeout(r, 4000))]);
  });
  await page.waitForFunction(() => window.__storylight?.view === "shelf", { timeout: 15000 }).catch(() => {});
};

await openBook("elon-physics-wonder", "elon");
await openBook("zero-and-belle", "zero");
await browser.close();
