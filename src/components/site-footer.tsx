import { Link } from "@tanstack/react-router";
import { CometMark } from "@/components/comet-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CometMark className="size-8" />
          <div>
            <p className="font-display font-semibold">Olivia's Shelf</p>
            <p className="text-sm text-muted">
              Pop-up picture books painted for Olivia.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
          <Link to="/stories" className="hover:text-ink">
            Library
          </Link>
          <Link to="/pricing" className="hover:text-ink">
            Membership
          </Link>
          <Link to="/account" className="hover:text-ink">
            Parent account
          </Link>
          <Link to="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-ink">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
