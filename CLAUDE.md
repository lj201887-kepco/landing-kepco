# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev
npm run build   # next build
npm run lint    # eslint (flat config, eslint.config.mjs)
npx drizzle-kit push      # sync drizzle/schema.ts to the DB (config: drizzle.config.ts)
npx drizzle-kit generate  # generate SQL migrations into drizzle/migrations
```

There is no test runner configured.

`AGENTS.md` warns that this Next.js (16.x) and React (19.x) differ from older versions: read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.

## Architecture

Korean-language landing page for corporate "vibe coding" training, with an inquiry form that stores submissions in Postgres (Supabase). Uses the App Router, Tailwind CSS 4, and Drizzle ORM with `postgres-js`.

- `src/app/page.tsx` — the landing page. It is a single static page of sections that embeds `ContactForm`.
- `src/components/ContactForm.tsx` — client component. It validates on the client, then calls the `submitInquiry` server action.
- `src/app/actions.ts` — the `submitInquiry` server action. It **re-validates on the server** with the same `validateInquiry` and inserts into the `inquiries` table. It returns a `SubmitResult` (`{ok:true}` or field `errors`/`message`) and never throws to the client.
- `src/lib/inquiry.ts` — shared types, initial values, and validation rules used by both client and server. Its `MAX` length limits must match the column lengths in `drizzle/schema.ts`.
- `src/db/index.ts` — Drizzle client. It throws at import time if `DATABASE_URL` is unset, and uses `prepare: false` because Supabase's transaction pooler doesn't support prepared statements.
- `drizzle/schema.ts` — the schema, at the repo root (not under `src`). It is imported with a relative path (`../../drizzle/schema`); the `@/*` alias only maps to `./src/*`.

## Environment

`.env` needs `DATABASE_URL` (Postgres connection string, used by both the app and drizzle-kit).
