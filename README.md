# Neel Saswade — Portfolio

A portfolio for a senior product designer, built on a graph-paper grid. Next.js (App Router) + Tailwind + Supabase.

## Features

- **Interactive grid hero** — hover the glowing cell to flip open a reveal, which lights up the next cell somewhere else. Eight reveals deep: work, photography, play, and trivia.
- **Your visitor bike** — every visitor gets a customizable SVG bike (frame, wheels, paint, decals, signature). It rides down the right edge of the page as you scroll, wheels spinning with scroll velocity. Click it anytime to re-customize.
- **The Peloton** (`/peloton`) — a shared gallery of every visitor's bike, backed by Supabase.
- Sections: Work (with case-study pages), Play, Photography, About.

## Getting started

```bash
npm install
npm run dev
```

Everything works without Supabase — bikes fall back to localStorage (visible only in your own browser).

## Connecting Supabase (shared Peloton)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.local.example` to `.env.local` and fill in your project URL and anon key (Settings → API).
4. Restart the dev server. New bikes now save to the shared Peloton.

## Swapping in real content

- Case studies: `src/content/work.ts`
- Play projects and photos: `src/content/misc.ts`
- Grid reveal chain (what each discovery shows): `src/components/hero/reveals.ts`
- Bike options (frames, paints, decals): `src/lib/bike-types.ts` and `src/components/bike/BikeSvg.tsx`

Placeholder covers are CSS gradients; replace `cover` values with image URLs and swap the `div`s for `next/image` when real assets are ready.

## Deploying

Push to GitHub and import into [Vercel](https://vercel.com). Add the two `NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel project settings.
