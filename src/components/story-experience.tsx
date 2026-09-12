import { useEffect } from "react";
import hud from "@/hud.html?raw";
import { BRAND } from "@/lib/sc";
import "@/styles/storylight/fonts.css";
import "@/styles/storylight/style.css";
import "@/styles/storylight/brand.css";
import "@/styles/storylight/account.css";
import "@/styles/storylight/family.css";

type Engine = {
  bootStoryComet: (opts?: { book?: string }) => Promise<void>;
};

function ensureHud() {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("sc-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "sc-root";
    root.innerHTML = hud;
    document.body.appendChild(root);
  }
  root.hidden = false;
  const sparkles = document.getElementById("sparkles");
  if (sparkles) sparkles.hidden = false;
  return root;
}

function revealHud() {
  document.body.classList.add("sc-live");
  const root = document.getElementById("sc-root");
  if (root) root.hidden = false;
  const sparkles = document.getElementById("sparkles");
  if (sparkles) sparkles.hidden = false;
}

type StorylightApi = {
  resize?: () => void;
};

type Props = { initialBook?: string };

export function StoryExperience({ initialBook }: Props) {
  if (typeof document !== "undefined") {
    document.body.classList.add("sc-live");
    if (initialBook) document.body.dataset.book = initialBook;
    else delete document.body.dataset.book;
    ensureHud();
  }

  useEffect(() => {
    document.body.classList.add("sc-live");
    if (initialBook) document.body.dataset.book = initialBook;
    else delete document.body.dataset.book;
    ensureHud();

    let cancelled = false;
    void (async () => {
      const mod = (await import("@/main.js")) as unknown as Engine;
      if (cancelled) return;
      await mod.bootStoryComet({ book: initialBook });
      const api = (window as unknown as { __storylight?: StorylightApi }).__storylight;
      api?.resize?.();
    })();

    return () => {
      cancelled = true;
      requestAnimationFrame(() => {
        if (document.querySelector("[data-sc-experience]")) {
          revealHud();
          return;
        }
        document.body.classList.remove("sc-live");
        delete document.body.dataset.book;
        const root = document.getElementById("sc-root");
        if (root) root.hidden = true;
        const sparkles = document.getElementById("sparkles");
        if (sparkles) sparkles.hidden = true;
      });
    };
  }, [initialBook]);

  return (
    <div data-sc-experience="" className="sc-boot" aria-label="Opening Olivia's Shelf">
      <div className="loading-sky" aria-hidden="true">
        <div className="loading-veil" />
        <div className="loading-moon painted">
          <img src={BRAND.moon} alt="" />
        </div>
        <div className="loading-stars" />
      </div>
      <section className="loading-card draw">
        <i className="corner tl" aria-hidden="true" />
        <i className="corner tr" aria-hidden="true" />
        <i className="corner bl" aria-hidden="true" />
        <i className="corner br" aria-hidden="true" />
        <span className="eyebrow">A POP-UP BOOK FOR OLIVIA</span>
        <h1>
          <span className="storycomet-logo loading-brand" role="img" aria-label="Olivia's Shelf">
            <img className="logo-symbol" src={BRAND.symbol} alt="" width={256} height={200} />
            <img
              className="logo-wordmark"
              src="/brand-wordmark-ink.png"
              alt=""
              width={800}
              height={120}
            />
          </span>
          <i className="quill" aria-hidden="true">
            🪶
          </i>
        </h1>
        <p className="loading-blurb">
          Pop-up stories that read themselves aloud, light up every word, and jump
          out of the page when you touch them.
          <i className="quill" aria-hidden="true">
            🪶
          </i>
        </p>
        <div className="loading-progress" role="progressbar" aria-label="Loading the book">
          <i />
        </div>
        <p className="sc-ssr-copy">Fluffing the clouds…</p>
        <p className="loading-footnote">Best with sound on · Touch everything</p>
      </section>
    </div>
  );
}
