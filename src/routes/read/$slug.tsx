import { createFileRoute, notFound } from "@tanstack/react-router";
import { StoryExperience } from "@/components/story-experience";
import { getBook } from "@/data/books";

export const Route = createFileRoute("/read/$slug")({
  component: ReadPage,
});

function ReadPage() {
  const { slug } = Route.useParams();
  const book = getBook(slug);
  if (!book) throw notFound();
  return <StoryExperience initialBook={slug} />;
}
