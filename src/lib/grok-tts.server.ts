/**
 * Server-only Grok / xAI text-to-speech.
 * Never import this from client modules — it reads XAI_API_KEY.
 */

export const DEFAULT_GROK_VOICE = "carina";

export const GROK_VOICES = [
  { id: "carina", name: "Carina" },
  { id: "luna", name: "Luna" },
  { id: "eve", name: "Eve" },
  { id: "ara", name: "Ara" },
  { id: "iris", name: "Iris" },
  { id: "celeste", name: "Celeste" },
] as const;

const ALLOWED = new Set<string>(GROK_VOICES.map((v) => v.id));

const LEGACY_VOICE: Record<string, string> = {
  fable: "carina",
  nova: "carina",
  onyx: "carina",
  coral: "carina",
  shimmer: "carina",
  alloy: "carina",
  echo: "carina",
  sage: "luna",
  willow: "carina",
};

const MAX_CHARS = 4000;
const RATE_PER_MIN = 24;
const CACHE_LIMIT = 48;

type CacheEntry = { bytes: Uint8Array; at: number };
const cache = new Map<string, CacheEntry>();
const hits: number[] = [];
let voiceCache: { id: string; name: string }[] | null = null;

function apiKey(): string | undefined {
  const k = process.env.XAI_API_KEY?.trim();
  return k || undefined;
}

export function grokTtsAvailable(): boolean {
  return Boolean(apiKey());
}

export function resolveGrokVoice(raw?: string | null): string {
  const id = String(raw || DEFAULT_GROK_VOICE).trim().toLowerCase();
  if (LEGACY_VOICE[id]) return LEGACY_VOICE[id];
  if (ALLOWED.has(id)) return id;
  return DEFAULT_GROK_VOICE;
}

export function resolveGrokLanguage(raw?: string | null): string {
  const lang = String(raw || "en").trim().toLowerCase();
  if (lang === "es" || lang.startsWith("es-")) return lang === "es-mx" ? "es-MX" : "es-ES";
  if (lang === "zh" || lang.startsWith("zh")) return "zh";
  if (lang === "ja" || lang.startsWith("ja")) return "ja";
  if (lang === "fr" || lang.startsWith("fr")) return "fr";
  if (lang === "auto") return "auto";
  return "en";
}

function rateOk(): boolean {
  const now = Date.now();
  while (hits.length && now - hits[0] > 60_000) hits.shift();
  if (hits.length >= RATE_PER_MIN) return false;
  hits.push(now);
  return true;
}

function cacheGet(key: string): Uint8Array | null {
  const hit = cache.get(key);
  if (!hit) return null;
  cache.delete(key);
  cache.set(key, hit);
  return hit.bytes;
}

function cacheSet(key: string, bytes: Uint8Array) {
  cache.set(key, { bytes, at: Date.now() });
  while (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

export async function listGrokVoices(): Promise<{ id: string; name: string }[]> {
  if (voiceCache) return voiceCache;
  const key = apiKey();
  if (!key) return [...GROK_VOICES];
  try {
    const res = await fetch("https://api.x.ai/v1/tts/voices", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      const body = (await res.json()) as {
        voices?: { voice_id?: string; id?: string; name?: string }[];
      };
      const listed = (body.voices || [])
        .map((v) => {
          const id = String(v.voice_id || v.id || "").toLowerCase();
          return { id, name: v.name || id };
        })
        .filter((v) => ALLOWED.has(v.id));
      if (listed.length) {
        const have = new Set(listed.map((v) => v.id));
        voiceCache = [
          ...GROK_VOICES.filter((v) => have.has(v.id) || v.id === DEFAULT_GROK_VOICE),
        ];
        return voiceCache;
      }
    }
  } catch {
    /* fall through */
  }
  voiceCache = [...GROK_VOICES];
  return voiceCache;
}

export async function synthesizeGrokSpeech(opts: {
  text: string;
  voice?: string | null;
  language?: string | null;
}): Promise<{ bytes: Uint8Array; voice: string; language: string }> {
  const key = apiKey();
  if (!key) {
    const err = new Error("Grok voice is not configured");
    (err as Error & { status: number }).status = 503;
    throw err;
  }
  const text = String(opts.text || "").trim();
  if (!text) {
    const err = new Error("Nothing to read");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  if (text.length > MAX_CHARS) {
    const err = new Error("That page is too long to read aloud");
    (err as Error & { status: number }).status = 400;
    throw err;
  }
  const voice = resolveGrokVoice(opts.voice);
  const language = resolveGrokLanguage(opts.language);
  const cacheKey = `${voice}:${language}:${text}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { bytes: cached, voice, language };
  if (!rateOk()) {
    const err = new Error("The storyteller is catching her breath. Try again in a moment.");
    (err as Error & { status: number }).status = 429;
    throw err;
  }
  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice_id: voice, language }),
  });
  if (!res.ok) {
    const err = new Error(`Grok voice failed (${res.status})`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength < 800) {
    const err = new Error("Grok voice returned empty audio");
    (err as Error & { status: number }).status = 502;
    throw err;
  }
  cacheSet(cacheKey, bytes);
  return { bytes, voice, language };
}
