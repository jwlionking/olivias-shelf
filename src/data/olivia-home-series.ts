import type { Book } from "./types";
import { L, page } from "./l";

function e(text: string) {
  return page(text, text, text, text, text);
}

function q(question: string, a: string, b: string, c: string): Book["quiz"][number] {
  return {
    q: L(question, question, question, question, question),
    choices: [L(a, a, a, a, a), L(b, b, b, b, b), L(c, c, c, c, c)],
    answer: 0,
  };
}

/** Olivia, Zero, Belle, and home-adventure picture books. */
export const oliviaHomeBooks: Book[] = [
  {
    slug: "olivia-two-sisters",
    cover: "/books/olivia-two-sisters/art/cover-shelf.webp",
    free: true,
    scene: "farm",
    title: L("Olivia and the Two Sisters", "Olivia and the Two Sisters", "Olivia and the Two Sisters", "Olivia and the Two Sisters", "Olivia and the Two Sisters"),
    blurb: L(
      "Olivia sits on the beige couch with Zero, who loves rocks, and Belle, who never sits still.",
      "Olivia sits on the beige couch with Zero, who loves rocks, and Belle, who never sits still.",
      "Olivia sits on the beige couch with Zero, who loves rocks, and Belle, who never sits still.",
      "Olivia sits on the beige couch with Zero, who loves rocks, and Belle, who never sits still.",
      "Olivia sits on the beige couch with Zero, who loves rocks, and Belle, who never sits still.",
    ),
    pages: [
      e("Olivia sat on the beige couch between Zero, calm as a Sunday, and Belle, who never sits still."),
      e("Zero is eight and loves rocks. Olivia whispered, \"You are a quiet queen.\""),
      e("Belle is eleven months and bounce. Olivia laughed. \"You are a wrecking ball with ears.\""),
      e("Back on the couch. Two sisters. One girl. All happy."),
    ],
    quiz: [q("Who is the calm older sister?", "Zero", "Belle", "the couch")],
  },
  {
    slug: "olivia-lost-rock",
    cover: "/books/olivia-lost-rock/art/cover-shelf.webp",
    free: true,
    scene: "farm",
    title: L("Olivia and the Lost Rock", "Olivia and the Lost Rock", "Olivia and the Lost Rock", "Olivia and the Lost Rock", "Olivia and the Lost Rock"),
    blurb: L(
      "Zero's favorite rock goes missing. Belle has an idea. Olivia leads the search until the treasure comes home.",
      "Zero's favorite rock goes missing. Belle has an idea. Olivia leads the search until the treasure comes home.",
      "Zero's favorite rock goes missing. Belle has an idea. Olivia leads the search until the treasure comes home.",
      "Zero's favorite rock goes missing. Belle has an idea. Olivia leads the search until the treasure comes home.",
      "Zero's favorite rock goes missing. Belle has an idea. Olivia leads the search until the treasure comes home.",
    ),
    pages: [
      e("Zero looked at her paws. The smooth rock was not there."),
      e("Belle zoomed across the yard. Olivia and Zero followed."),
      e("In the grass sat the rock. Smooth as a secret."),
      e("Olivia gave it back. The search was done."),
    ],
    quiz: [q("Whose rock went missing?", "Zero's", "Belle's", "Olivia's")],
  },
  {
    slug: "olivia-yard-romp",
    cover: "/books/olivia-yard-romp/art/cover-shelf.webp",
    free: true,
    scene: "farm",
    title: L("Olivia and the Yard Romp", "Olivia and the Yard Romp", "Olivia and the Yard Romp", "Olivia and the Yard Romp", "Olivia and the Yard Romp"),
    blurb: L(
      "Olivia bursts onto the red-clay yard with Belle racing ahead and Zero trotting behind.",
      "Olivia bursts onto the red-clay yard with Belle racing ahead and Zero trotting behind.",
      "Olivia bursts onto the red-clay yard with Belle racing ahead and Zero trotting behind.",
      "Olivia bursts onto the red-clay yard with Belle racing ahead and Zero trotting behind.",
      "Olivia bursts onto the red-clay yard with Belle racing ahead and Zero trotting behind.",
    ),
    pages: [
      e("The black door swung wide. Olivia jumped down to the red clay."),
      e("Belle was already a black streak. Olivia laughed and ran."),
      e("Zero trotted, calm, one eye on everyone."),
      e("Shoes full of red dust. Two tails. One laugh. Home."),
    ],
    quiz: [q("Who races ahead?", "Belle", "Zero", "the shed")],
  },
  {
    slug: "olivia-garden-beds",
    cover: "/books/olivia-garden-beds/art/cover-shelf.webp",
    free: true,
    scene: "garden",
    title: L("Olivia and the Garden Beds", "Olivia and the Garden Beds", "Olivia and the Garden Beds", "Olivia and the Garden Beds", "Olivia and the Garden Beds"),
    blurb: L(
      "Olivia waters the wooden raised beds beside the white house with a green can.",
      "Olivia waters the wooden raised beds beside the white house with a green can.",
      "Olivia waters the wooden raised beds beside the white house with a green can.",
      "Olivia waters the wooden raised beds beside the white house with a green can.",
      "Olivia waters the wooden raised beds beside the white house with a green can.",
    ),
    pages: [
      e("Olivia stood by the wooden garden beds. \"Thirsty?\" she asked the leaves."),
      e("The green watering can was heavier than it looked. Dirt went dark and glad."),
      e("Even the smallest pot got a sip. Fair is fair."),
      e("Fingernails had a line of dirt, like a badge."),
    ],
    quiz: [q("What does Olivia use to water?", "a green can", "a rocket", "a rock")],
  },
  {
    slug: "olivia-quiet-sun",
    cover: "/books/olivia-quiet-sun/art/cover-shelf.webp",
    free: true,
    scene: "farm",
    title: L("Olivia and the Quiet Sun", "Olivia and the Quiet Sun", "Olivia and the Quiet Sun", "Olivia and the Quiet Sun", "Olivia and the Quiet Sun"),
    blurb: L(
      "Olivia sits on the green hill and wonders why the dark panels shine gold.",
      "Olivia sits on the green hill and wonders why the dark panels shine gold.",
      "Olivia sits on the green hill and wonders why the dark panels shine gold.",
      "Olivia sits on the green hill and wonders why the dark panels shine gold.",
      "Olivia sits on the green hill and wonders why the dark panels shine gold.",
    ),
    pages: [
      e("Olivia sat in the grass. Dark panels lay like quiet books left open."),
      e("They drank the light and kept it, gold where the sun touched them."),
      e("The hill drinks day so the house can have night."),
      e("\"Thank you for working when nobody is looking,\" said Olivia."),
    ],
    quiz: [q("What shines gold on the hill?", "solar panels", "the couch", "a rock")],
  },
  {
    slug: "olivia-house-hill",
    cover: "/books/olivia-house-hill/art/cover-shelf.webp",
    free: true,
    scene: "farm",
    title: L("Olivia and the House on the Hill", "Olivia and the House on the Hill", "Olivia and the House on the Hill", "Olivia and the House on the Hill", "Olivia and the House on the Hill"),
    blurb: L(
      "Olivia walks the red clay in front of her long white house and learns the shape of home.",
      "Olivia walks the red clay in front of her long white house and learns the shape of home.",
      "Olivia walks the red clay in front of her long white house and learns the shape of home.",
      "Olivia walks the red clay in front of her long white house and learns the shape of home.",
      "Olivia walks the red clay in front of her long white house and learns the shape of home.",
    ),
    pages: [
      e("Olivia stood in the red clay and looked up. Long white walls. A dark metal roof."),
      e("A white pickup slept on the clay like a big tame animal."),
      e("Green woods wrapped the hill. Home was the trees too."),
      e("The black door opened. The white house took them in."),
    ],
    quiz: [q("What color is the house?", "white", "purple", "gold")],
  },
];
