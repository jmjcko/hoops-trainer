HOOPS-Trainer is a web app to collect training content (YouTube/Shorts/Facebook video URLs and written exercises) and assemble training plans.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Navigate to `/library` to add items, then `/plan-builder` to assemble a training plan.

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- LocalStorage for persistence (no backend yet)
- ESLint + Prettier

## Current Features

- Add videos by URL (YouTube, Shorts, Facebook) to Library
- Add written exercises to Library
- View video embeds and list exercises
- Build, reorder, and save training plans (localStorage)

## Project History

- 2025-10-03: Scaffolded Next.js app with Tailwind, ESLint, Prettier
- 2025-10-03: Added Library page and Plan Builder with localStorage persistence

## Conventions

- Source lives under `src/`. App routes in `src/app/`
- Types in `src/types/`, helpers in `src/lib/`

## How to Continue Later

See `ROADMAP.md` for next steps. High-level next tasks:

- Metadata enrichment (fetch titles/thumbnails for YouTube)
- Export/import plans (JSON), shareable links
- Optional backend (Prisma + SQLite/Postgres) for sync

## License

MIT

## YouTube API Setup (Optional)

The homepage displays the latest basketball training videos from popular channels. By default, it uses mock data. To fetch real-time latest videos:

1. See [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md) for detailed instructions
2. Get a YouTube Data API v3 key from Google Cloud Console
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   ```
4. Restart the development server

Without an API key, the app works fine but shows placeholder basketball videos instead of the actual latest videos from each channel.

## Deploy

You can deploy to Vercel or any Node.js host. 

**Environment Variables (Optional):**
- `NEXT_PUBLIC_YOUTUBE_API_KEY` - For fetching latest videos from YouTube channels (see YOUTUBE_API_SETUP.md)
