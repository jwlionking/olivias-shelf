import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getBook } from "@/data/books";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/quiz/$slug")({ component: QuizPage });

function QuizPage() {
  const { slug } = Route.useParams();
  const book = getBook(slug);
  if (!book) throw notFound();
  const story = book;
  const lang = useApp((s) => s.lang);
  const setQuiz = useApp((s) => s.setQuiz);
  const addPin = useApp((s) => s.addPin);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = story.quiz[i];

  function choose(n: number) {
    if (picked != null) return;
    setPicked(n);
    if (n === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 >= story.quiz.length) {
      setQuiz(story.slug, score);
      if (score === 4) addPin("quiz-ace");
      const reader = useApp.getState().activeReaderId ?? "guest";
      const finished = Object.values(
        useApp.getState().progress[reader] ?? {},
      ).filter((p) => p.completed).length;
      if (finished >= 3) addPin("free-shelf");
      if (finished >= 5) addPin("five-books");
      if (finished >= 15) addPin("whole-shelf");
      setDone(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  }

  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12">
        <p className="text-sm text-muted">{story.title[lang]}</p>
        <h1 className="mt-1 text-3xl font-semibold">Story quiz</h1>
        {done ? (
          <div className="mt-8 rounded-xl bg-cream p-6 ring-1 ring-line">
            <p className="font-display text-2xl font-semibold">
              {score} out of {story.quiz.length}
            </p>
            <p className="mt-2 text-ink-soft">
              {score === 4
                ? "You remembered every beat."
                : "You can open the book again any time."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/stories">Back to the library</Link>
              </Button>
              <Button asChild variant="cream">
                <Link to="/read/$slug" params={{ slug: story.slug }}>
                  Read again
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-sm text-muted">
              Question {i + 1} of {story.quiz.length}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold leading-snug">
              {q.q[lang]}
            </h2>
            <div className="mt-5 grid gap-2">
              {q.choices.map((c, n) => {
                const show = picked != null;
                const correct = n === q.answer;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => choose(n)}
                    className={`rounded-lg px-4 py-3 text-left ring-1 ${
                      show && correct
                        ? "bg-leaf/15 ring-leaf"
                        : show && picked === n
                          ? "bg-comet/15 ring-comet"
                          : "bg-cream ring-line hover:bg-paper-2"
                    }`}
                  >
                    {c[lang]}
                  </button>
                );
              })}
            </div>
            {picked != null && (
              <Button className="mt-6" onClick={next}>
                {i + 1 >= story.quiz.length ? "See score" : "Next"}
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
