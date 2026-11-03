# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Repository layout

- `BE/` — Django REST Framework backend (multi-tenant portfolio platform "DevLink").
  - `BE/portfolio/` — portfolio content models, serializers, admin, OG preview views.
  - `BE/company/` — company site profile and featured developers.
  - Local dev database is SQLite (`BE/db.sqlite3`) unless `DATABASE_URL` is set.
  - `BE/.env` exists for deployment configuration — never commit it, never run
    commands against it unintentionally.
- `FE/` — React 19 + TypeScript + Vite + Tailwind frontend served behind Nginx.

## Commands

Frontend (run inside `FE/`):

```bash
npm run dev        # dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint
npm run test       # vitest run (jsdom)
```

Backend (run inside `BE/`, use `BE/.venv/Scripts/python.exe` on Windows):

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test portfolio
```

When validating migrations, do it against a throwaway SQLite database by
overriding `DATABASE_URL` (e.g. `sqlite:///C:/tmp/check.sqlite3`), never
against `.env`/production settings.

## Non-negotiable rules

1. **Multi-tenant platform.** Shared components (`PortfolioLayout`, sections,
   pages) must render from API data only — never hardcode one portfolio's
   personal details (name, role, location, links) into shared code. Personal
   content lives in the database and is edited through the Django admin.
2. **Truthful content.** Never invent contributions, metrics, testimonials,
   client counts or screenshots. Known limitations (e.g. Fuel Planner's
   79-of-6,626 station coverage) must stay visible. Assessment projects are
   labeled as assessments.
3. **Routes are public API.** Preserve existing public URLs
   (`/achievements` is the Experience & Education page; `/projects/:slug` and
   `/blog/:slug` unchanged). Renaming navigation labels is fine; breaking
   routes is not.
4. **One metadata owner.** Route titles, descriptions, canonical URLs, OG and
   Twitter tags are set exclusively through `FE/src/utils/routeMetadata.ts`
   (`useRouteMetadata` per page). Do not set `document.title` directly
   elsewhere; it caused stale-title leaks between routes.
5. **Dates.** Experience/education milestones use representative day-2 dates;
   display them at month/year precision only. Do not present them as exact
   days.
6. **Accessibility baseline.** WCAG 2.2 AA is the target: keyboard-operable
   actions with visible focus and specific accessible names, no hover-only
   functionality, dialog semantics for the mobile drawer, reduced-motion
   support preserved.
7. **Encoding discipline on Windows.** PowerShell here behaves like Windows
   PowerShell 5.1 for text I/O: always pass `-Encoding UTF8` to
   `Get-Content`/`Set-Content`, or use `ReadAllText`/`WriteAllText` with an
   explicit encoding. A naive round-trip double-encodes UTF-8.

## Regression coverage expectations

Frontend Vitest tests live in `FE/src/test/` and cover: route title
lifecycle (including the project→Contact stale-title regression), mobile
drawer focus/Escape/inert behavior, and permanently visible project actions.
Backend tests in `BE/portfolio/tests.py` cover the experience/education
content-type migration and API delivery.

Run both suites before proposing a commit.
