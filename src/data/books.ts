import { freeBooks } from "./books-free";
import { elonSeriesBooks } from "./elon-series";
import { learnBooks } from "./books-learn";
import { memberBooks } from "./books-member";
import type { Book } from "./types";

export const BOOKS: Book[] = [...freeBooks, ...elonSeriesBooks, ...memberBooks, ...learnBooks];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
