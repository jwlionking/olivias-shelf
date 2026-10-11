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
      e("Olivia sat on the beige couch. On one side sat Zero, brown as toast, calm as a Sunday. On the other bounced Belle, jet black with tan legs, almost as big, never still."),
      e("Zero is eight. She loves rocks. Smooth ones. Stripey ones. The one that fits her paw just so. Olivia whispered, \"You are a quiet queen.\""),
      e("Belle is eleven months. She wrecks the pillow pile. She play-bites the air. Her tail says, I have an idea. Olivia laughed. \"You are a wrecking ball with ears.\""),
      e("The yard was red clay and green woods. Belle zoomed. Zero followed, because sisters do. Olivia ran after both."),
      e("\"Why is Zero still and Belle wild?\" asked Olivia. Zero's ears said, I am the older one. Belle's tail said, I am the puppy. That is how sisters work."),
      e("Back on the couch. Zero with her rock. Belle with her wiggle. Olivia in the middle. Two sisters. One girl. All happy."),
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
      e("Zero looked at her paws. The smooth rock was not there. Olivia said, \"We will find it.\" Belle's tail said, I have an idea."),
      e("Belle zoomed across the yard. Maybe she took it. Maybe she was helping. Olivia and Zero followed, because that is what a search party does."),
      e("They looked under the wooden chairs. They looked by the picnic table. No rock. Olivia said, \"Where would a treasure hide?\""),
      e("The garden smelled like dirt and leaves. Zero put her nose down. Belle splashed a watering pot. Olivia looked between the green."),
      e("In the grass sat the rock. Smooth as a secret. Zero nosed it kind. Belle dropped a tiny pebble beside it. \"Yours,\" said the pebble."),
      e("Olivia carried the rock as far as the patio. Then she gave it back. Zero kept it. Belle kept bouncing. The search was done."),
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
      e("The black door on the little wooden deck swung wide. Olivia jumped down to the red clay. \"Come on!\" The yard was waiting."),
      e("Belle was already a black streak across the clay. Tan legs flying. Tail like a flag. Olivia laughed so hard she had to run to keep up."),
      e("Zero did not race. She trotted, calm, because older sisters do. She kept one eye on Belle and one eye on Olivia. That is a job too."),
      e("They looped the wooden chairs. They passed the picnic table. They sniffed the oval garden bed. The yard was a whole world, and it was theirs."),
      e("Green woods stood all around, like a quiet fence. Olivia waved at them. Belle barked once at a bird. Zero sat, queen of the clay."),
      e("Shoes full of red dust. Two tails wagging. One laugh left. They climbed the little deck. Home smelled like dinner and couch. The romp was done — until tomorrow."),
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
      e("Olivia stood by the wooden garden beds. Leaves were already busy being green. \"Thirsty?\" she asked them, as if leaves could answer."),
      e("The green watering can was heavier than it looked. Olivia tipped it. A silver ribbon of water landed on the dirt. The dirt went dark and glad."),
      e("Colored pots sat on the gravel like a tiny town. Olivia gave each one a sip. \"Fair is fair,\" she said. Even the smallest pot got a drink."),
      e("A little wire house stood in the gravel. Something rustled. Olivia whispered, \"We are growing lunch. You can watch.\" The rustle said, all right."),
      e("The white home with the dark roof watched the garden the way a kind giant watches. Olivia waved at the windows. The windows shone back."),
      e("The can was empty. Olivia's fingernails had a line of dirt, like a badge. The leaves looked taller. Maybe they were. Maybe she was."),
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
      e("Olivia sat in the grass. Up the slope, dark panels lay like quiet books left open. They were gold where the sun touched them."),
      e("\"Why do they shine?\" asked Olivia. The sun did not answer with words. It just kept pouring light, the way a kettle pours."),
      e("The panels drank the light and kept it. Not like a cup. Like a secret. Olivia put her palm on the grass. The grass was warm too."),
      e("A little gray shed stood beside the gold. It did not shine. It just kept tools and shade. Olivia liked that. Not everything has to glow."),
      e("Down the hill, the white home waited. Lamps would come on later, easy as blinking. Olivia understood a little: the hill drinks day so the house can have night."),
      e("Olivia waved at the sun. \"Thank you for working when nobody is looking.\" The panels kept shining, gold and quiet, which is a kind of answer."),
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
      e("Olivia stood in the red clay and looked up. Long white walls. A dark metal roof. A little wooden deck. \"That is my home,\" she told the woods, in case the woods did not know."),
      e("The deck was a wooden pocket on the front. A black door. A wreath. Olivia waved from the clay as if she were arriving from far away, which she was not, but it felt true."),
      e("A white pickup slept on the clay like a big tame animal. Zero sniffed a tire. Belle wanted to climb it. Olivia said, \"Not today.\""),
      e("Green woods wrapped the hill the way arms wrap a sleep. Olivia liked that. Home was not just a house. Home was the trees that kept it company."),
      e("Around the corner, the garden tables waited, and the gravel, and the glass doors. Olivia knew every turn. Knowing a place is a kind of love."),
      e("Olivia climbed the deck. Zero and Belle came too. The black door opened. The white house took them in, the way it always does. That is the whole trick of home."),
    ],
    quiz: [q("What color is the house?", "white", "purple", "gold")],
  },
  {
    slug: "olivia-porch-light",
    cover: "/books/olivia-porch-light/art/cover-shelf.webp",
    free: true,
    scene: "farm",
    title: L("Olivia and the Porch That Wouldn't Stay Lit", "Olivia and the Porch That Wouldn't Stay Lit", "Olivia and the Porch That Wouldn't Stay Lit", "Olivia and the Porch That Wouldn't Stay Lit", "Olivia and the Porch That Wouldn't Stay Lit"),
    blurb: L(
      "On Halloween night the porch jack-o'-lanterns dim one by one. Olivia, Zero, and Belle keep watch and meet a shy wind that drinks flame because it is afraid of the dark.",
      "On Halloween night the porch jack-o'-lanterns dim one by one. Olivia, Zero, and Belle keep watch and meet a shy wind that drinks flame because it is afraid of the dark.",
      "On Halloween night the porch jack-o'-lanterns dim one by one. Olivia, Zero, and Belle keep watch and meet a shy wind that drinks flame because it is afraid of the dark.",
      "On Halloween night the porch jack-o'-lanterns dim one by one. Olivia, Zero, and Belle keep watch and meet a shy wind that drinks flame because it is afraid of the dark.",
      "On Halloween night the porch jack-o'-lanterns dim one by one. Olivia, Zero, and Belle keep watch and meet a shy wind that drinks flame because it is afraid of the dark.",
    ),
    pages: [
      e("Halloween smelled like leaf-smoke and cold sugar. Olivia set three jack-o'-lanterns on the porch rail, grins carved careful, candles upright as promises. Zero sat like a sentry. Belle paced, already inventing trouble. Then the middle flame thinned, not with a puff of wind, but as if something thirsty had leaned close."),
      e("One by one the grins went polite and dim. Not out. Worse. Hollowed. Olivia whispered, \"That is not weather.\" Zero tasted the air and did not like the answer. Belle bounced anyway, because courage sometimes looks like refusing to sit still."),
      e("They kept watch behind the porch post. The yard held its breath, red clay dull as old copper, woods a charcoal scribble. When the last candle shivered, Olivia felt the kind of fear that makes you more precise, not smaller. \"Stay with me,\" she told the dogs, and meant herself too."),
      e("It arrived like a draft with manners, cool fingers, no footprints. A thin shape hunched over the candle and drank the brightness down to a bead. Belle barked once, bright as a thrown coin. The shape flinched. \"Please,\" it whispered, ashamed. \"The dark is louder when I am alone in it.\""),
      e("Olivia did not raise a broom or a threat. She raised a question. \"If you empty our light, we all sit in the loud dark. What if you sat with it instead?\" Zero edged closer, calm as a closed gate. Belle offered a ridiculous toy like a treaty. The wind trembled: wanting, fearing, choosing."),
      e("They relit the jack-o'-lanterns. The wind sat on the top step and practiced stillness. The flames leaned toward it, not stolen but shared, and the dark around the porch grew honest instead of hungry. Far off, a neighbor's laugh skipped like a stone. Halloween went on, braver."),
      e("Later, Olivia left one small lantern on the rail \"for company.\" Zero claimed the doormat. Belle finally collapsed mid-bounce. The wind, lighter now, slipped into the woods without taking anything with it. On the porch, the grins kept their promises until morning."),
    ],
    quiz: [q("Why did the wind drink the candle light?", "It was afraid of the dark", "It wanted candy", "It was angry")],
  },
];
