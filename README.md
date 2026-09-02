# POLY LEAGUE

> The official digital home of an eight-department football tournament.

Poly League turns a campus competition into a live matchday system: a UCL-inspired league phase, a seeded knockout bracket, public standings, department squads, captain-led operations, and a future fantasy mode built around the same tournament data.

## The Competition

- **8 departments** compete across a unified league table.
- **4 league matchdays** shape the table.
- **Ranks 1–2** advance directly to the semi-finals.
- **Ranks 3–6** enter the play-offs.
- **Ranks 7–8** are eliminated.
- Play-off winners join the top two for the semi-finals and grand final.

## Product Surface

| Area | Experience |
| --- | --- |
| Home | Matchday hero, announcements, standings, fixtures, departments |
| Fixtures | League and knockout schedule with live result states |
| Standings | Mobile cards and desktop table with qualification zones |
| Teams | Department identity, captains, squads, and results |
| Format | Icon-led explanation of the two-phase competition |
| Highlights | Approved tournament moments and editorial updates |
| Captain portal | Private roster, fixture settings, draws, and submissions |
| Super admin | Scoreline control, all squads, and highlight review queue |
| Fantasy mode | Future squad-building and competition layer, coming soon |

## Creative Direction

The interface is designed as a compact matchday editorial system rather than a generic sports dashboard. Royal blue, metallic gold, diagonal texture, condensed display type, and sharp qualification signals carry the identity from announcement artwork into a usable public website. The landing page ends with a glowing phone teaser for the next product chapter: fantasy football built around Poly League.

## Stack

- Next.js 14 App Router
- React and TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, RLS, and Realtime
- Framer Motion and Lucide icons
- Vercel deployment

## Run Locally

```powershell
npm install
npm run dev
```

Open the URL printed by Next.js. Validate before publishing:

```powershell
npm run lint
npm run build
```

## Roles

- **Public:** read-only access to published competition content.
- **Captain:** manages the assigned department squad and fixture settings, and submits news for review.
- **Super admin:** the only role allowed to change scorelines or match status, view all squads, and approve or reject highlights.

The super-admin database protection is defined in [`supabase/super-admin-migration.sql`](supabase/super-admin-migration.sql). Run it once in the existing Supabase project, then promote one existing Auth user to `super_admin` as described in the migration comments.

## Existing Supabase Deployment

This repository is designed to use an existing Supabase project. No second project is required. Configure the existing project URL and anon key in `.env.local` locally and in Vercel environment variables for production.

Read [`DEPLOY_EXISTING_SUPABASE.md`](DEPLOY_EXISTING_SUPABASE.md) for the complete GitHub, Vercel, Auth, RLS, and team-linking workflow.

## Security Notes

- `.env.local` is ignored and must never be committed.
- Passwords belong to Supabase Auth, never to `public.profiles`.
- Scoreline authority is enforced in the UI and by a Supabase trigger.
- Public highlights are filtered to approved items.
- Run `npm audit` before production deployment and review the remaining Next.js advisory status before going live.

## Roadmap

1. Connect all public mutations to Supabase persistence.
2. Add fixture conflict history and audit visibility.
3. Add captain-approved fantasy scoring rules.
4. Build the fantasy squad draft, points engine, and weekly leaderboard.
5. Add matchday notifications and shareable result cards.

## Status

UI overhaul complete, responsive layouts verified, super-admin control room implemented, and production build passing.
