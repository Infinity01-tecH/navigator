# Navigator UI Design — Screens, Figma Reproduction & Quality Criteria

## Context

The Navigator codebase is fully implemented (logic, routing, Supabase calls, state). All 17 screens are functional but the visual polish has not been designed intentionally — they are working code, not designed interfaces. The goal is to replace the current UI with intentional designs created in Figma, then reproduce them accurately in React/Tailwind.

---

## Every Screen That Needs a Design

The app is locked to **390px wide** (mobile shell, `max-w-[390px]`). Design at iPhone 14 Pro size (390×844).

### Onboarding Flow (linear, one-way)

| # | Screen | Route | What it does |
|---|--------|--------|--------------|
| 1 | **Auth** | `/auth` | Sign in / Sign up — Google OAuth + email+password tabs, username completion for Google users |
| 2 | **Start** | `/` | Home — logo, "What do you want to learn?" input, Learning Type toggle, Mode selector (Full / Sprint / YouTube), skill autocomplete, CTA |
| 3 | **Sprint Config** | `/sprint` | Sprint mode only — duration picker (chips + custom) + goal textarea |
| 4 | **YouTube Config** | `/youtube` | YouTube mode only — creator toggle, AI-pick toggle, creator name input |
| 5 | **Fingerprint** | `/fingerprint` | Learning-style quiz — progress bar + one question + multiple-choice options |
| 6 | **Gap** | `/gap` | Skill level selector — 5 level cards (Complete beginner → Expert) |
| 7 | **SkillCheck** | `/skillcheck` | AI quiz — loading spinner → calibration questions → project gate → deep questions |
| 8 | **Time** | `/time` | Daily schedule — two sliders (hours/day, days/week) + live timeline estimate |
| 9 | **Generating** | `/generating` | AI generation loading — spinner, rotating status messages, timeout toast |

### Main App (5 internal tabs at `/main`)

| # | Tab | What it contains |
|---|-----|-----------------|
| 10 | **Today** | Streak strip (7-day flames), expandable 5-month calendar, today's step list with checkboxes, stats grid, achievement unlocks, streak partner cards |
| 11 | **Roadmap** | Collapsible roadmap cards → phases → steps with checkboxes, pin/unpin, Skill Crossover animated S-curve diagram |
| 12 | **Chat** | AI chat thread — message bubbles, input bar, typing indicator |
| 13 | **Inspire** | Scrollable YouTube video feed — embedded player cards |
| 14 | **Profile (own)** | Avatar, name, XP/level bar, streak numbers, stats, achievements, social links, nav to Settings/Friends/Notes |

### Secondary Screens (navigated from Main via buttons)

| # | Screen | Route | What it does |
|---|--------|--------|--------------|
| 15 | **Watch** | `/watch` | Immersive YT player — 16:9 iframe + overlay chrome (chapters, scrub bar, prev/next, fullscreen) + workspace panel (Chapters tab, Notes tab with RichEditor) + chapter-end quiz interrupt |
| 16 | **Settings** | `/settings` | Avatar editor overlay, display name, email, daily time budget, reminder toggle, visibility sharing, theme, data export, clear cache, danger zone (sign out / delete account / reset) |
| 17 | **Notes** | `/notes` | Two tabs — Topic Notes (roadmap-structured AI-generated notes with RichEditor) and My Notes (folder-based CRUD with RichEditor) |
| 18 | **Friends** | `/friends` | Incoming requests (accept/decline), friends list (streak partner tier promote/demote), username search |
| 19 | **Profile (others)** | `/profile/:id` | Public profile — identity + stats; scope depends on friendship tier (stranger / friend / streak partner) |
| 20 | **Notifications** | `/notifications` | Friend requests + streak partner tier proposals, Accept/Decline per card |

### Shared / Overlay Components (need design too)

These appear over multiple screens and need their own designs:

- **Avatar Editor** — full-screen overlay with glyph/color picker tabs (already has its own `src/components/avatarEditor/` module)
- **Streak Interrupt Modal** — daily miss detected, freeze option
- **Quiz Modal** — step-completion gate quiz
- **Quiz Result** — pass/fail + XP awarded
- **Dev Streak Panel** — dev tools overlay
- **Achievement unlock toast / card**
- **Reaction Bar** — emoji reactions on friend cards
- **Rich Editor** — formatting toolbar + content area

---

## Can You Paste a Figma File Here?

**Yes.** The workflow is:

1. Open Figma → select the frame(s) you want to reproduce
2. Use the **Figma Make** plugin (or Dev mode export) to export the frame as React code
3. Paste it into this chat — it arrives as `<figma_imported_react_code>` which I process with the `design-imports` skill

I can then map the Figma components to the real Navigator screen implementations, replacing placeholder JSX with the real logic while keeping your visual spec exactly.

---

## What You Need to Provide for Best Results

### 1. Design Tokens (Critical)
Export your Figma variables/styles and tell me:
- **Color palette** — all named colors (primary, surface, on-surface, muted, accent, destructive, success, etc.) in hex or oklch
- **Typography** — font family, size scale, weight names (you're using Inter in fonts.css — confirm this or change it)
- **Border radius** — the single `--radius` base value (currently `0.625rem`)
- **Spacing scale** — if you've deviated from Tailwind's default 4px grid

These map directly into `src/styles/theme.css` which drives all Tailwind utility classes.

### 2. Per-Screen, Per-State Coverage
For every screen, provide designs for **all states**, not just the happy path:

| State type | Examples |
|---|---|
| Empty / zero-data | No roadmaps, no friends, no notes |
| Loading | Skeleton loaders or spinners |
| Error | Failed fetch, network offline |
| Interactive states | Pressed, selected, disabled |
| Edge cases | Long names that overflow, 0 streak, max XP |

Screens where this matters most: Today tab (0 streak, freeze active), Roadmap tab (0 roadmaps), Friends (no friends, pending requests), Profile (stranger tier vs friend tier vs self).

### 3. Component Inventory
List your intended reusable components with their variants. For example:
- `Button` — primary / secondary / ghost / destructive, sizes (sm / md / lg), loading state
- `Card` — default / elevated / outlined
- `Badge` — streak, XP, level

This lets me map them cleanly to the existing `src/app/components/ui/` primitives.

### 4. Motion / Animation Notes
The app uses `motion/react` (Framer Motion). Note:
- Page transition style (currently opacity + Y slide, 180ms)
- Any micro-animations (e.g., streak flame pulse, XP bar fill, checkmark pop)
- The Skill Crossover S-curve is a custom SVG animation — if you have a spec for it, describe it

### 5. Icon Set
Currently `lucide-react` is used throughout. If your Figma uses a different icon set, name it so I can install it. If you've used custom icons, export them as SVG.

### 6. Which Screens You're Handing Off First
Given there are 20 distinct screens + overlays, tell me your priority order. I recommend starting with:
1. Design tokens + global shell (Layout)
2. Auth + Start (first impression)
3. Main app — Today tab (most complex, establishes the visual language)
4. Then the rest

### 7. What "Function Test" Means for Each Screen
You mentioned testing that every element has a function. For each screen I implement, tell me what actions you'll test so I know which interactive states to wire up vs. treat as static. For example:
- Today tab: Can you tap a step to check it off? Does the streak calendar expand? Does the stats grid update?
- Auth: Does Google OAuth button open the OAuth flow? Does the availability check debounce correctly?

---

## Implementation Plan (Once Designs Arrive)

For each Figma frame paste:

1. Load `design-imports` skill to parse the exported React code
2. Extract design tokens → write to `src/styles/theme.css` (preserving `@theme inline` contract)
3. Map Figma components to existing Radix UI / shadcn primitives in `src/app/components/ui/`
4. Replace the target screen's JSX with the Figma visual spec while keeping all existing state/logic/Supabase calls intact
5. Verify: check the route in the browser, test all interactive states, confirm Tailwind classes compile correctly

No logic will be replaced — only the visual layer (JSX structure, Tailwind classes, layout).

---

## Verification Approach

For each screen after implementation:
- Open the route in browser (app runs on Vite dev server)
- Walk through every interactive element (the user will do this and report back)
- Check loading, empty, and error states
- Confirm Supabase calls still fire correctly (network tab)
- Confirm no TypeScript errors (`pnpm build` must pass)
