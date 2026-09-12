import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Star,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PopupScene } from "@/components/popup-scene";
import type { Book, Lang } from "@/data/types";
import { LANGS, LANG_META } from "@/data/types";
import { speakText, speakWord, splitWords, stopSpeech } from "@/lib/speech";
import { useApp, useReaderProgress } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReaderView({ book }: { book: Book }) {
  const navigate = useNavigate();
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const setPage = useApp((s) => s.setPage);
  const starPage = useApp((s) => s.starPage);
  const completeBook = useApp((s) => s.completeBook);
  const addPin = useApp((s) => s.addPin);
  const addVocab = useApp((s) => s.addVocab);
  const bumpTap = useApp((s) => s.bumpTap);
  const taps = useApp((s) => s.taps);
  const vocab = useApp((s) => s.vocab);
  const progress = useReaderProgress(book.slug);
  const [page, setLocal] = useState(progress.page);
  const [playing, setPlaying] = useState(false);
  const [activeChar, setActiveChar] = useState(-1);
  const [langsUsed, setLangsUsed] = useState<Set<Lang>>(new Set([lang]));

  const pageData = book.pages[page];
  const text = pageData.text[lang];
  const words = useMemo(() => splitWords(text), [text]);
  const starred = progress.stars.includes(page);
  const last = page === book.pages.length - 1;

  useEffect(() => {
    addPin("first-page");
    setPage(book.slug, page);
    return () => stopSpeech();
  }, [book.slug, page, addPin, setPage]);

  useEffect(() => {
    if (pageData.vocab) {
      addVocab(
        book.slug,
        pageData.vocab.word,
        pageData.vocab.meaning[lang],
      );
    }
  }, [pageData, book.slug, lang, addVocab]);

  useEffect(() => {
    if (taps >= 20) addPin("tap-twenty");
    if (vocab.length >= 5) addPin("word-box");
  }, [taps, vocab.length, addPin]);

  function go(next: number) {
    stopSpeech();
    setPlaying(false);
    setActiveChar(-1);
    setLocal(Math.max(0, Math.min(book.pages.length - 1, next)));
  }

  function play() {
    if (playing) {
      stopSpeech();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    setActiveChar(0);
    speakText({
      text,
      lang,
      onBoundary: (i) => setActiveChar(i),
      onEnd: () => {
        setPlaying(false);
        setActiveChar(-1);
        if (!last) go(page + 1);
      },
    });
  }

  function finish() {
    completeBook(book.slug);
    if (book.slug === "otto-shy-moon") addPin("night-light");
    if (book.slug === "nia-runaway-kite") addPin("wind-friend");
    if (book.slug === "fin-glowing-sea") addPin("deep-diver");
    if (progress.stars.length + (starred ? 0 : 1) >= 20) addPin("star-catcher");
    navigate({ to: "/quiz/$slug", params: { slug: book.slug } });
  }

  function changeLang(next: Lang) {
    stopSpeech();
    setPlaying(false);
    setLang(next);
    const used = new Set(langsUsed);
    used.add(next);
    setLangsUsed(used);
    if (used.size >= 2) addPin("polyglot");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-night text-cream">
      <header className="flex items-center gap-2 px-3 py-3 sm:px-5">
        <Link
          to="/stories/$slug"
          params={{ slug: book.slug }}
          className="grid size-11 place-items-center rounded-full bg-white/8"
          aria-label="Close reader"
        >
          <X className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold">
            {book.title[lang]}
          </p>
          <p className="text-xs text-cream/60">
            Page {page + 1} of {book.pages.length}
          </p>
        </div>
        <label className="sr-only" htmlFor="lang">
          Language
        </label>
        <select
          id="lang"
          value={lang}
          onChange={(e) => changeLang(e.target.value as Lang)}
          className="h-11 rounded-full border border-white/10 bg-white/8 px-3 text-sm text-cream"
        >
          {LANGS.map((l) => (
            <option key={l} value={l} className="text-ink">
              {LANG_META[l].native}
            </option>
          ))}
        </select>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-4 px-3 pb-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <PopupScene
          scene={book.scene}
          page={page}
          onTap={() => {
            bumpTap();
            useApp.getState().addPoints(1);
          }}
        />

        <div className="flex flex-col rounded-xl bg-paper p-5 text-ink shadow-soft sm:p-7">
          <p className="text-lg leading-relaxed sm:text-xl">
            {words.map((w, i) => {
              const on =
                activeChar >= 0 &&
                w.start <= activeChar &&
                (words[i + 1]?.start ?? 9999) > activeChar;
              return (
                <button
                  key={`${w.start}-${w.word}`}
                  type="button"
                  onClick={() => speakWord(w.word.replace(/[^\p{L}\p{N}'-]/gu, ""), lang)}
                  className={cn(
                    "mr-[0.28em] rounded-sm px-0.5 transition-colors",
                    on ? "bg-star/70 text-ink" : "hover:bg-paper-2",
                  )}
                >
                  {w.word}
                </button>
              );
            })}
          </p>

          {pageData.vocab && (
            <div className="mt-4 rounded-md bg-paper-2 px-3 py-2 text-sm">
              <span className="font-display font-semibold">
                {pageData.vocab.word}
              </span>
              {pageData.vocab.reading ? (
                <span className="text-muted"> · {pageData.vocab.reading}</span>
              ) : null}
              <span className="text-ink-soft">
                {" "}
                — {pageData.vocab.meaning[lang]}
              </span>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <Button
              variant="night"
              onClick={play}
              aria-label={playing ? "Pause" : "Read aloud"}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : "Read aloud"}
            </Button>
            <Button
              variant="cream"
              onClick={() => starPage(book.slug, page)}
              aria-pressed={starred}
            >
              <Star
                className="size-4"
                fill={starred ? "currentColor" : "none"}
              />
              Star
            </Button>
            <span className="ml-auto hidden items-center gap-1 text-xs text-muted sm:inline-flex">
              <Volume2 className="size-3.5" />
              Best with sound on
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 0}
              onClick={() => go(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex flex-1 justify-center gap-1">
              {book.pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Page ${i + 1}`}
                  onClick={() => go(i)}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === page ? "bg-comet" : "bg-line",
                  )}
                />
              ))}
            </div>
            {last ? (
              <Button size="sm" onClick={finish}>
                The end
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => go(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
