#!/usr/bin/env python3
"""Write story.json files and register the six Olivia home books."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_DIR = ROOT / "public/books"

NARRATOR = {
    "grok": {
        "voice": "carina",
        "language": "en",
        "instructions": "Warm gentle storyteller reading a family picture book. Soft, clear, never rushed. Olivia is curious. Zero is calm. Belle is bouncy.",
    },
    "openai": {
        "model": "grok-tts",
        "voice": "carina",
        "speed": 0.92,
        "instructions": "Warm gentle storyteller reading a family picture book. Soft, clear, never rushed.",
    },
    "bundled": {"folder": "voice", "format": "mp3", "timings": True},
}


def story(**kwargs):
    base = {
        "author": "Olivia's Shelf",
        "ageRange": "4 to 8",
        "readingLevel": "Early chapter",
        "cover": "art/cover.jpg",
        "scenes": "scenes.js",
        "hero": {"name": "Olivia", "felt": "otto"},
        "narrator": NARRATOR,
        "credits": "Painted from family photos of Olivia, Zero, Belle, and home.",
        "pins": [
            {"id": "star", "name": "Star pin", "page": 2, "at": [0.4, 0, -0.2]},
            {"id": "moon", "name": "Moon pin", "page": 5, "at": [0.3, 0, 0.2]},
        ],
    }
    base.update(kwargs)
    return base


STORIES = [
    story(
        id="olivia-two-sisters",
        title="Olivia and the Two Sisters",
        subtitle="Zero is calm. Belle is bounce.",
        blurb="Olivia sits on the beige couch with Zero, who loves rocks, and Belle, who never sits still. Two German shepherd sisters. One girl. One home.",
        colors={"cloth": "#6b5340", "endpaper": {"base": "#2a241c", "ink": "#e8c48a", "pattern": "stars"}},
        magic={"home": "Two sisters. One couch. All happy."},
        pages=[
            {"id": "meet", "scene": "couch", "heading": "The couch", "text": "{Olivia} sat on the beige {couch}. On one side sat {Zero:zero/wag}, brown as toast, calm as a Sunday. On the other bounced {Belle:belle/wag}, jet black with tan legs, almost as big, never still.", "hint": "Tap Olivia. Tap Zero. Tap Belle.", "words": ["Olivia", "Zero", "Belle", "couch"]},
            {"id": "zero", "scene": "couch", "heading": "Zero is calm", "text": "{Zero:zero/sniff} is eight. She loves {rocks:rock/clack}. Smooth ones. Stripey ones. The one that fits her paw just so. Olivia whispered, \"You are a quiet queen.\"", "hint": "Tap Zero.", "words": ["Zero", "rocks", "Olivia"]},
            {"id": "belle", "scene": "couch", "heading": "Belle is bounce", "text": "{Belle:belle/wreck} is eleven months. She wrecks the pillow pile. She play-bites the air. Her tail says, I have an idea. Olivia laughed. \"You are a wrecking ball with ears.\"", "hint": "Tap Belle.", "words": ["Belle", "Olivia"]},
            {"id": "yard", "scene": "patio", "heading": "Out the door", "text": "The {yard} was red clay and green woods. {Belle:belle/run} zoomed. {Zero:zero/run} followed, because sisters do. {Olivia:olivia/run} ran after both.", "hint": "Tap the yard.", "words": ["yard", "Belle", "Zero", "Olivia"]},
            {"id": "different", "scene": "patio", "heading": "Different is good", "text": "\"Why is Zero still and Belle wild?\" asked {Olivia:olivia/ask}. Zero's ears said, I am the older one. Belle's tail said, I am the puppy. That is how sisters work.", "hint": "Tap Olivia.", "words": ["Olivia", "Zero", "Belle"]},
            {"id": "home", "scene": "couch", "heading": "Back on the couch", "text": "Back on the {couch}. {Zero:zero/sleep} with her rock. {Belle:belle/wag} with her wiggle. {Olivia} in the middle. Two sisters. One girl. All happy.", "hint": "Tap them goodnight.", "words": ["couch", "Zero", "Belle", "Olivia"]},
        ],
        end={"heading": "The End", "text": "You {read} the whole {story}. Zero is calm. Belle is bounce. Olivia loves them both.", "prompt": "If you had two dog sisters, which one would you sit beside first?"},
        quiz={"folder": "quiz", "questions": [
            {"q": "Who is the calm older sister?", "options": [{"word": "Zero", "label": "Zero"}, {"word": "Belle", "label": "Belle"}, {"word": "Olivia", "label": "Olivia"}], "answer": 0, "right": "Yes! Zero is eight, and calm as a Sunday.", "wrong": "Zero is the calm one. Belle is the puppy."},
            {"q": "Who never sits still?", "options": [{"word": "Belle", "label": "Belle"}, {"word": "Zero", "label": "Zero"}, {"word": "the-couch", "label": "the couch"}], "answer": 0, "right": "That's right. Belle is bounce.", "wrong": "Belle is the one who never sits still."},
            {"q": "Where do they all sit together?", "options": [{"word": "the-couch", "label": "the couch"}, {"word": "the-truck", "label": "the truck"}, {"word": "the-moon", "label": "the moon"}], "answer": 0, "right": "Yes. Home is the beige couch.", "wrong": "They sit together on the couch."},
        ]},
    ),
    story(
        id="olivia-lost-rock",
        title="Olivia and the Lost Rock",
        subtitle="Sisters help find treasure.",
        blurb="Zero's favorite rock goes missing. Belle has an idea. Olivia leads the search across the patio, the garden, and the grass until the treasure comes home.",
        colors={"cloth": "#4a6a3a", "endpaper": {"base": "#1c2818", "ink": "#d8e8a8", "pattern": "stars"}},
        magic={"rock": "There it is. Smooth as a secret."},
        pages=[
            {"id": "gone", "scene": "patio", "heading": "The rock is gone", "text": "{Zero:zero/sniff} looked at her paws. The smooth {rock:rock/clack} was not there. {Olivia} said, \"We will find it.\" {Belle:belle/wag}'s tail said, I have an idea.", "hint": "Tap Zero. Tap Olivia.", "words": ["Zero", "rock", "Olivia", "Belle"]},
            {"id": "idea", "scene": "patio", "heading": "Belle's idea", "text": "{Belle:belle/run} zoomed across the {yard}. Maybe she took it. Maybe she was helping. {Olivia:olivia/run} and {Zero:zero/run} followed, because that is what a search party does.", "hint": "Tap Belle.", "words": ["Belle", "yard", "Olivia", "Zero"]},
            {"id": "chairs", "scene": "patio", "heading": "Under the chairs", "text": "They looked under the wooden chairs. They looked by the picnic table. No {rock:rock/clack}. {Olivia:olivia/ask} said, \"Where would a treasure hide?\"", "hint": "Tap the yard.", "words": ["rock", "Olivia"]},
            {"id": "garden", "scene": "garden", "heading": "In the garden", "text": "The {garden} smelled like dirt and leaves. {Zero:zero/sniff} put her nose down. {Belle:belle/wreck} splashed a watering pot. {Olivia} looked between the green.", "hint": "Tap Zero. Tap the garden.", "words": ["garden", "Zero", "Belle", "Olivia"]},
            {"id": "found", "scene": "garden", "heading": "There it is", "text": "In the grass sat the {rock:rock/find}. Smooth as a secret. {Zero:zero/wag} nosed it kind. {Belle:belle/wag} dropped a tiny pebble beside it. \"Yours,\" said the pebble.", "hint": "Tap the rock.", "words": ["rock", "Zero", "Belle"]},
            {"id": "home", "scene": "patio", "heading": "Treasure home", "text": "{Olivia} carried the {rock:rock/clack} as far as the patio. Then she gave it back. {Zero:zero/sleep} kept it. {Belle:belle/wag} kept bouncing. The search was done.", "hint": "Tap them.", "words": ["Olivia", "rock", "Zero", "Belle"]},
        ],
        end={"heading": "The End", "text": "You {read} the whole {story}. Lost things can come home when sisters look together.", "prompt": "If you lost a treasure, who would help you look?"},
        quiz={"folder": "quiz", "questions": [
            {"q": "Whose rock went missing?", "options": [{"word": "Zero", "label": "Zero's"}, {"word": "Belle", "label": "Belle's"}, {"word": "Olivia", "label": "Olivia's"}], "answer": 0, "right": "Yes. Zero keeps a smooth rock like a treasure.", "wrong": "It was Zero's favorite rock."},
            {"q": "Who zoomed off first?", "options": [{"word": "Belle", "label": "Belle"}, {"word": "Zero", "label": "Zero"}, {"word": "the-rock", "label": "the rock"}], "answer": 0, "right": "Belle always has an idea, and the idea is run.", "wrong": "Belle zoomed first."},
            {"q": "Where did they find it?", "options": [{"word": "in-the-grass", "label": "in the grass"}, {"word": "in-the-truck", "label": "in the truck"}, {"word": "on-the-moon", "label": "on the moon"}], "answer": 0, "right": "In the grass, smooth as a secret.", "wrong": "They found it in the grass."},
        ]},
    ),
    story(
        id="olivia-yard-romp",
        title="Olivia and the Yard Romp",
        subtitle="Red clay, two tails, one laugh.",
        blurb="Olivia bursts onto the red-clay yard with Belle racing ahead and Zero trotting behind. Patio chairs, a green shed, and woods full of wind.",
        colors={"cloth": "#8a4a28", "endpaper": {"base": "#2a1810", "ink": "#f0c978", "pattern": "stars"}},
        magic={"home": "Red clay on the shoes. Two tails. One laugh."},
        pages=[
            {"id": "door", "scene": "house", "heading": "The door opens", "text": "The black door on the little wooden deck swung wide. {Olivia:olivia/run} jumped down to the red clay. \"Come on!\" The {yard} was waiting.", "hint": "Tap Olivia.", "words": ["Olivia", "yard"]},
            {"id": "belle", "scene": "patio", "heading": "Belle races", "text": "{Belle:belle/run} was already a black streak across the clay. Tan legs flying. Tail like a flag. {Olivia:olivia/run} laughed so hard she had to run to keep up.", "hint": "Tap Belle.", "words": ["Belle", "Olivia"]},
            {"id": "zero", "scene": "patio", "heading": "Zero follows", "text": "{Zero:zero/run} did not race. She trotted, calm, because older sisters do. She kept one eye on Belle and one eye on {Olivia}. That is a job too.", "hint": "Tap Zero.", "words": ["Zero", "Olivia", "Belle"]},
            {"id": "chairs", "scene": "patio", "heading": "Around the chairs", "text": "They looped the wooden chairs. They passed the picnic table. They sniffed the oval garden bed. The {yard} was a whole world, and it was theirs.", "hint": "Tap the yard.", "words": ["yard"]},
            {"id": "woods", "scene": "patio", "heading": "The woods watch", "text": "Green woods stood all around, like a quiet fence. {Olivia:olivia/ask} waved at them. {Belle:belle/wag} barked once at a bird. {Zero:zero/wag} sat, queen of the clay.", "hint": "Tap them.", "words": ["Olivia", "Belle", "Zero"]},
            {"id": "home", "scene": "house", "heading": "Back to the deck", "text": "Shoes full of red dust. Two tails wagging. One laugh left. They climbed the little deck. {Home} smelled like dinner and couch. The romp was done — until tomorrow.", "hint": "Tap home.", "words": ["Home", "Olivia"]},
        ],
        end={"heading": "The End", "text": "You {read} the whole {story}. The yard is red clay, green woods, and room to run.", "prompt": "If you ran a romp, who would race, and who would trot?"},
        quiz={"folder": "quiz", "questions": [
            {"q": "Who races ahead?", "options": [{"word": "Belle", "label": "Belle"}, {"word": "Zero", "label": "Zero"}, {"word": "the-shed", "label": "the shed"}], "answer": 0, "right": "Yes. Belle is a black streak.", "wrong": "Belle races. Zero trots."},
            {"q": "What color is the yard dirt?", "options": [{"word": "red-clay", "label": "red clay"}, {"word": "blue-snow", "label": "blue snow"}, {"word": "gold-sand", "label": "gold sand"}], "answer": 0, "right": "Red clay, just like home.", "wrong": "The yard is red clay."},
            {"q": "Who keeps one eye on everyone?", "options": [{"word": "Zero", "label": "Zero"}, {"word": "Belle", "label": "Belle"}, {"word": "a-bird", "label": "a bird"}], "answer": 0, "right": "Zero is the older sister. That is her job.", "wrong": "Zero watches. Belle runs."},
        ]},
    ),
    story(
        id="olivia-garden-beds",
        title="Olivia and the Garden Beds",
        subtitle="Dirt under the fingernails.",
        blurb="Olivia waters the wooden raised beds beside the white house — lettuce, pots, a chicken coop, and a green can that makes the plants drink.",
        colors={"cloth": "#3a6a3a", "endpaper": {"base": "#142014", "ink": "#c8e8a0", "pattern": "stars"}},
        magic={"home": "The plants drank. Olivia did too — a glass of water, after."},
        pages=[
            {"id": "beds", "scene": "garden", "heading": "The wooden beds", "text": "{Olivia} stood by the wooden {garden} beds. Leaves were already busy being green. \"Thirsty?\" she asked them, as if leaves could answer.", "hint": "Tap Olivia. Tap the garden.", "words": ["Olivia", "garden"]},
            {"id": "can", "scene": "garden", "heading": "The green can", "text": "The green watering {can:can/pour} was heavier than it looked. {Olivia:olivia/ask} tipped it. A silver ribbon of water landed on the dirt. The dirt went dark and glad.", "hint": "Tap the can.", "words": ["can", "Olivia"]},
            {"id": "pots", "scene": "garden", "heading": "Little pots", "text": "Colored pots sat on the gravel like a tiny town. {Olivia} gave each one a sip. \"Fair is fair,\" she said. Even the smallest pot got a drink.", "hint": "Tap Olivia.", "words": ["Olivia"]},
            {"id": "coop", "scene": "garden", "heading": "The wire house", "text": "A little wire house stood in the gravel. Something rustled. {Olivia} whispered, \"We are growing lunch. You can watch.\" The rustle said, all right.", "hint": "Tap the garden.", "words": ["Olivia"]},
            {"id": "house", "scene": "house", "heading": "The white house watches", "text": "The white {home} with the dark roof watched the garden the way a kind giant watches. {Olivia:olivia/wave} waved at the windows. The windows shone back.", "hint": "Tap home.", "words": ["home", "Olivia"]},
            {"id": "done", "scene": "garden", "heading": "Dirt under the nails", "text": "The {can:can/pour} was empty. {Olivia}'s fingernails had a line of dirt, like a badge. The leaves looked taller. Maybe they were. Maybe she was.", "hint": "Tap Olivia. Tap the can.", "words": ["can", "Olivia"]},
        ],
        end={"heading": "The End", "text": "You {read} the whole {story}. Gardens drink. Then they grow. That is the deal.", "prompt": "If you had a watering can, what would you grow first?"},
        quiz={"folder": "quiz", "questions": [
            {"q": "What does Olivia use to water?", "options": [{"word": "a-green-can", "label": "a green can"}, {"word": "a-rocket", "label": "a rocket"}, {"word": "a-rock", "label": "a rock"}], "answer": 0, "right": "A green watering can, heavier than it looks.", "wrong": "She uses a green watering can."},
            {"q": "Where do the plants live?", "options": [{"word": "wooden-beds", "label": "wooden beds"}, {"word": "the-couch", "label": "the couch"}, {"word": "the-truck", "label": "the truck"}], "answer": 0, "right": "In the wooden raised beds by the house.", "wrong": "They live in the wooden garden beds."},
            {"q": "What is under Olivia's nails at the end?", "options": [{"word": "dirt", "label": "dirt"}, {"word": "gold", "label": "gold"}, {"word": "jam", "label": "jam"}], "answer": 0, "right": "Dirt. That is a gardener's badge.", "wrong": "Dirt under the fingernails."},
        ]},
    ),
    story(
        id="olivia-quiet-sun",
        title="Olivia and the Quiet Sun",
        subtitle="The hill drinks light.",
        blurb="Olivia sits on the green hill and wonders why the dark panels shine gold. The quiet sun is working, even when nobody is looking.",
        colors={"cloth": "#c9a24a", "endpaper": {"base": "#2a2410", "ink": "#ffe08a", "pattern": "stars"}},
        magic={"home": "The hill drank light. The house stayed bright."},
        pages=[
            {"id": "hill", "scene": "solar", "heading": "The shining hill", "text": "{Olivia} sat in the grass. Up the slope, dark {panels:sun/glow} lay like quiet books left open. They were gold where the sun touched them.", "hint": "Tap Olivia. Tap the sun.", "words": ["Olivia", "panels"]},
            {"id": "why", "scene": "solar", "heading": "Why gold?", "text": "\"Why do they shine?\" asked {Olivia:olivia/ask}. The {sun:sun/glow} did not answer with words. It just kept pouring light, the way a kettle pours.", "hint": "Tap the sun.", "words": ["Olivia", "sun"]},
            {"id": "drink", "scene": "solar", "heading": "The hill drinks", "text": "The {panels:sun/glow} drank the light and kept it. Not like a cup. Like a secret. {Olivia} put her palm on the grass. The grass was warm too.", "hint": "Tap the panels.", "words": ["panels", "Olivia"]},
            {"id": "shed", "scene": "solar", "heading": "The gray shed", "text": "A little gray shed stood beside the gold. It did not shine. It just kept tools and shade. {Olivia:olivia/wave} liked that. Not everything has to glow.", "hint": "Tap Olivia.", "words": ["Olivia"]},
            {"id": "house", "scene": "house", "heading": "Light at home", "text": "Down the hill, the white {home} waited. Lamps would come on later, easy as blinking. {Olivia} understood a little: the hill drinks day so the house can have night.", "hint": "Tap home.", "words": ["home", "Olivia"]},
            {"id": "thanks", "scene": "solar", "heading": "Thank you, quiet sun", "text": "{Olivia:olivia/wave} waved at the {sun:sun/glow}. \"Thank you for working when nobody is looking.\" The panels kept shining, gold and quiet, which is a kind of answer.", "hint": "Tap the sun. Tap Olivia.", "words": ["Olivia", "sun"]},
        ],
        end={"heading": "The End", "text": "You {read} the whole {story}. The quiet sun works on the hill. The house keeps the light.", "prompt": "What else works even when nobody is looking?"},
        quiz={"folder": "quiz", "questions": [
            {"q": "What shines gold on the hill?", "options": [{"word": "solar-panels", "label": "solar panels"}, {"word": "the-couch", "label": "the couch"}, {"word": "a-rock", "label": "a rock"}], "answer": 0, "right": "The panels drink sunlight and shine gold.", "wrong": "The solar panels shine gold."},
            {"q": "What does the hill drink?", "options": [{"word": "light", "label": "light"}, {"word": "soup", "label": "soup"}, {"word": "rain-only", "label": "only rain"}], "answer": 0, "right": "Light. Then the house can have night lamps.", "wrong": "The hill drinks light."},
            {"q": "What stands beside the panels?", "options": [{"word": "a-gray-shed", "label": "a gray shed"}, {"word": "a-rocket", "label": "a rocket"}, {"word": "a-castle", "label": "a castle"}], "answer": 0, "right": "A little gray shed that does not have to glow.", "wrong": "A gray shed stands beside them."},
        ]},
    ),
    story(
        id="olivia-house-hill",
        title="Olivia and the House on the Hill",
        subtitle="Home is the white house.",
        blurb="Olivia walks the red clay in front of her long white house — dark metal roof, wooden deck, white pickup, woods all around — and learns the shape of home.",
        colors={"cloth": "#5a6a78", "endpaper": {"base": "#1a2430", "ink": "#d8e0e8", "pattern": "stars"}},
        magic={"home": "The white house kept them. That is what home does."},
        pages=[
            {"id": "look", "scene": "house", "heading": "The white house", "text": "{Olivia} stood in the red clay and looked up. Long white walls. A dark metal roof. A little wooden deck. \"That is my {home},\" she told the woods, in case the woods did not know.", "hint": "Tap Olivia. Tap home.", "words": ["Olivia", "home"]},
            {"id": "deck", "scene": "house", "heading": "The little deck", "text": "The deck was a wooden pocket on the front. A black door. A wreath. {Olivia:olivia/wave} waved from the clay as if she were arriving from far away, which she was not, but it felt true.", "hint": "Tap Olivia.", "words": ["Olivia"]},
            {"id": "truck", "scene": "house", "heading": "The white truck", "text": "A white pickup slept on the clay like a big tame animal. {Zero:zero/sniff} sniffed a tire. {Belle:belle/wag} wanted to climb it. {Olivia} said, \"Not today.\"", "hint": "Tap Zero. Tap Belle.", "words": ["Zero", "Belle", "Olivia"]},
            {"id": "woods", "scene": "house", "heading": "The woods around", "text": "Green woods wrapped the hill the way arms wrap a sleep. {Olivia:olivia/ask} liked that. Home was not just a house. Home was the trees that kept it company.", "hint": "Tap home.", "words": ["Olivia"]},
            {"id": "garden", "scene": "garden", "heading": "Around the corner", "text": "Around the corner, the {garden} tables waited, and the gravel, and the glass doors. {Olivia:olivia/run} knew every turn. Knowing a place is a kind of love.", "hint": "Tap the garden.", "words": ["garden", "Olivia"]},
            {"id": "in", "scene": "house", "heading": "Inside", "text": "{Olivia} climbed the deck. {Zero:zero/sleep} and {Belle:belle/wag} came too. The black door opened. The white house took them in, the way it always does. That is the whole trick of home.", "hint": "Tap them.", "words": ["Olivia", "Zero", "Belle"]},
        ],
        end={"heading": "The End", "text": "You {read} the whole {story}. Home is the white house on the hill, and the woods, and who walks in.", "prompt": "What does your home look like from the outside?"},
        quiz={"folder": "quiz", "questions": [
            {"q": "What color is the house?", "options": [{"word": "white", "label": "white"}, {"word": "purple", "label": "purple"}, {"word": "gold", "label": "gold"}], "answer": 0, "right": "A long white house with a dark roof.", "wrong": "The house is white."},
            {"q": "What sleeps on the clay like a tame animal?", "options": [{"word": "the-white-truck", "label": "the white truck"}, {"word": "the-moon", "label": "the moon"}, {"word": "a-boat", "label": "a boat"}], "answer": 0, "right": "The white pickup.", "wrong": "The white truck."},
            {"q": "What wraps the hill?", "options": [{"word": "woods", "label": "woods"}, {"word": "ocean", "label": "ocean"}, {"word": "city", "label": "city"}], "answer": 0, "right": "Green woods, like arms around a sleep.", "wrong": "Woods wrap the hill."},
        ]},
    ),
]

INDEX_EXTRAS = [
    {
        "id": s["id"],
        "title": s["title"],
        "subtitle": s["subtitle"],
        "blurb": s["blurb"],
        "cover": "art/cover.jpg",
        "spine": {
            "olivia-two-sisters": "#6b5340",
            "olivia-lost-rock": "#4a6a3a",
            "olivia-yard-romp": "#8a4a28",
            "olivia-garden-beds": "#3a6a3a",
            "olivia-quiet-sun": "#c9a24a",
            "olivia-house-hill": "#5a6a78",
        }[s["id"]],
        "pages": 6,
        "status": "ready",
        "pins": [{"id": "star", "name": "Star pin"}, {"id": "moon", "name": "Moon pin"}],
        "quizCount": 3,
        "titles": {
            "fr": s["title"],
            "es": s["title"],
            "ja": s["title"],
            "zh": s["title"],
        },
        "blurbs": {
            "fr": s["blurb"],
            "es": s["blurb"],
            "ja": s["blurb"],
            "zh": s["blurb"],
        },
        "access": "free",
    }
    for s in STORIES
]


def main() -> None:
    for s in STORIES:
        dest = BOOKS_DIR / s["id"] / "story.json"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(s, indent=2) + "\n")
        print("wrote", dest)

    index_path = BOOKS_DIR / "index.json"
    index = json.loads(index_path.read_text())
    existing = {b["id"] for b in index["books"]}
    insert_at = next(i for i, b in enumerate(index["books"]) if b["id"] == "zero-and-belle") + 1
    for extra in INDEX_EXTRAS:
        if extra["id"] in existing:
            index["books"] = [extra if b["id"] == extra["id"] else b for b in index["books"]]
        else:
            index["books"].insert(insert_at, extra)
            insert_at += 1
            existing.add(extra["id"])
    index_path.write_text(json.dumps(index, indent=2) + "\n")
    print("index now", len(index["books"]), "books")


if __name__ == "__main__":
    main()
