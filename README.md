# Olivia's Shelf

A 3D pop-up picture-book library. Open a book on the nursery table, turn the pages, and the scenes stand up.

Modeled on the original Storylight / StoryComet nursery. **New paintings come from Grok Imagine. New narration comes from Grok Voice (Carina).** Pop-ups stay paper cards in Three.js — not generated meshes.

Free on the first shelf:

- **Lila and the Moonlit Pony**
- **Elon and the Physics of Wonder**
- **Olivia & Elon physics books** — heat, force, floating, air, ice, friction, levers, energy, balance, sky
- **Zero and Belle** — two German Shepherds, Zero (sable, loves rocks) and Belle (black, loves to play)
- **Otto, Nia, and Fin**

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:8080

## Production (this host)

Public URL: https://olivias-shelf.wyles.ai

```bash
npm install
RAYON_NUM_THREADS=1 npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

Origin nginx vhost: `deploy/nginx/olivias-shelf.wyles.ai` (proxies to PM2 on `127.0.0.1:3046`). Rebuilds on this host need `RAYON_NUM_THREADS=1` so the Vite/Rolldown thread pool does not hit the process cap.

## Stack

TanStack Start, React 19, Three.js, Tailwind v4.

Art: Grok Imagine. Voice: Grok Voice (Carina, `npm run voices:generate`). Motion: original Three.js pop-up engine (`Diorama`, `backCard`, `figure`).

## Adding books

See [CONTRIBUTING.md](CONTRIBUTING.md). Grok Build and other agents: [AGENTS.project.md](AGENTS.project.md).
