import { createFileRoute } from "@tanstack/react-router";
import { StoryExperience } from "@/components/story-experience";

export const Route = createFileRoute("/stories/")({ component: Library });

function Library() {
  return <StoryExperience />;
}
