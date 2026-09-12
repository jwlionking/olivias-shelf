export const LANGS = ["en", "fr", "es", "ja", "zh"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<
  Lang,
  { label: string; native: string; speech: string }
> = {
  en: { label: "English", native: "English", speech: "en-US" },
  fr: { label: "French", native: "Français", speech: "fr-FR" },
  es: { label: "Spanish", native: "Español", speech: "es-ES" },
  ja: { label: "Japanese", native: "日本語", speech: "ja-JP" },
  zh: { label: "Chinese", native: "中文", speech: "zh-CN" },
};

export type Localized = Record<Lang, string>;

export type SceneKind =
  | "night-sky"
  | "kite"
  | "ocean"
  | "garden"
  | "snow"
  | "lantern"
  | "rice"
  | "festival"
  | "beach"
  | "bamboo"
  | "paris"
  | "newyear"
  | "fog"
  | "london"
  | "madrid"
  | "meadow"
  | "workshop"
  | "farm";

export type Vocab = {
  word: string;
  reading?: string;
  meaning: Localized;
  lang: Lang;
};

export type BookPage = {
  text: Localized;
  vocab?: Vocab;
};

export type QuizQuestion = {
  q: Localized;
  choices: [Localized, Localized, Localized];
  answer: 0 | 1 | 2;
};

export type Book = {
  slug: string;
  cover: string;
  title: Localized;
  blurb: Localized;
  free: boolean;
  pages: BookPage[];
  scene: SceneKind;
  quiz: QuizQuestion[];
  learn?: Lang;
};
