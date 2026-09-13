# Contributing to Olivia's Shelf

Olivia's Shelf is modeled on the original Storylight / StoryComet 3D pop-up
picture book. The nursery, the shelf, the page turns, and the paper dioramas
stay. **New paintings and new voices do not come from generated 3D meshes.**

## Pipeline

1. **Three.js** — keep the original use cases (see below).
2. **Grok Imagine** — covers, rooms, isolated cut-out props, character stands.
3. **Grok Voice** (Carina) — bundled page narration.

Do not generate meshes for new work. No Meshy, Hunyuan, or new `.glb` heroes.
Pop-ups are painted cards that hinge and rise, the same way the original books
do. Inherited Storylight titles (Lila, Otto, Nia, Fin, Zero & Belle) may keep
the meshes they already ship.

## Original Three.js use cases to retain

| Use case | Where |
|---|---|
| 3D nursery shelf of books | `src/shelf.js` |
| Book flies to the table and opens | `src/book.js`, `src/main.js` |
| Paper page turns | `src/book.js` |
| Diorama pop-ups (hinge / rise) | `src/scenes.js` `Diorama` |
| Painted back cards | `backCard()` |
| Paper-cut figures | `figure()` |
| Word hotspots + story verbs `{Elon:elon/teach}` | `story.json` + `d.action()` |
| Felt / paper materials, procedural helpers | `src/props.js` |
| Wall that changes with the open book | `public/textures/walls/` |
| Bundled narration + live Grok TTS | `public/books/*/voice/`, `src/lib/grok-tts.server.ts` |

Do not replace this with a 2D flipbook, a GLTF character stage, or image-to-3D.

## Adding a book

Each subject gets its **own** cover, workshop, and prop. Do not clone another
Elon book's paintings. Character stands may be shared.

```
public/books/<id>/
  story.json
  art/manifest.json
  art/cover.jpg              # Grok Imagine, 2:3 gouache cover
  art/cover-shelf.webp
  art/<subject-prop>.webp    # isolated cutout
  art/workshop.jpg           # this subject's room
  voice/page-N.mp3           # Grok Voice
src/books/<id>/scenes.js
```

1. Paint with **Grok Imagine**, anchored on the existing Olivia and Elon stands.
2. Knock cream/white out of prop cutouts. Letter the cover with the real title.
3. Build the diorama with `backCard` + `figure` (see `src/books/elon-shared.js`
   and `src/books/elon-heat-jiggle/scenes.js`).
4. List the book in `public/books/index.json` and `src/data/elon-series.ts`.
   Point `cover` at `/books/<id>/art/cover-shelf.webp`.
5. Synthesize voices:

   ```bash
   npm run voices:generate
   ```

6. Commit **every file the production build imports**, including
   `src/data/elon-series.ts`.

Agents working in Grok Build should also read `AGENTS.project.md`.
