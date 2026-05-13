# EduPath

**A Personalised Education Navigator for First-Generation College Students in India**

EduPath is a full-stack web application that helps first-generation college students find scholarships they qualify for, track entrance exam deadlines, discover free learning resources, and connect with mentors — all personalised to their profile.

> "Google gives them 10 lakh results. We give them one roadmap."

---

## Features

- **Profile Setup** — Stream, college, state, category (BC/OBC/SC/ST/General), financial background, career interest, and year of study
- **Scholarship Finder** — Filtered card grid showing only scholarships the student is eligible for, with deadlines and apply links
- **Exam Calendar** — Personalised entrance exam schedule based on career goal
- **Free Resources** — Curated links to NPTEL, SWAYAM, Khan Academy and more
- **Mentor Connect** — First-gen success stories with LinkedIn connect links
- **Dashboard** — Summary of available scholarships, exams, resources, and mentors

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Wouter, shadcn/ui, lucide-react |
| Auth | Clerk (`@clerk/react` + `@clerk/express`) |
| API | Express 5, OpenAPI spec (contract-first), Orval codegen |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (v4), drizzle-zod |
| Package Manager | pnpm workspaces |
| Runtime | Node.js 24, TypeScript 5.9 |

---

## Prerequisites

Make sure you have the following installed before running locally:

- [Node.js 24+](https://nodejs.org/) — check with `node -v`
- [pnpm](https://pnpm.io/installation) — install with `npm install -g pnpm`, check with `pnpm -v`
- [PostgreSQL 16+](https://www.postgresql.org/download/) — running locally or via a cloud provider (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))
- A [Clerk](https://clerk.com) account for authentication

---

## Local Setup (VS Code)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/edupath.git
cd edupath
```

### 2. Install dependencies

```bash
pnpm install
```

> Do not use `npm install` or `yarn` — this project enforces pnpm via a preinstall script.

### 3. Set up environment variables

Create a `.env` file in the root of the project (or in `artifacts/api-server/` if prompted):

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/edupath

# Clerk API keys — get these from https://dashboard.clerk.com
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
```

For the frontend, create `artifacts/edupath/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```

### 4. Set up the database

Push the Drizzle schema to your PostgreSQL database:

```bash
pnpm --filter @workspace/db run push
```

### 5. Run the development servers

Open two terminals in VS Code:

**Terminal 1 — API Server** (runs on port 8080):
```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Frontend** (runs on port 26172):
```bash
pnpm --filter @workspace/edupath run dev
```

Then open your browser at `http://localhost:26172`.

> The frontend proxies API calls to `/api` which routes to the API server on port 8080 — so both must be running.

---

## Project Structure

```
edupath/
├── artifacts/
│   ├── edupath/               # React frontend
│   │   └── src/
│   │       ├── pages/         # landing, dashboard, profile, scholarships,
│   │       │                  #   exams, resources, mentors, not-found
│   │       ├── components/
│   │       │   └── layout.tsx # Sidebar + nav for authenticated pages
│   │       ├── App.tsx        # Clerk + Wouter routing
│   │       └── index.css      # Theme (saffron/amber, cream bg, Plus Jakarta Sans)
│   └── api-server/            # Express API server
│       └── src/
│           └── routes/        # profile, scholarships, exams, resources,
│                              #   mentors, dashboard, health
├── lib/
│   ├── db/src/schema/         # Drizzle schema (profiles, scholarships, exams,
│   │                          #   resources, mentors)
│   ├── api-spec/              # OpenAPI spec — source of truth for API contract
│   ├── api-client-react/      # Orval-generated React Query hooks
│   └── api-zod/               # Zod schemas generated from OpenAPI spec
├── scripts/                   # Build and utility scripts
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm --filter @workspace/api-server run dev` | Start the API server (port 8080) |
| `pnpm --filter @workspace/edupath run dev` | Start the frontend (port 26172) |
| `pnpm run typecheck` | Full TypeScript typecheck across all packages |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev only) |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks and Zod schemas from OpenAPI spec |

---

## Architecture Overview

```
Browser
  └── React Frontend (Vite, Clerk auth)
        └── /api/* proxy
              └── Express API Server (Clerk auth middleware)
                    └── PostgreSQL (Drizzle ORM)
```

- **Contract-first API:** The OpenAPI spec in `lib/api-spec/` is the single source of truth. Orval generates typed React Query hooks and Zod schemas from it automatically.
- **Auth:** Clerk handles authentication end-to-end. All API routes are protected via `requireAuth` middleware using `getAuth` from `@clerk/express`.
- **Personalisation:** Scholarships, exams, resources, and mentors are all filtered server-side based on the authenticated user's profile (category, state, stream, career interest).
- **Profile upsert:** The `POST /profile` endpoint creates or updates — so the same form handles both first-time setup and edits.

---

## SDG Alignment

- **SDG 4** — Quality Education
- **SDG 10** — Reduced Inequalities

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run typechecks: `pnpm run typecheck`
5. Commit and push: `git push origin feature/your-feature`
6. Open a Pull Request

---

## License

MIT
