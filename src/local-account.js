// @ts-nocheck
import { readingEvents, readingSession, setLocalMembership } from "./reading-session.js";

function sparkleAt(el, n = 18) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  window.dispatchEvent(
    new CustomEvent("storycomet:sparkle", {
      detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, n, kind: 2 },
    }),
  );
}

function membershipLine() {
  const m = readingSession.membership;
  if (!m || !m.active) return "The first three books are free on this device.";
  if (m.plan === "lifetime") return "Lifetime membership on this device.";
  return "Yearly membership on this device.";
}

function refreshAccountPanel() {
  const out = document.getElementById("account-signed-out");
  const inn = document.getElementById("account-signed-in");
  const identity = document.getElementById("account-identity");
  const membership = document.getElementById("account-membership");
  const intro = document.getElementById("account-intro");
  if (out) out.hidden = true;
  if (inn) inn.hidden = false;
  if (identity) identity.textContent = "Reading on this device";
  if (membership) membership.textContent = membershipLine();
  if (intro) {
    intro.textContent =
      "For parents and grown-ups. The first three books are free. Progress, pins and quizzes stay on this device.";
  }
}

async function paintSignSkies() {
  const canvases = document.querySelectorAll("canvas.sign-sky");
  for (const canvas of canvases) {
    const src = canvas.getAttribute("data-sky");
    if (!src) continue;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await img.decode();
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      const w = Math.max(2, canvas.clientWidth || 280);
      const h = Math.max(2, canvas.clientHeight || 360);
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch {
      /* decorative */
    }
  }
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  try {
    if (!dialog.open) dialog.showModal();
  } catch {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  try {
    dialog.close();
  } catch {
    dialog.removeAttribute("open");
  }
}

export function wireLocalAccount() {
  if (window.__scAccountWired) {
    refreshAccountPanel();
    return;
  }
  window.__scAccountWired = true;

  const google = document.getElementById("account-google");
  if (google) {
    const label = google.querySelector("span:last-child");
    if (label) label.textContent = "Continue on this device";
    google.addEventListener("click", (event) => {
      event.preventDefault();
      refreshAccountPanel();
      sparkleAt(google);
    });
  }

  const emailForm = document.getElementById("account-email-form");
  if (emailForm) {
    emailForm.addEventListener("submit", (event) => {
      event.preventDefault();
      refreshAccountPanel();
    });
  }

  const open = document.getElementById("account-open");
  if (open) {
    open.addEventListener("click", (event) => {
      event.preventDefault();
      openDialog("account-dialog");
    });
  }
  const close = document.getElementById("account-close");
  if (close) close.addEventListener("click", () => closeDialog("account-dialog"));

  const journey = document.getElementById("account-journey");
  if (journey) {
    journey.addEventListener("click", () => {
      closeDialog("account-dialog");
      window.location.assign("/account");
    });
  }

  const signOut = document.getElementById("account-sign-out");
  if (signOut) {
    signOut.addEventListener("click", () => closeDialog("account-dialog"));
  }

  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const plan = button.getAttribute("data-plan") === "year" ? "year" : "lifetime";
      setLocalMembership(plan);
      sparkleAt(button, 28);
      closeDialog("pricing-dialog");
      refreshAccountPanel();
    });
  });

  document.querySelectorAll('#sc-root a[href="/pricing"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeDialog("account-dialog");
      openDialog("pricing-dialog");
      paintSignSkies();
    });
  });

  readingEvents.addEventListener("membership-changed", refreshAccountPanel);
  refreshAccountPanel();
  paintSignSkies();
}
