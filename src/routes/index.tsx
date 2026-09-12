import { createFileRoute } from "@tanstack/react-router";
import { StoryExperience } from "@/components/story-experience";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <StoryExperience />;
}
