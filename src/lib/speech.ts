import { LANG_META, type Lang } from "@/data/types";

let current: SpeechSynthesisUtterance | null = null;

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const want = LANG_META[lang].speech.toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === want) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(want.slice(0, 2))) ||
    null
  );
}

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  current = null;
}

export function speakText(opts: {
  text: string;
  lang: Lang;
  onBoundary?: (charIndex: number) => void;
  onEnd?: () => void;
}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts.onEnd?.();
    return;
  }
  stopSpeech();
  const u = new SpeechSynthesisUtterance(opts.text);
  u.lang = LANG_META[opts.lang].speech;
  u.rate = 0.92;
  u.pitch = 1.05;
  const voice = pickVoice(opts.lang);
  if (voice) u.voice = voice;
  u.onboundary = (e) => {
    if (e.name === "word" || e.charIndex >= 0) opts.onBoundary?.(e.charIndex);
  };
  u.onend = () => {
    if (current === u) current = null;
    opts.onEnd?.();
  };
  u.onerror = () => {
    if (current === u) current = null;
    opts.onEnd?.();
  };
  current = u;
  window.speechSynthesis.speak(u);
}

export function speakWord(word: string, lang: Lang) {
  speakText({ text: word, lang });
}

export function splitWords(text: string): { word: string; start: number }[] {
  const out: { word: string; start: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    out.push({ word: m[0], start: m.index });
  }
  return out;
}
