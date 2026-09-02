# Poly League Tournament Website — Build Prompt for Antigravity

Paste everything below into Antigravity as the project brief. It's written as a direct instruction to the agent.

---

## 0. Project Summary

Build **Poly League**, a responsive full-stack website for an 8-team college football tournament. The site must publish the full competition format, live/upcoming fixtures, standings, squads, team captains, and last season's highlights, and include an admin dashboard for team captains — who are the tournament's only organizers, there is no separate super-admin role — to directly manage their own team's squad and match schedule.

The visual identity must match the attached brand assets **exactly** — do not default to a generic sports-template look.

---

## 1. Tech Stack (required, do not substitute)

- **Frontend & Backend:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (Postgres + Supabase Auth + Row Level Security + Realtime)
- **Hosting:** Vercel (frontend), Supabase Cloud (database)
- **Realtime:** Supabase Realtime channel on the `matches` table so live scores update on viewers' screens without a refresh

---

## 2. Assets Provided (place in `/public/assets/`)

| File | Use |
|---|---|
| `Logo_polyleague.png` | Site logo / favicon / navbar mark |
| `asset.png` | Background texture (diagonal blue stripe pattern used behind headers) |
| `Design_System.ai` | Source-of-truth brand file — **open this first if your tooling supports Illustrator files.** If it can't be parsed, fall back to the tokens in Section 3 below, which were extracted by visual inspection of the announcement posts. |
| `AUTO.png`, `DATA.png`, `ELN.png`, `ELT.png`, `INDUS.png`, `MECA.png`, `mtrx.png`, `QHSE.png` | The 8 competing teams' badges |
| `Tournament Rules` (folder) | Full official rules text — treat as the authoritative source if it conflicts with anything paraphrased below |

**Assumption:** the 8 badge files map 1:1 to the 8 competing teams (AUTO, DATA, ELN, ELT, INDUS, MECA, MTRX/Matériaux, QHSE). Confirm names against the Tournament Rules doc before hardcoding.

---

## 3. Design System (colors measured by pixel-sampling the actual screenshots)

These hex values were extracted directly from the announcement post images (median-sampled from flat color regions, not eyeballed), so treat them as reliable unless `Design_System.ai` gives you a cleaner source value.

**Colors** (Tailwind config, extend theme):
```js
colors: {
  'pl-blue': '#05069D',        // primary royal blue — main header/banner background fill
  'pl-blue-accent': '#0F14C5', // slightly brighter blue used for "VS" text and table header row (sampled #0906C3–#2127C9 across posts; this is the middle of that range)
  'pl-black': '#050505',       // heading text — effectively true black
  'pl-body-bg': '#F6F6F6',     // off-white page/body background
  'pl-gold-flat': '#A58B5C',   // flat gold used for inline emphasized text (e.g. "THE FINAL PHASE")
  'pl-gold-start': '#DEBE76',  // gold gradient — light end (use for pill/badge backgrounds)
  'pl-gold-mid': '#8F703A',    // gold gradient — dark middle (metallic shine effect, light→dark→light)
  'pl-green': '#037F13',       // standings: qualifies directly (rank 1–2)
  'pl-amber': '#CEA70D',       // standings: playoff zone (rank 3–6)
  'pl-red': '#C90508',         // standings: eliminated (rank 7–8)
}
```
Gradient for "SEMI FINAL" / "FINAL" / "PLAY OFF" pills: `linear-gradient(90deg, #DEBE76 0%, #8F703A 50%, #DEBE76 100%)` — a horizontal light→dark→light metallic sheen, not a simple two-stop gradient.

**Typography — honest assessment:**
I don't have a dedicated font-matching tool, so I can't give you a guaranteed-exact font name — but here's what the letterforms actually show under close inspection, so you (or Antigravity) can match it precisely if needed:
- All-caps, bold/heavy weight, uniformly condensed, with a consistent forward italic slant (not just a CSS skew — the strokes themselves look drawn at an angle).
- Distinctive angled/chamfered cuts at stroke terminals (most visible on the top of the "A" and the left arm of the "M" and "N") — this is a common trait of dedicated "sports/esports display" font families rather than a general-purpose grotesque.
- If `Design_System.ai` names the font, use that. If you need a free, license-safe substitute that gets close on weight and condensation (though it won't replicate the chamfered cuts), use:
  - `Anton` (Google Fonts) — closest widely-available match for weight + condensation
  - `Bebas Neue` with a `skew-x-[-8deg]` transform as a fallback
- Body/data text (standings, squads, schedule): a clean neutral sans like `Inter` or `Work Sans` for legibility at small sizes.

**Layout motifs to replicate:**
- Header banner: solid blue background with a diagonal repeating-stripe texture (`asset.png`), large italic white "ANNOUNCEMENT"-style title, small running-footballer icon top-right.
- Body sections: white/light-gray background with the same faint diagonal stripe watermark, centered bold black headline text.
- Bracket/fixture blocks: team badge — "VS" in bold blue — team badge, arranged in a 2-column grid per matchday.
- Standings table: numbered rank column colored by outcome (green = qualifies directly, amber = playoff zone, red = eliminated), columns for MP / GF / GA / GD / Points, points column bold blue.
- Finals content ("SEMI FINAL", "FINAL", "PLAY OFF") uses a gold gradient pill/banner label above the matchup.
- Announcement-style content blocks (used on the homepage "News/Updates" feed) should reuse the exact carousel pattern from the source posts: left/right chevron arrows, dot pagination at the bottom, one message per slide.

---

## 4. Site Map

1. **Home** — hero banner (announcement style), live/upcoming match ticker, quick links to Standings / Fixtures / Teams, latest 2–3 announcement-carousel posts.
2. **Format & Rules** — the two-phase structure below, rendered as scrollable sections (mirrors the 5 announcement posts you were shown).
3. **League Phase** — matchday-by-matchday fixtures (UCL-style, 4 games per team) + live standings table with color-coded zones.
4. **Knockout Phase** — Play-off bracket (3rd–6th place) → Semi-Final → Final, rendered as a visual bracket.
5. **Teams** — grid of 8 team badges; click through to a team page with captain name, full squad roster, and that team's results.
6. **Team Captains** — directory table (badge, captain name) matching the source post layout.
7. **Schedule** — full calendar/list view of all matches with date, time, venue, phase.
8. **Last Edition Highlights** — previous season recap: final result, top scorer/MVP, photo/video gallery.
9. **Admin Dashboard** (auth-protected, see Section 7).

---

## 5. Tournament Format to Encode as Content

**Phase 1 — League Phase (UCL-style):**
- 8 teams, each plays 4 games; fixtures set by a draw.
- Standings ranked by Points, then GD, then GF.
- 1st & 2nd place → proceed directly to the Final Phase.
- 7th & 8th place → eliminated.
- 3rd–6th place → enter a Play-off.

**Phase 2 — Final Phase:**
- Play-off: 3rd-6th ranked teams play a knockout round to produce 2 more finalists.
- The 2 direct qualifiers (1st/2nd) + 2 play-off winners = final 4.
- Semi-Final (knockout) → Final.

Build the standings table and bracket components generically (driven by data, not hardcoded) so they work for future seasons too.

---

## 6. Data Model (Supabase / Postgres)

```sql
-- Teams
teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  badge_url text not null,
  created_at timestamptz default now()
)

-- Profiles (linked to Supabase Auth users) — captains are the only admin role, no separate organizer tier
profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text check (role = 'captain') not null default 'captain',
  team_id uuid references teams(id) not null
)

-- Players
players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) not null,
  name text not null,
  number int,
  position text,
  photo_url text
)

-- Matches
matches (
  id uuid primary key default gen_random_uuid(),
  phase text check (phase in ('league','playoff','semifinal','final')) not null,
  matchday int,
  home_team_id uuid references teams(id) not null,
  away_team_id uuid references teams(id) not null,
  scheduled_at timestamptz,
  venue text,
  home_score int,
  away_score int,
  status text check (status in ('scheduled','live','finished')) default 'scheduled'
)

-- Highlights (last edition)
highlights (
  id uuid primary key default gen_random_uuid(),
  season text not null,
  title text not null,
  description text,
  media_url text,
  media_type text check (media_type in ('image','video'))
)
```

Standings should be a **derived view** (SQL view or computed on the client) from `matches`, not a stored table — recompute Points/GF/GA/GD from finished matches.

---

## 7. Admin Dashboard & Roles

Single role: **Captain**. There is no separate organizer/super-admin tier — the 8 captains collectively are the tournament's admins. Each captain, once logged in, can:

- Add/edit/remove players in **their own team's** squad directly, no approval step.
- Edit the date/time (and venue) of **any match involving their own team** directly — writes straight to `matches.scheduled_at`, no request/approval queue.
- Enter/update the score and status for matches involving their own team once played.

**RLS policy pattern:**
- `players`: write allowed where `team_id = (select team_id from profiles where id = auth.uid())`.
- `matches`: write allowed where `auth.uid()`'s `team_id` matches either `home_team_id` or `away_team_id` on that row.

**Edge case worth deciding up front:** both captains in a fixture can edit that match's time/score — last write wins, there's no conflict resolution or approval layer. If that's not acceptable in practice (e.g. one captain changing a time the other didn't agree to), the simplest fix without adding a new role is a `matches.last_updated_by` column shown in the UI so both captains can see who last touched it, or requiring both captains' confirmation before a time change is finalized. Flag this to Antigravity as a decision point rather than assuming.

Auth: Supabase email/password (magic link optional). Seed one `profiles` row per captain from the Team Captains list, linked to their team.

---

## 8. Responsive & UX Requirements

- Mobile-first Tailwind layout; standings table collapses to stacked cards below `sm` breakpoint.
- Bracket view scrolls horizontally on mobile with snap points.
- Admin dashboard forms (squad editor, schedule/time editor) must be usable one-handed on a phone.
- Announcement carousel uses touch swipe on mobile, arrow buttons on desktop.

---

## 9. Deployment

- Push to GitHub, connect repo to Vercel for CI/CD.
- Supabase project for Postgres + Auth + Realtime; store keys in Vercel environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, service role key server-side only).

---

## 10. Seed Data

**Confirmed team ↔ captain pairings:**
| Team | Captain |
|---|---|
| AUTO | Amine Bennouar |
| DATA | Aouanouk Ahcene Zakaria |

**Remaining captains (team pairing still unconfirmed — cross-check against the Tournament Rules folder before seeding):**
- Himeur Yahia Anis
- Bakrar Lazher Amir El Islam
- Bedka Mohamed
- Louni Iskandar Yanir
- Mohamed Djihad Taieb Errahmani
- Taieb Islem Bouzaghou

**Remaining teams needing a captain assigned:** ELN, ELT, INDUS, MECA, MTRX, QHSE

---

## Notes / Open Questions to Resolve Before Building

1. Team-to-captain mapping for the remaining 6 teams/captains (AUTO and DATA are confirmed — see Section 10).
2. Whether public visitors need any account (currently assumed: public = read-only, no login required to view any page).
3. How to handle two captains editing the same match's time/score (see the edge case noted in Section 7) — decide before Antigravity builds the matches write logic.
