#!/usr/bin/env node
/**
 * Pre-render Carina narration for every nursery book page.
 * Usage: node scripts/generate-voices.mjs [--force]
 */
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BOOKS_DIR = join(ROOT, "public/books");
const VOICE = "carina";
const LANGUAGE = "en";
const CONCURRENCY = 3;
const FORCE = process.argv.includes("--force");
const API = "https://api.x.ai/v1/tts";

const MARKUP = /\{([^}:]+)(?::[^}]+)?\}/g;

function clean(text) {
  return String(text || "")
    .replace(MARKUP, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function pageText(story, pageIndex) {
  const pages = story.pages || [];
  if (pageIndex < pages.length) return clean(pages[pageIndex].text);
  const end = story.end || {};
  return clean(`${end.heading || "The End"}. ${end.text || ""} ${end.prompt || ""}`);
}

async function loadJobs() {
  const index = JSON.parse(await readFile(join(BOOKS_DIR, "index.json"), "utf8"));
  const jobs = [];
  for (const book of index.books) {
    const story = JSON.parse(await readFile(join(BOOKS_DIR, book.id, "story.json"), "utf8"));
    const count = (story.pages?.length || 0) + (story.end ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const text = pageText(story, i);
      if (!text) continue;
      jobs.push({
        id: book.id,
        page: i + 1,
        out: join(BOOKS_DIR, book.id, "voice", `page-${i + 1}.mp3`),
        text,
      });
    }
  }
  return jobs;
}

async function existsGood(path) {
  try {
    const s = await stat(path);
    return s.size > 1200;
  } catch {
    return false;
  }
}

async function synth(text) {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) throw new Error("XAI_API_KEY is missing");
  let last = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voice_id: VOICE, language: LANGUAGE }),
    });
    if (res.ok) {
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length > 1200) return bytes;
      last = new Error(`tiny audio ${bytes.length}b`);
    } else {
      last = new Error(`tts ${res.status} ${await res.text().catch(() => "")}`.slice(0, 200));
    }
    await new Promise((r) => setTimeout(r, 400 * attempt * attempt));
  }
  throw last || new Error("tts failed");
}

async function runPool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

async function main() {
  const jobs = await loadJobs();
  const chars = jobs.reduce((n, j) => n + j.text.length, 0);
  console.log(`Carina voices: ${jobs.length} pages, ${chars} chars, ~$${(chars / 1e6 * 15).toFixed(3)}`);
  let made = 0;
  let skipped = 0;
  let failed = 0;
  await runPool(jobs, CONCURRENCY, async (job) => {
    if (!FORCE && (await existsGood(job.out))) {
      skipped++;
      return;
    }
    try {
      const bytes = await synth(job.text);
      await mkdir(dirname(job.out), { recursive: true });
      await writeFile(job.out, bytes);
      made++;
      console.log(`  ${job.id} page-${job.page} ${(bytes.length / 1024).toFixed(1)}kb`);
    } catch (error) {
      failed++;
      console.error(`  FAIL ${job.id} page-${job.page}: ${error.message}`);
    }
  });
  console.log(`done made=${made} skipped=${skipped} failed=${failed}`);
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
