import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FolioShell } from "@/components/folio-shell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/pricing")({ component: Pricing });

function Pricing() {
  const membership = useApp((s) => s.membership);
  const setMembership = useApp((s) => s.setMembership);
  const navigate = useNavigate();

  function choose(plan: "yearly" | "lifetime") {
    setMembership(plan);
    navigate({ to: "/" });
  }

  return (
    <FolioShell wide>
      <header className="folio-head">
        <div className="portrait medallion" aria-hidden="true">
          <i className="icon icon-magic" />
        </div>
        <div>
          <span className="eyebrow">OLIVIA'S SHELF · EARLY-BIRD PRICING</span>
          <h2>A little more wonder</h2>
          <p className="panel-description">
            A whole world of stories: every book on the shelf, in every language.
            Choose yearly Olivia's Shelf membership, or make room for stories for a
            lifetime.
          </p>
        </div>
      </header>
      <div className="folio-rule">
        <i className="icon icon-star" />
      </div>
      {membership !== "none" && (
        <p className="status-line">
          You already have {membership} membership on this device. Every book is
          open.
        </p>
      )}
      <div className="plan-stage">
        <div className="plan-grid">
          <div className="plan-hang">
            <img
              className="sign-hook"
              src="/sc/public/ui/wood-sign/hook.808e94015a3cc08d.webp"
              alt=""
              aria-hidden="true"
            />
            <article className="plan-card">
              <img
                className="sign-rope"
                src="/sc/public/ui/wood-sign/rope.efc0c56a4955b8f2.webp"
                alt=""
                aria-hidden="true"
              />
              <div className="sign-sky" aria-hidden="true" />
              <div className="sign-aurora" aria-hidden="true" />
              <img
                className="sign-charm sign-comet"
                src="/sc/public/ui/wood-sign/comet.9da8ed168491ae3a.webp"
                alt=""
                aria-hidden="true"
              />
              <div className="sign-face">
                <span className="eyebrow">A YEAR OF WONDER</span>
                <h3>Yearly</h3>
                <p className="plan-price">
                  <strong>$39</strong>
                  <span>per year · USD</span>
                </p>
                <p className="plan-saving">
                  Standard <s>$79</s> · Save $40
                </p>
                <ul>
                  <li>A whole year of stories</li>
                  <li>Renews yearly · Cancel anytime</li>
                  <li>Stays with your account</li>
                </ul>
                <button
                  className="pill-button small wood"
                  type="button"
                  onClick={() => choose("yearly")}
                >
                  Choose yearly
                </button>
              </div>
            </article>
          </div>
          <div className="plan-hang">
            <img
              className="sign-hook"
              src="/sc/public/ui/wood-sign/hook.808e94015a3cc08d.webp"
              alt=""
              aria-hidden="true"
            />
            <article className="plan-card plan-lifetime">
              <img
                className="sign-rope"
                src="/sc/public/ui/wood-sign/rope.efc0c56a4955b8f2.webp"
                alt=""
                aria-hidden="true"
              />
              <div className="sign-sky" aria-hidden="true" />
              <div className="sign-aurora" aria-hidden="true" />
              <img
                className="sign-charm sign-crescent"
                src="/sc/public/ui/wood-sign/crescent.e16f323c94bfad86.webp"
                alt=""
                aria-hidden="true"
              />
              <div className="sign-face">
                <span className="eyebrow">KEEP THE WONDER</span>
                <h3>Lifetime</h3>
                <p className="plan-price">
                  <strong>$79</strong>
                  <span>one payment · USD</span>
                </p>
                <p className="plan-saving">
                  Standard <s>$149</s> · Save $70
                </p>
                <ul>
                  <li>Every book, forever</li>
                  <li>One payment, no bills</li>
                  <li>Stays with your account</li>
                </ul>
                <button
                  className="pill-button small wood"
                  type="button"
                  onClick={() => choose("lifetime")}
                >
                  Choose lifetime
                </button>
              </div>
            </article>
          </div>
        </div>
        <div className="plan-shelf" aria-hidden="true" />
      </div>
      <p className="status-line">
        For parents and grown-ups · This preview unlocks books on this device ·
        Prices in USD · <Link to="/terms">All the details</Link>
      </p>
    </FolioShell>
  );
}
