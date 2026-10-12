// Quiz voice clips (Carina) for every book that has quiz questions but no quiz/ folder yet.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
const idx = JSON.parse(await readFile("public/books/index.json", "utf8"));
let chars = 0, made = 0;
for (const b of idx.books) {
  const B = `public/books/${b.id}`;
  if (existsSync(`${B}/quiz`)) continue;
  const s = JSON.parse(await readFile(`${B}/story.json`, "utf8"));
  const qs = (s.quiz && s.quiz.questions) || []; if (!qs.length) continue;
  await mkdir(`${B}/quiz`, { recursive: true });
  const jobs = [];
  qs.forEach((q, i) => {
    const opts = q.options.map((o) => (typeof o === "string" ? o : o.label || o.word)).filter(Boolean);
    jobs.push([`q${i + 1}`, opts.length > 1 ? `${q.q} ${opts.slice(0, -1).join(", ")}, or ${opts.at(-1)}?` : q.q]);
    if (q.right) jobs.push([`r${i + 1}`, q.right]);
    if (q.wrong) jobs.push([`w${i + 1}`, q.wrong]);
  });
  for (const [name, text] of jobs) {
    const res = await fetch("https://api.x.ai/v1/tts", { method: "POST", headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ text, voice_id: "carina", language: "en" }) });
    if (!res.ok) { console.log("FAIL", b.id, name, res.status, (await res.text()).slice(0, 160)); if ([401, 402, 403, 429].includes(res.status)) { console.log("STOPPING (credits/auth)"); process.exit(3); } continue; }
    await writeFile(`${B}/quiz/${name}.mp3`, Buffer.from(await res.arrayBuffer())); chars += text.length; made++;
  }
  console.log(b.id, "clips", jobs.length, "chars so far", chars);
}
console.log("DONE made", made, "chars", chars, "est $", (chars * 15 / 1e6).toFixed(3));
