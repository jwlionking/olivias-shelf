// @ts-nocheck
import { isFreeBook } from "./book-access.js";
import { readingStore } from "./reading-store.js";

export const readingEvents = new EventTarget();

const MEMBERSHIP_KEY = "storycomet-membership";

function readZustandMembership() {
  try {
    const raw = window.localStorage.getItem("storycomet-v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const plan = parsed.membership || parsed.state?.membership;
    if (plan && plan !== "none") return plan === "yearly" ? "year" : plan;
  } catch {
    /* ignore */
  }
  return null;
}

function loadMembership() {
  try {
    const raw = readingStore.getItem(MEMBERSHIP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.active && parsed.plan && parsed.plan !== "none") return parsed;
    }
  } catch {
    /* ignore */
  }
  const plan = readZustandMembership();
  if (!plan) return null;
  return {
    active: true,
    plan,
    expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
  };
}

function persistZustand(plan) {
  try {
    const raw = window.localStorage.getItem("storycomet-v1");
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.membership = plan === "year" ? "yearly" : plan;
    window.localStorage.setItem("storycomet-v1", JSON.stringify(parsed));
  } catch {
    /* ignore */
  }
}

export const readingSession = {
  user: { id: "local", name: "Parent" },
  membership: loadMembership(),
  async authorizeBook(id) {
    if (isFreeBook(id)) return true;
    if (this.membership?.active) return true;
    const error = new Error("Membership opens this book.");
    error.status = 403;
    throw error;
  },
};

export function canReadBook(id) {
  if (!id) return false;
  if (isFreeBook(id)) return true;
  return !!readingSession.membership?.active;
}

export async function requestReadingFeature() {
  return true;
}

export function remindAfterFinish() {}

export function waitForReadingProgress() {
  return Promise.resolve();
}

export function setLocalMembership(plan) {
  const normalised = plan === "yearly" ? "year" : plan;
  const membership = {
    active: true,
    plan: normalised,
    expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
  };
  readingSession.membership = membership;
  readingSession.user = readingSession.user || { id: "local", name: "Parent" };
  try {
    readingStore.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
  } catch {
    /* ignore */
  }
  persistZustand(normalised);
  readingEvents.dispatchEvent(new Event("membership-changed"));
}

export function clearLocalMembership() {
  readingSession.membership = null;
  try {
    readingStore.removeItem(MEMBERSHIP_KEY);
  } catch {
    /* ignore */
  }
  persistZustand("none");
  readingEvents.dispatchEvent(new Event("membership-changed"));
}
