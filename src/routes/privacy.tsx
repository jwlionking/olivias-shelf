import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioShell } from "@/components/folio-shell";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <FolioShell legal>
      <p>
        <Link to="/" className="ink-link">
          ← Olivia's Shelf
        </Link>
      </p>
      <header className="folio-head">
        <div className="portrait medallion" aria-hidden="true">
          <i className="icon icon-look" />
        </div>
        <div>
          <span className="eyebrow">OLIVIA'S SHELF · PRIVACY</span>
          <h2>Privacy at Olivia's Shelf</h2>
          <p className="panel-description">Effective 10 September 2026</p>
        </div>
      </header>
      <div className="folio-rule">
        <i className="icon icon-star" />
      </div>
      <div className="legal-copy">
        <p>
          Children can read and listen without creating an account. Optional
          parent profiles live on this device: nickname, avatar, reading page,
          stars, pins, points, vocabulary and quiz scores. We do not ask for a
          child’s email or photo. Birthday is optional.
        </p>
        <p>
          Guests can read the first three books. Guest progress is not a cloud
          history. Display and audio preferences stay on your device.
        </p>
        <p>
          This preview does not send reading records to a remote account. If you
          later connect a parent account, only the details you choose to save
          would be stored for that household.
        </p>
      </div>
    </FolioShell>
  );
}
