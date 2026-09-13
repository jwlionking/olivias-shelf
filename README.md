# Olivia's Shelf

A 3D pop-up picture-book library. Open a book on the nursery table, turn the pages, and the scenes stand up.

Free on the first shelf:

- **Lila and the Moonlit Pony**
- **Elon and the Physics of Wonder**
- **Zero and Belle** — two German Shepherds, Zero (sable, loves rocks) and Belle (black, loves to play)

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
npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

Origin nginx vhost: `deploy/nginx/olivias-shelf.wyles.ai` (proxies to PM2 on `127.0.0.1:3046`).

## Stack

TanStack Start, React 19, Three.js, Tailwind v4.
