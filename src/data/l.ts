import type { Localized, BookPage } from "./types";

export function L(
  en: string,
  fr: string,
  es: string,
  ja: string,
  zh: string,
): Localized {
  return { en, fr, es, ja, zh };
}

export function page(
  en: string,
  fr: string,
  es: string,
  ja: string,
  zh: string,
  vocab?: BookPage["vocab"],
): BookPage {
  return { text: L(en, fr, es, ja, zh), vocab };
}

export function Q(
  en: string,
  fr: string,
  es: string,
  ja: string,
  zh: string,
): Localized {
  return L(en, fr, es, ja, zh);
}
