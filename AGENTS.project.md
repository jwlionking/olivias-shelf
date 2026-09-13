# Olivia's Shelf — project instructions

This app is a **3D pop-up picture-book library**. It is modeled on the original
Storylight / StoryComet nursery: a shelf of books, a table you open them on,
paper pages that turn, and a Three.js diorama that stands up on each spread.

**New work follows that engine. New assets do not.**

## Asset pipeline (non-negotiable)

| What | How |
|---|---|
| Covers, backdrops, cut-out props, character stands | **Grok Imagine** — gouache picture-book paintings and isolated cutouts |
| Page narration (`public/books/<id>/voice/page-N.mp3`) | **Grok Voice** (Carina) via `npm run voices:generate` |
| Pop-up motion, shelf, pages, lighting, hotspots | Original **Three.js** use cases — keep them |

**Do not generate 3D meshes** for new books. No Meshy, no Hunyuan, no new
`.glb` heroes, no image-to-3D toys, no rigged character models. Pop-ups are
**painted cards** (`backCard`, `figure`) standing in a `Diorama`, not generated
geometry. The original Storylight books (Lila, Otto, Nia, Fin, Zero & Belle)
may keep the meshes they already shipped; do not add more.

## Keep these Three.js use cases

The original engine in `src/scenes.js`, `src/shelf.js`, `src/book.js`,
`src/props.js`, and `src/main.js` is the product. Retain:

- Nursery shelf of 3D books (`src/shelf.js`) with painted covers
- Book flying to the table and opening
- Paper page turns
- `Diorama` per spread: hinge-up back cards, rise-up paper figures
- `backCard(d, id)` for painted rooms / skies
- `figure(d, id)` for cut-out characters and props (transparent WebP on paper)
- Touchable hotspots tied to `{Word:name/verb}` markup in `story.json`
- Story verbs (`d.action(name, verb, fn)`) that bounce, glow, roll, hop
- Wall texture swap when a book is open (`public/textures/walls/`)
- Bundled Carina narration + optional live Grok TTS
- Pins, quiz, souvenirs — same as the original books

Do not replace this with a 2D page-flip reader, a GLTF stage, or generated
meshes posed as the pop-up.

## New books

Each Elon & Olivia physics book is **individualized by subject**. Do not reuse
another book's cover, workshop, or prop art. Character stands (`olivia-stand`,
`elon-stand`) may be shared from `elon-physics-wonder`.

Layout:

```
public/books/<id>/
  story.json              # copy, scenes, narrator.grok.voice = carina
  art/manifest.json       # cover, workshop, subject prop, optional extra back
  art/cover.jpg           # 1200×1800 gouache cover (Grok Imagine)
  art/cover-shelf.webp    # 360×540 shelf thumbnail
  art/<prop>.webp         # isolated cutout, cream/white knocked out
  art/workshop.jpg        # subject-specific room (not a shared workshop)
  voice/page-N.mp3        # Grok Voice Carina
src/books/<id>/scenes.js  # Diorama builders using backCard / figure
```

Register the book in `public/books/index.json` and, for physics titles,
`src/data/elon-series.ts`. Cover fields must point at **this** book's
`/books/<id>/art/cover-shelf.webp` — never a sibling's.

Paint with Grok Imagine from the existing Olivia / Elon stands so the
characters stay consistent. Knock out cream backgrounds on props. Letter the
cover with the exact title.

Then:

```bash
npm run voices:generate
```

## What not to do

- Do not remap every `elon-*` book onto `elon-physics-wonder` art (stands only).
- Do not invent Higgsfield / GPT Image 2 / Meshy pipelines for new work.
- Do not add `public/models/toys/*.glb` for new stories.
- Do not leave a production import (e.g. `src/data/elon-series.ts`) uncommitted.
