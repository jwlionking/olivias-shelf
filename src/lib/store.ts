import { create } from "zustand";
import type { Lang } from "@/data/types";

export type ReaderAvatar =
  | "balloon"
  | "kite"
  | "fish"
  | "fox"
  | "crane"
  | "mouse";

export type ReaderProfile = {
  id: string;
  nickname: string;
  avatar: ReaderAvatar;
  birthday?: string;
};

export type BookProgress = {
  page: number;
  stars: number[];
  completed: boolean;
  quizBest?: number;
};

type Persisted = {
  lang: Lang;
  membership: "none" | "yearly" | "lifetime";
  readers: ReaderProfile[];
  activeReaderId: string | null;
  progress: Record<string, Record<string, BookProgress>>;
  pins: string[];
  vocab: { book: string; word: string; meaning: string }[];
  points: number;
  taps: number;
};

type AppState = Persisted & {
  setLang: (lang: Lang) => void;
  setMembership: (m: "yearly" | "lifetime") => void;
  addReader: (r: Omit<ReaderProfile, "id">) => void;
  removeReader: (id: string) => void;
  setActiveReader: (id: string | null) => void;
  setPage: (book: string, page: number) => void;
  starPage: (book: string, page: number) => void;
  completeBook: (book: string) => void;
  setQuiz: (book: string, score: number) => void;
  addPin: (id: string) => void;
  addVocab: (book: string, word: string, meaning: string) => void;
  addPoints: (n: number) => void;
  bumpTap: () => void;
};

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

function ensureBook(
  progress: AppState["progress"],
  readerId: string,
  book: string,
): BookProgress {
  const byReader = progress[readerId] ?? {};
  return (
    byReader[book] ?? {
      page: 0,
      stars: [],
      completed: false,
    }
  );
}

function load(): Partial<Persisted> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("storycomet-v1");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { state?: Persisted } | Persisted;
    if (parsed && "membership" in parsed) return parsed as Persisted;
    if (parsed && "state" in parsed && parsed.state) return parsed.state;
    return {};
  } catch {
    return {};
  }
}

function save(s: AppState) {
  if (typeof window === "undefined") return;
  const data: Persisted = {
    lang: s.lang,
    membership: s.membership,
    readers: s.readers,
    activeReaderId: s.activeReaderId,
    progress: s.progress,
    pins: s.pins,
    vocab: s.vocab,
    points: s.points,
    taps: s.taps,
  };
  window.localStorage.setItem("storycomet-v1", JSON.stringify(data));
}

const saved = load();

export const useApp = create<AppState>()((set, get) => ({
  lang: saved.lang ?? "en",
  membership: saved.membership ?? "none",
  readers: saved.readers ?? [],
  activeReaderId: saved.activeReaderId ?? null,
  progress: saved.progress ?? {},
  pins: saved.pins ?? [],
  vocab: saved.vocab ?? [],
  points: saved.points ?? 0,
  taps: saved.taps ?? 0,
  setLang: (lang) => {
    set({ lang });
    save(get());
  },
  setMembership: (membership) => {
    set({ membership });
    save(get());
    if (typeof window !== "undefined") {
      try {
        const plan = membership === "yearly" ? "year" : membership;
        window.localStorage.setItem(
          "storycomet-membership",
          JSON.stringify({
            active: true,
            plan,
            expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
          }),
        );
      } catch {
        /* private mode */
      }
    }
  },
  addReader: (r) => {
    set((s) => {
      if (s.readers.length >= 3) return s;
      const next = { ...r, id: rid() };
      return {
        readers: [...s.readers, next],
        activeReaderId: s.activeReaderId ?? next.id,
      };
    });
    save(get());
  },
  removeReader: (id) => {
    set((s) => ({
      readers: s.readers.filter((r) => r.id !== id),
      activeReaderId:
        s.activeReaderId === id
          ? (s.readers.find((r) => r.id !== id)?.id ?? null)
          : s.activeReaderId,
    }));
    save(get());
  },
  setActiveReader: (activeReaderId) => {
    set({ activeReaderId });
    save(get());
  },
  setPage: (book, page) => {
    const reader = get().activeReaderId ?? "guest";
    set((s) => {
      const cur = ensureBook(s.progress, reader, book);
      return {
        progress: {
          ...s.progress,
          [reader]: {
            ...(s.progress[reader] ?? {}),
            [book]: { ...cur, page },
          },
        },
      };
    });
    save(get());
  },
  starPage: (book, page) => {
    const reader = get().activeReaderId ?? "guest";
    set((s) => {
      const cur = ensureBook(s.progress, reader, book);
      if (cur.stars.includes(page)) return s;
      return {
        progress: {
          ...s.progress,
          [reader]: {
            ...(s.progress[reader] ?? {}),
            [book]: { ...cur, stars: [...cur.stars, page] },
          },
        },
        points: s.points + 5,
      };
    });
    save(get());
  },
  completeBook: (book) => {
    const reader = get().activeReaderId ?? "guest";
    set((s) => {
      const cur = ensureBook(s.progress, reader, book);
      return {
        progress: {
          ...s.progress,
          [reader]: {
            ...(s.progress[reader] ?? {}),
            [book]: { ...cur, completed: true },
          },
        },
        points: s.points + 40,
      };
    });
    save(get());
  },
  setQuiz: (book, score) => {
    const reader = get().activeReaderId ?? "guest";
    set((s) => {
      const cur = ensureBook(s.progress, reader, book);
      const best = Math.max(cur.quizBest ?? 0, score);
      return {
        progress: {
          ...s.progress,
          [reader]: {
            ...(s.progress[reader] ?? {}),
            [book]: { ...cur, quizBest: best },
          },
        },
        points: s.points + score * 10,
      };
    });
    save(get());
  },
  addPin: (id) => {
    set((s) => (s.pins.includes(id) ? s : { pins: [...s.pins, id] }));
    save(get());
  },
  addVocab: (book, word, meaning) => {
    set((s) => {
      if (s.vocab.some((v) => v.book === book && v.word === word)) return s;
      return { vocab: [...s.vocab, { book, word, meaning }] };
    });
    save(get());
  },
  addPoints: (n) => {
    set((s) => ({ points: s.points + n }));
    save(get());
  },
  bumpTap: () => {
    set((s) => ({ taps: s.taps + 1 }));
    save(get());
  },
}));

const EMPTY_PROGRESS: BookProgress = { page: 0, stars: [], completed: false };

export function useReaderProgress(book: string): BookProgress {
  return useApp((s) => {
    const reader = s.activeReaderId ?? "guest";
    return s.progress[reader]?.[book] ?? EMPTY_PROGRESS;
  });
}
