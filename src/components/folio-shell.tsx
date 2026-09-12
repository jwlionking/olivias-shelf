import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BRAND } from "@/lib/sc";
import "@/styles/storylight/fonts.css";
import "@/styles/storylight/style.css";
import "@/styles/storylight/brand.css";
import "@/styles/storylight/folio-page.css";

type Props = {
  children: React.ReactNode;
  wide?: boolean;
  legal?: boolean;
};

export function FolioShell({ children, wide, legal }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shellClass = [
    "panel-shell folio-dialog",
    wide ? "pricing-wide" : "",
    legal ? "legal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    document.body.classList.remove("sc-live");
    const root = document.getElementById("sc-root");
    if (root) root.hidden = true;
    const sparkles = document.getElementById("sparkles");
    if (sparkles) sparkles.hidden = true;
  }, []);

  return (
    <div className="folio-page">
      <div className="folio-sky" aria-hidden="true">
        <div className="folio-stars" />
        <div className="folio-moon">
          <img src={BRAND.moon} alt="" />
        </div>
      </div>
      <header className="sc-nav">
        <Link to="/" className="storycomet-logo" aria-label="Olivia's Shelf home">
          <img className="logo-symbol" src={BRAND.symbol} alt="" width={256} height={200} />
          <span className="logo-wordmark font-display text-xl font-semibold tracking-tight">Olivia's Shelf</span>
        </Link>
        <nav className="sc-nav-links">
          <Link to="/" aria-current={pathname === "/" ? "page" : undefined}>
            Books
          </Link>
          <Link
            to="/pricing"
            aria-current={pathname === "/pricing" ? "page" : undefined}
          >
            Membership
          </Link>
          <Link
            to="/account"
            className="round-button"
            aria-label="Parent account"
            aria-current={pathname === "/account" ? "page" : undefined}
            style={{ width: 48, height: 48 }}
          >
            <i className="icon icon-account" />
          </Link>
        </nav>
      </header>
      <main className="folio-main">
        <section className={shellClass}>
          <i className="corner tl" aria-hidden="true" />
          <i className="corner tr" aria-hidden="true" />
          <i className="corner bl" aria-hidden="true" />
          <i className="corner br" aria-hidden="true" />
          {children}
        </section>
      </main>
      <footer className="sc-foot">
        <p>Interactive picture books that read themselves aloud.</p>
        <div className="sc-foot-links">
          <Link to="/pricing">Membership</Link>
          <Link to="/account">Parent account</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
