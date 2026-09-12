import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FolioShell } from "@/components/folio-shell";
import { PINS } from "@/data/pins";
import { BOOKS } from "@/data/books";
import { useApp, type ReaderAvatar } from "@/lib/store";

export const Route = createFileRoute("/account")({ component: Account });

const AVATARS: ReaderAvatar[] = [
  "balloon",
  "kite",
  "fish",
  "fox",
  "crane",
  "mouse",
];

const avatarLabel: Record<ReaderAvatar, string> = {
  balloon: "Balloon",
  kite: "Kite",
  fish: "Lantern fish",
  fox: "Fox kit",
  crane: "Crane",
  mouse: "Tooth mouse",
};

function Account() {
  const readers = useApp((s) => s.readers);
  const addReader = useApp((s) => s.addReader);
  const removeReader = useApp((s) => s.removeReader);
  const active = useApp((s) => s.activeReaderId);
  const setActive = useApp((s) => s.setActiveReader);
  const pins = useApp((s) => s.pins);
  const points = useApp((s) => s.points);
  const vocab = useApp((s) => s.vocab);
  const membership = useApp((s) => s.membership);
  const progress = useApp((s) => s.progress);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<ReaderAvatar>("balloon");

  const readerKey = active ?? "guest";
  const booksDone = Object.values(progress[readerKey] ?? {}).filter(
    (p) => p.completed,
  ).length;

  return (
    <FolioShell>
      <header className="folio-head">
        <div className="portrait medallion" aria-hidden="true">
          <i className="icon icon-account" />
        </div>
        <div>
          <span className="eyebrow">OLIVIA'S SHELF · PARENT ACCOUNT</span>
          <h2>Your reading account</h2>
          <p className="panel-description">
            For parents and grown-ups. The first three books are free. Add
            readers, collect pins, and keep progress on this device.
          </p>
        </div>
      </header>
      <div className="folio-rule">
        <i className="icon icon-star" />
      </div>
      <ul className="folio-benefits two-up">
        <li>
          <span className="row-icon">
            <i className="icon icon-book" aria-hidden="true" />
          </span>
          <span>
            <b>Track your progress</b>
            <small>
              {booksDone} of {BOOKS.length} books finished
            </small>
          </span>
        </li>
        <li>
          <span className="row-icon">
            <i className="icon icon-moon" aria-hidden="true" />
          </span>
          <span>
            <b>Add your kids</b>
            <small>{readers.length} reader{readers.length === 1 ? "" : "s"}</small>
          </span>
        </li>
        <li>
          <span className="row-icon">
            <i className="icon icon-star" aria-hidden="true" />
          </span>
          <span>
            <b>Collect pins</b>
            <small>
              {pins.length} of {PINS.length} · {points} points
            </small>
          </span>
        </li>
        <li>
          <span className="row-icon">
            <i className="icon icon-magic" aria-hidden="true" />
          </span>
          <span>
            <b>Remembered words</b>
            <small>{vocab.length} kept</small>
          </span>
        </li>
      </ul>
      <p className="status-line">
        Membership:{" "}
        {membership === "none"
          ? "free stories"
          : membership === "yearly"
            ? "a year of wonder"
            : "lifetime"}
        {" · "}
        <Link to="/pricing" className="ink-link">
          Explore membership →
        </Link>
      </p>

      <p className="folio-section" style={{ marginTop: 18 }}>
        <i className="icon icon-moon" /> Readers
      </p>
      <div className="reader-picks">
        <button
          type="button"
          className="reader-chip"
          aria-pressed={!active}
          onClick={() => setActive(null)}
        >
          Guest
        </button>
        {readers.map((r) => (
          <button
            key={r.id}
            type="button"
            className="reader-chip"
            aria-pressed={active === r.id}
            onClick={() => setActive(r.id)}
          >
            {r.nickname}
            <span
              aria-hidden="true"
              onClick={(e) => {
                e.stopPropagation();
                removeReader(r.id);
              }}
            >
              ×
            </span>
          </button>
        ))}
      </div>

      <form
        className="folio-form"
        onSubmit={(e) => {
          e.preventDefault();
          const nickname = name.trim();
          if (!nickname) return;
          addReader({ nickname, avatar });
          setName("");
        }}
      >
        <label htmlFor="reader-name">Add a reader</label>
        <input
          id="reader-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="A nickname"
          maxLength={24}
        />
        <div className="reader-picks" role="radiogroup" aria-label="Avatar">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              className="reader-chip"
              aria-pressed={avatar === a}
              onClick={() => setAvatar(a)}
            >
              {avatarLabel[a]}
            </button>
          ))}
        </div>
        <div className="panel-actions">
          <button className="pill-button tall" type="submit">
            <i className="icon icon-magic" />
            <span>Add reader</span>
          </button>
        </div>
      </form>
      <p className="status-line">
        <Link to="/privacy" className="ink-link">
          Privacy
        </Link>
        {" · "}
        <Link to="/terms" className="ink-link">
          Terms
        </Link>
      </p>
    </FolioShell>
  );
}
