import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioShell } from "@/components/folio-shell";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <FolioShell legal>
      <p>
        <Link to="/" className="ink-link">
          ← Olivia's Shelf
        </Link>
      </p>
      <header className="folio-head">
        <div className="portrait medallion" aria-hidden="true">
          <i className="icon icon-book" />
        </div>
        <div>
          <span className="eyebrow">OLIVIA'S SHELF · TERMS</span>
          <h2>Using Olivia's Shelf</h2>
          <p className="panel-description">Effective 10 September 2026</p>
        </div>
      </header>
      <div className="folio-rule">
        <i className="icon icon-star" />
      </div>
      <div className="legal-copy">
        <p>
          You can read the first three books without an account. Optional
          accounts are for parents and other adults. Use the app for personal
          reading and learning.
        </p>
        <p>
          Early-bird prices shown are US$39 per year or US$79 for lifetime.
          Standard prices are US$79 per year and US$149. This preview unlocks
          membership on your device only and does not process card payments.
        </p>
        <p>
          Books, artwork, narration and software may be subject to copyright.
          Access does not transfer ownership.
        </p>
      </div>
    </FolioShell>
  );
}
