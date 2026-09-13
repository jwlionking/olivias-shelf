# Olivia's Shelf — GitHub / agent instructions

Modeled on the original Storylight 3D pop-up book. New assets come from
**Grok Imagine** (paintings, cutouts) and **Grok Voice** (Carina narration).
Do **not** generate 3D meshes. Retain the original Three.js use cases:

- Nursery shelf (`src/shelf.js`)
- Book open + paper page turns (`src/book.js`)
- `Diorama` hinge-up back cards and rise-up paper figures (`src/scenes.js`)
- `backCard` / `figure` painted cards, not GLB heroes
- `{Word:name/verb}` hotspots and story actions
- Per-subject unique art; shared character stands only
- `npm run voices:generate` for `public/books/<id>/voice/page-N.mp3`

Full rules: `AGENTS.project.md` and `CONTRIBUTING.md`.
