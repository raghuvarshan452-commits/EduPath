<div align="center">

# EduPath

**Personalized Education Navigator for First-Generation College Students in India**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933.svg)](https://nodejs.org/)

*Bridging the information gap — one student at a time.*

</div>

---

## The Problem

Millions of first-generation college students in India have the talent but not the guidance. They navigate a fragmented landscape of scholarships, entrance exams, mentors, and learning resources — often alone and without a roadmap.

**EduPath changes that.** A single personalized platform that meets every student where they are and shows them exactly where to go next.

---

## Features

### Personalized Dashboard
A unified view of what matters most: upcoming exam deadlines, relevant scholarships, suggested mentors, and curated learning resources — all filtered to the student's profile.

### Scholarship Finder
Filter and discover scholarships by category, financial background, educational stream, state, and career interests. No more drowning in irrelevant results.

### Exam Calendar
Stay on top of entrance exam schedules and application deadlines with career-relevance context — JEE, NEET, CLAT, and more.

### Mentor Connect
Connect with alumni, seniors, industry professionals, and first-generation achievers who've walked the same path.

### Free Learning Resources
Curated links to NPTEL, SWAYAM, Khan Academy, and government portals — quality education, zero cost.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 · Vite · Tailwind CSS v4 |
| **Backend** | Express.js 5 |
| **Database** | PostgreSQL · Drizzle ORM |
| **Authentication** | Clerk |
| **Validation** | Zod · drizzle-zod |
| **API Architecture** | OpenAPI spec → Orval codegen → typed React Query hooks |
| **Language** | TypeScript 5.9 |
| **Package Manager** | pnpm workspaces |

---

## Architecture

```
Frontend (React + Vite)        →  Clerk auth, React Query, wouter routing
         ↓
Express API Server             →  /api/* routes, requireAuth middleware
         ↓
PostgreSQL + Drizzle ORM       →  profiles, scholarships, exams, resources, mentors
         ↓
Recommendation Engine          →  server-side filtering based on student profile
```

The API contract is **spec-first**: `lib/api-spec/openapi.yaml` is the single source of truth, and typed client hooks are generated via Orval.

---

## Project Structure

```
├── artifacts/
│   ├── edupath/               # React frontend
│   │   └── src/
│   │       ├── pages/         # landing, dashboard, profile, scholarships,
│   │       │                  # exams, resources, mentors, not-found
│   │       ├── components/
│   │       │   └── layout.tsx # Sidebar + nav for authenticated pages
│   │       ├── App.tsx        # Clerk + Wouter routing
│   │       └── index.css      # Theme — saffron/amber primary, cream bg
│   └── api-server/            # Express API server
│       └── src/routes/        # profile, scholarships, exams, resources,
│                              # mentors, dashboard, health
├── lib/
│   ├── db/src/schema/         # Drizzle schema definitions
│   ├── api-spec/              # OpenAPI spec (source of truth)
│   └── api-client-react/      # Generated React Query hooks (via Orval)
└── scripts/
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/edupath.git
cd edupath

# Install dependencies
pnpm install
```

### Environment Setup

```bash
# Create a .env file and set:
DATABASE_URL=your_postgres_connection_string
```

### Running Locally

```bash
# Start the API server (port 8080, proxied at /api)
pnpm --filter @workspace/api-server run dev

# Start the frontend (port 26172, proxied at /)
pnpm --filter @workspace/edupath run dev
```

### Other Commands

```bash
# Full typecheck across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push
```

---

## Key Design Decisions

- **Contract-first API** — OpenAPI spec drives Orval codegen, keeping frontend and backend in sync automatically.
- **Clerk auth** — `@clerk/react` on the frontend, `@clerk/express` on the API with `requireAuth` middleware protecting all routes.
- **Server-side personalisation** — scholarships, exams, resources, and mentors are filtered based on the authenticated user's profile on every request.
- **Upsert profile pattern** — a single `POST /profile` endpoint handles both creation and updates.

---

## SDG Alignment

| Goal | How EduPath Helps |
|---|---|
| **SDG 4 — Quality Education** | Equal access to educational guidance and high-quality free resources |
| **SDG 10 — Reduced Inequalities** | Bridges the information gap for first-generation and underprivileged students |

---

## Roadmap

- [ ] AI-powered mentor assistant chatbot
- [ ] Regional language support (Hindi, Tamil, Telugu, and more)
- [ ] Resume builder
- [ ] AI career recommendation engine
- [ ] Scholarship prediction system
- [ ] Mobile application (React Native / Expo)

---