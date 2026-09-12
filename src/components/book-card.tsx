import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import type { Book } from "@/data/types";
import { coverUrl } from "@/lib/sc";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookCard({ book }: { book: Book }) {
  const lang = useApp((s) => s.lang);
  const membership = useApp((s) => s.membership);
  const locked = !book.free && membership === "none";
  return (
    <Link
      to="/stories/$slug"
      params={{ slug: book.slug }}
      className="group flex flex-col overflow-hidden rounded-xl bg-cream shadow-soft ring-1 ring-line transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
        <img
          src={coverUrl(book.slug)}
          alt=""
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-display font-medium",
            book.free ? "bg-cream/95 text-ink" : "bg-night/85 text-cream",
          )}
        >
          {book.free ? "Read for free" : locked ? "Membership" : "Unlocked"}
        </span>
        {locked && (
          <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-night/70 text-cream">
            <Lock className="size-3.5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-display text-lg font-semibold leading-snug text-ink">
          {book.title[lang]}
        </p>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
          {book.blurb[lang]}
        </p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-comet">
          Explore this story
          <ArrowRight className="size-3.5" />
        </p>
      </div>
    </Link>
  );
}
