# Apple-Inspired Design Brief — Devlink Portfolio UI/UX Redesign

Target aesthetic: apple.com. The codebase already ships most of the Apple design tokens —
your job is to make every page *feel* like Apple: big display typography, generous whitespace,
frosted-glass surfaces, restrained color, zero visual noise, buttery motion.

## 1. Typography (SF Pro ≈ Inter — already loaded, keep `Inter`)

| Role | Apple value | Equivalent to use |
|---|---|---|
| Hero / display | 80px / 600 / lh 84 / tracking −1.2px | `text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]` (or existing `.heading-primary` pushed to `lg:text-[4.5rem]`) |
| Section title | 40–56px / 600 / tight | `.heading-secondary` / `text-4xl md:text-5xl` |
| Body | 17px / 400 / lh 25 / tracking −0.374px | `text-[17px] leading-[1.5]` (existing `text-content-muted` body text is fine) |
| Eyebrow / label | 12px / 600 / uppercase / wide tracking | existing `.section-label` pattern |

Apply negative letter-spacing (`tracking-tight`, `-tracking-[0.01em]`) on all large headings.
Never use `font-black`/`font-extrabold` on big display text — Apple uses **600 semibold** max.

## 2. Color (tokens already exist — ALWAYS use them, never raw palette colors)

- `bg-bg` `#fbfbfd` ≈ Apple `#fafafc`; `bg-surface-muted` `#f5f5f7` = Apple card bg; `text-content` `#1d1d1f`; `text-content-muted` `#6e6e73`; `border-line` `#e5e5ea`
- Action blue `--accent` `#0071e3` on company pages; portfolio accent is per-user.
- **Depth comes from fill hierarchy (white → #f5f5f7 → #e8e8ed), not drop shadows.** Keep shadows subtle (existing `--glass-shadow*`).
- Dark mode: everything inverts automatically via tokens. **Never hardcode light-only colors** (`text-neutral-900`, `bg-neutral-100`, `text-orange-600`, etc.). Semantic states may keep green/red/amber.

## 3. Glassmorphism (already in `index.css` — reuse, don't reinvent)

- `.glass-header`, `.navbar-shell`/`.navbar-bar`, `.about-glass-card`, `.skills-glass-card`, `.achievement-glass-card`, `.featured-stack-card__inner` — frosted `backdrop-blur` + translucent `--glass-bg`.
- For inline glass: `backdrop-blur-xl backdrop-saturate-150 bg-white/70 dark:bg-[rgba(20,20,23,0.7)]`.

## 4. Shape & spacing

- Buttons: **pill** `rounded-full`, generous padding `px-6 py-3`, 17px semibold — Apple's standard blue pill. (`.btn-primary` is rounded-lg; on hero/CTA you may add `rounded-full`.)
- Cards: `rounded-2xl`–`rounded-[1.75rem]`, `p-6 md:p-8`, 1px `border-line` or `border-[var(--glass-border)]`.
- Spacing: 8px grid, generous section rhythm (`py-24 md:py-32`), `gap-4/5/6` grids.

## 5. Motion

- Durations: short 150ms (hovers), medium 300ms (transitions), long 500ms+ (reveals).
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (already the project standard).
- Scroll reveals exist via `.scroll-reveal` / `animate-fade-in-up`. Respect `prefers-reduced-motion` (already handled globally).
- Hover: gentle `-translate-y-0.5/1`, border-color shifts, no bounce.

## 6. Signature page patterns to apply

- **Hero**: one huge display headline, a one-line muted subhead, pill CTA + ghost CTA, optional floating chips. Center or left align; generous top padding so type floats in whitespace.
- **Editorial article (blog post)**: centered `max-w-prose` (≈65ch), display title `text-4xl md:text-5xl`, clean meta row with dot separators, glass cover image `rounded-[1.75rem]`, refined markdown prose that works in dark mode.
- **Card grids**: consistent glass cards, line-clamped text, icon chips, hover lift.
- **Section alternation**: subtle `bg-surface-muted` bands between sections.

## 7. Hard constraints

1. **Do NOT modify `FE/src/index.css`** — shared file, integration handled separately.
2. Do NOT modify `package.json`, `services/*`, `types/*`, or files owned by other agents.
3. Keep every existing export, prop interface, route, and API call identical.
4. Must pass `npx tsc -b` (noEmit typecheck) — strict, no unused vars.
5. Preserve accessibility: `aria-label`s, focus-visible rings, `prefers-reduced-motion`.
6. Prefer existing design-system classes; use Tailwind arbitrary values with CSS vars (`bg-[var(--glass-bg)]`) only when nothing existing fits.
7. If a component has an Apple-wrong color (e.g. `orange-*`, `neutral-*` hardcodes) fix it to tokens.
