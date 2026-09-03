-- ==========================================
-- POLY LEAGUE DATABASE SCHEMA & RLS POLICIES
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TEAMS TABLE
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  department text not null,
  badge_url text not null,
  created_at timestamptz default now()
);

-- 2. PROFILES TABLE (Linked to auth.users, restricted to Captains)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text check (role in ('captain', 'super_admin')) not null default 'captain',
  team_id uuid references teams(id),
  constraint captain_team_required check (role = 'super_admin' or team_id is not null),
  created_at timestamptz default now()
);

-- 3. PLAYERS TABLE
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade not null,
  name text not null,
  number int,
  position text check (position in ('GK', 'DEF', 'MID', 'FWD')),
  photo_url text,
  created_at timestamptz default now()
);

-- 4. MATCHES TABLE
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  phase text check (phase in ('league','playoff','semifinal','final')) not null,
  matchday int,
  round_label text,
  home_team_id uuid references teams(id) not null,
  away_team_id uuid references teams(id) not null,
  scheduled_at timestamptz,
  venue text not null default 'Beaulieu Stadium',
  home_score int,
  away_score int,
  status text check (status in ('scheduled','live','finished')) default 'scheduled',
  match_period text check (match_period in ('pre-match','first-half','second-half','full-time')) default 'pre-match',
  scorers jsonb not null default '[]'::jsonb,
  last_updated_by text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 5. HIGHLIGHTS TABLE
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  season text not null,
  title text not null,
  description text,
  media_url text,
  media_type text check (media_type in ('image','video')),
  content_type text check (content_type in ('score','article','video')) default 'article',
  scoreline text,
  tags text[] default '{}',
  approval_status text check (approval_status in ('pending','approved','rejected')) not null default 'pending',
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table teams enable row level security;
alter table profiles enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table highlights enable row level security;

-- Public read policies (all users can view the tournament details)
create policy "Allow public read teams" on teams for select using (true);
create policy "Allow public read profiles" on profiles for select using (true);
create policy "Allow public read players" on players for select using (true);
create policy "Allow public read matches" on matches for select using (true);
create policy "Allow public read highlights" on highlights for select using (approval_status = 'approved');

-- Captain write policies
-- 1. Captains can edit players only in their own team
create policy "Allow captains to insert own players" on players
  for insert with check (
    team_id = (select team_id from profiles where id = auth.uid())
  );

create policy "Allow captains to update own players" on players
  for update using (
    team_id = (select team_id from profiles where id = auth.uid())
  );

create policy "Allow captains to delete own players" on players
  for delete using (
    team_id = (select team_id from profiles where id = auth.uid())
  );

-- 2. Captains can edit matches involving their team
create policy "Allow captains to update own matches" on matches
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and (profiles.team_id = matches.home_team_id or profiles.team_id = matches.away_team_id)
    )
  );

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

create policy "Allow super admins to update any match" on matches
  for update using (public.is_super_admin()) with check (public.is_super_admin());
create policy "Allow super admins to insert matches" on matches
  for insert with check (public.is_super_admin());
create policy "Allow super admins to delete matches" on matches
  for delete using (public.is_super_admin());
create policy "Allow super admins to insert players" on players
  for insert with check (public.is_super_admin());
create policy "Allow super admins to update players" on players
  for update using (public.is_super_admin()) with check (public.is_super_admin());
create policy "Allow super admins to delete players" on players
  for delete using (public.is_super_admin());

create policy "Allow captains to submit highlights" on highlights
  for insert with check (auth.uid() is not null and approval_status = 'pending');

create policy "Allow captains to edit pending highlights" on highlights
  for update using (created_by = auth.uid() and approval_status = 'pending')
  with check (created_by = auth.uid() and approval_status = 'pending');

create policy "Allow super admins to review highlights" on highlights
  for update using (public.is_super_admin()) with check (public.is_super_admin());
create policy "Allow super admins to read all highlights" on highlights
  for select using (public.is_super_admin());
create policy "Allow super admins to publish highlights" on highlights
  for insert with check (public.is_super_admin() and approval_status = 'approved');

create policy "Allow super admins to delete highlights" on highlights
  for delete using (public.is_super_admin());

create or replace function public.protect_match_scoreline()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() and (
    new.home_score is distinct from old.home_score or
    new.away_score is distinct from old.away_score or
    new.status is distinct from old.status
  ) then
    raise exception 'Only a super admin can change scorelines or match status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_match_scoreline on matches;
create trigger protect_match_scoreline
before update on matches
for each row execute function public.protect_match_scoreline();

-- Enable Realtime for every synchronized table without failing on reruns.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matches') then
    alter publication supabase_realtime add table public.matches;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'players') then
    alter publication supabase_realtime add table public.players;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'highlights') then
    alter publication supabase_realtime add table public.highlights;
  end if;
end $$;

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert 8 Teams
insert into teams (id, code, name, department, badge_url) values
  ('11111111-1111-1111-1111-111111111101', 'AUTO', 'AUTO', 'Automation Engineering', '/assets/AUTO.png'),
  ('11111111-1111-1111-1111-111111111102', 'DATA', 'DATA', 'Data Science & A.I. Engineering', '/assets/DATA.png'),
  ('11111111-1111-1111-1111-111111111103', 'ELN', 'ELN', 'Electronics', '/assets/ELN.png'),
  ('11111111-1111-1111-1111-111111111104', 'ELT', 'ELT', 'Electrical', '/assets/ELT.png'),
  ('11111111-1111-1111-1111-111111111105', 'INDUS', 'INDUS', 'Industrial', '/assets/INDUS.png'),
  ('11111111-1111-1111-1111-111111111106', 'MECA', 'MECA', 'Mechanical Engineering', '/assets/MECA.png'),
  ('11111111-1111-1111-1111-111111111107', 'MTRX', 'MTRX', 'Materials (Matériaux)', '/assets/mtrx.png'),
  ('11111111-1111-1111-1111-111111111108', 'QHSE', 'QHSE', 'QHSE', '/assets/QHSE.png')
on conflict (code) do nothing;
