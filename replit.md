# EduPath

A full-stack web app helping first-generation college students in India find scholarships, track entrance exams, discover free learning resources, and connect with mentors — all personalised to their profile.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/edupath run dev` — run the frontend (port 26172, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind v4, wouter routing, @clerk/react, shadcn/ui, lucide-react
- API: Express 5 + @clerk/express for auth
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/edupath/` — React frontend (all pages, components, hooks)
  - `src/pages/` — landing, dashboard, profile, scholarships, exams, resources, mentors, not-found
  - `src/components/layout.tsx` — sidebar + nav layout for authenticated pages
  - `src/App.tsx` — Clerk + Wouter routing setup
  - `src/index.css` — theme (warm saffron/amber primary, cream background, Plus Jakarta Sans)
- `artifacts/api-server/` — Express API server
  - `src/routes/` — profile, scholarships, exams, resources, mentors, dashboard, health
- `lib/db/src/schema/` — Drizzle schema: profiles, scholarships, exams, resources, mentors tables
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks used across frontend
- Clerk auth proxy: frontend uses `@clerk/react`, API uses `@clerk/express` with `getAuth(req)`
- All routes require auth via `requireAuth` middleware (`getAuth` from `@clerk/express`)
- Scholarships/exams/resources/mentors are filtered server-side based on the user's profile
- Profile creation uses upsert pattern — same POST `/profile` endpoint creates or updates

## Product

- **Landing page** — hero for unauthenticated users explaining EduPath's purpose
- **Profile setup** — stream, college, state, category, financial background, career interest, year of study
- **Dashboard** — summary counts (scholarships, exams, resources, mentors) + quick links
- **Scholarships** — card grid filtered by category/state/stream
- **Exam Calendar** — exam cards with dates, deadlines, career relevance
- **Free Resources** — NPTEL, SWAYAM, Khan Academy etc. with direct links
- **Mentors** — first-gen success stories with LinkedIn connect links

## User preferences

- No emojis in UI — use Lucide icons only
- Warm earthy palette: saffron/amber primary, deep navy foreground, cream background
- Plus Jakarta Sans font throughout
- Personalisation is core: always filter content based on the student's profile

## Gotchas

- The `Show` component from `@clerk/react` is used for conditional rendering based on auth state
- `publishableKeyFromHost` must be used instead of reading `VITE_CLERK_PUBLISHABLE_KEY` directly — needed for Clerk proxy to work in production
- Orval-generated hooks return `T` directly (not `{ data: T }`)
- Always pass `queryKey` when using `enabled` option on query hooks
- API routes are served at `/api/*` prefix; frontend at `/`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the full API contract
