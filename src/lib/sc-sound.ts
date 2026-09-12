import { sc } from "./sc";

let muted = false;
let music: HTMLAudioElement | null = null;
let ambience: HTMLAudioElement | null = null;
let voice: HTMLAudioElement | null = null;

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  if (music) music.muted = next;
  if (ambience) ambience.muted = next;
  if (voice) voice.muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("sc-muted", next ? "1" : "0");
  }
}

export function loadMute() {
  if (typeof window === "undefined") return false;
  muted = window.localStorage.getItem("sc-muted") === "1";
  return muted;
}

export function playSfx(name: string, volume = 0.45) {
  if (muted) return;
  const url = sc(`public/audio/sfx/${name}.mp3`);
  const a = new Audio(url);
  a.volume = volume;
  a.play().catch(() => {});
}

export function playLoop(kind: "music" | "ambience", url: string, volume: number) {
  stopLoop(kind);
  if (!url) return;
  const a = new Audio(url);
  a.loop = true;
  a.volume = muted ? 0 : volume;
  a.muted = muted;
  a.play().catch(() => {});
  if (kind === "music") music = a;
  else ambience = a;
}

export function stopLoop(kind?: "music" | "ambience") {
  const stop = (el: HTMLAudioElement | null) => {
    if (!el) return;
    el.pause();
    el.src = "";
  };
  if (!kind || kind === "music") {
    stop(music);
    music = null;
  }
  if (!kind || kind === "ambience") {
    stop(ambience);
    ambience = null;
  }
}

export function playVoice(
  url: string,
  onTime?: (t: number, dur: number) => void,
  onEnd?: () => void,
) {
  stopVoice();
  if (!url) {
    onEnd?.();
    return null;
  }
  const a = new Audio(url);
  a.volume = muted ? 0 : 1;
  a.muted = muted;
  const tick = () => {
    if (voice !== a) return;
    if (!a.paused && !a.ended) onTime?.(a.currentTime, a.duration || 1);
    if (!a.ended && !a.paused) requestAnimationFrame(tick);
  };
  a.onended = () => {
    if (voice === a) voice = null;
    onEnd?.();
  };
  a.onerror = () => {
    if (voice === a) voice = null;
    onEnd?.();
  };
  a.onplay = () => requestAnimationFrame(tick);
  voice = a;
  a.play().catch(() => onEnd?.());
  return a;
}

export function stopVoice() {
  if (!voice) return;
  voice.pause();
  voice.src = "";
  voice = null;
}

export function voicePlaying() {
  return !!voice && !voice.paused;
}
