# Poly League — Captain Portal & Supabase Integration Guide

This guide provides complete instructions for:
1. Accessing and using the confidential Captain Portal.
2. Connecting the project to Supabase Cloud and setting up live score Realtime synchronization.

---

## 1. Confidential Captain Portal Access

In strict accordance with the tournament spec, **there is no public login link or admin button on the website**. The Captain Portal is a confidential URL provided exclusively to the 8 department captains.

### Direct Access Link
- **Local Development:** [http://localhost:3000/captain-portal](http://localhost:3000/captain-portal) (or `/admin`)
- **Production (Vercel):** `https://your-domain.vercel.app/captain-portal`

### Captain Capabilities:
1. **Autonomous Department Access**:
   - The captain selects their department (**AUTO, DATA, ELN, ELT, INDUS, MECA, MTRX, QHSE**).
2. **Squad Registration & Live Publishing**:
   - Initial squad rosters are empty. As captains register players (Name, Kit Number, Position: GK, DEF, MID, FWD), the active roster is published immediately on the public department page (`/teams/[code]`).
   - Captains can edit, add, or remove players anytime.
3. **Fixture Schedule & Score Management**:
   - Change scheduled dates, times, and venues (**Beaulieu Stadium, Club 1 Stadium, Harrach Stadium**) for any match involving their department.
   - Enter live or full-time scores and toggle match status (`scheduled` → `live` → `finished`).
   - Displays an audit badge showing *"Last updated by Captain [Name]"*.
4. **Official Knockout Random Draw Ceremony**:
   - Under the **"Official Knockout Draw"** tab, captains view the qualification seeds from the League Standings (Seeds 1 & 2 direct to semifinals, Seeds 3 to 6 in the playoff pool).
   - Click **"Conduct Official Knockout Draw"** to trigger a live animated shuffle and celebratory confetti burst.
   - Once confirmed, the official bracket at `/bracket` and the knockout schedule at `/fixtures` immediately lock and display the drawn matchups.

---

## 2. Connecting to Supabase Cloud

The codebase is equipped with native Supabase integration (`@supabase/ssr` and `@supabase/supabase-js`) alongside local state fallback.

### Step 1: Create a Supabase Project
1. Log in to [https://supabase.com](https://supabase.com).
2. Click **New Project**.
3. Name your project (e.g. `poly-league-2026`), choose a database password and the nearest cloud region.

### Step 2: Retrieve API Keys
1. In the Supabase project dashboard, navigate to **Project Settings** (gear icon in sidebar) → **API**.
2. Copy:
   - **Project URL** (e.g. `https://yourprojectid.supabase.co`)
   - **Project API keys: `anon` `public`** (e.g. `eyJhbGciOi...`)

### Step 3: Configure Environment Variables
In your local `.env.local` file (and in Vercel project settings under Environment Variables):
```env
NEXT_PUBLIC_SUPABASE_URL=https://yourprojectid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 4: Run the Database Migration
1. In the Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Open the file `supabase/schema.sql` from this repository.
3. Copy the entire script and paste it into the Supabase SQL Editor.
4. Click **Run**.
   - This script creates all 5 tables: `teams`, `profiles`, `players`, `matches`, `highlights`.
   - Configures Row Level Security (RLS) policies allowing public read and captain-scoped write permissions.
   - Inserts the initial seed data for the 8 departments.
   - Adds the `matches` table to the `supabase_realtime` publication for instant score broadcasting.

### Step 5: Test Realtime Score Broadcasting
1. Open the homepage in two side-by-side browser tabs.
2. In Tab 1, navigate to `/captain-portal` and update a score or change match status to `LIVE`.
3. In Tab 2 (spectator view), watch the score update on the live match card and standings table instantaneously without reloading!
