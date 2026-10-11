import { readFile, writeFile, mkdir } from "node:fs/promises";
const B = "public/books/olivia-costume-memory";
const s = JSON.parse(await readFile(`${B}/story.json`, "utf8"));
await mkdir(`${B}/quiz`, { recursive: true });
const jobs = [];
s.quiz.questions.forEach((q, i) => {
  const opts = q.options.map((o) => o.label);
  jobs.push([`q${i + 1}`, `${q.q} ${opts.slice(0, -1).join(", ")}, or ${opts.at(-1)}?`], [`r${i + 1}`, q.right], [`w${i + 1}`, q.wrong]);
});
for (const [name, text] of jobs) {
  const res = await fetch("https://api.x.ai/v1/tts", { method: "POST", headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ text, voice_id: "carina", language: "en" }) });
  if (!res.ok) { console.log("FAIL", name, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer()); await writeFile(`${B}/quiz/${name}.mp3`, buf); console.log(name, buf.length);
}
