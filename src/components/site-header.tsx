import { Link, useRouterState } from "@tanstack/react-router";
import { BRAND } from "@/lib/sc";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/stories", label: "Library" },
  { to: "/pricing", label: "Membership" },
];

export function SiteHeader({ night = false }: { night?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md",
        night
          ? "border-white/10 bg-night/80 text-cream"
          : "border-line/70 bg-paper/85 text-ink",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Olivia's Shelf home">
          <img src={BRAND.symbol} alt="" className="h-8 w-auto" />
          <span className="font-display text-lg font-semibold tracking-tight">Olivia's Shelf</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-full px-2.5 py-2 text-sm font-medium sm:px-3",
                l.to === "/" && "hidden sm:inline",
                pathname === l.to
                  ? night
                    ? "bg-white/12 text-cream"
                    : "bg-paper-2 text-ink"
                  : night
                    ? "text-cream/70 hover:text-cream"
                    : "text-ink-soft hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/account"
            className={cn(
              "ml-1 inline-flex size-10 items-center justify-center rounded-full",
              night ? "bg-white/10" : "bg-paper-2",
            )}
            aria-label="Parent account"
          >
            <img src={scIcon()} alt="" className="size-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function scIcon() {
  return BRAND.symbol;
}
