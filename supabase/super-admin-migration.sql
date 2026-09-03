-- Run once in the existing Poly League Supabase project.
-- This migration does not create a new project or recreate existing data.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('captain', 'super_admin'));
alter table public.profiles alter column team_id drop not null;
alter table public.profiles drop constraint if exists captain_team_required;
alter table public.profiles add constraint captain_team_required
  check (role = 'super_admin' or team_id is not null);

alter table public.highlights add column if not exists approval_status text
  check (approval_status in ('pending', 'approved', 'rejected')) not null default 'approved';
update public.highlights set approval_status = 'approved' where approval_status is null;
alter table public.highlights alter column approval_status set default 'pending';
alter table public.highlights add column if not exists created_by uuid references auth.users(id);
alter table public.highlights add column if not exists reviewed_by uuid references auth.users(id);
alter table public.highlights add column if not exists reviewed_at timestamptz;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin');
$$;

drop policy if exists "Allow public read highlights" on public.highlights;
create policy "Allow public read approved highlights" on public.highlights
  for select using (approval_status = 'approved');
create policy "Allow captains to submit highlights" on public.highlights
  for insert with check (auth.uid() is not null and approval_status = 'pending');
create policy "Allow captains to edit pending highlights" on public.highlights
  for update using (created_by = auth.uid() and approval_status = 'pending')
  with check (created_by = auth.uid() and approval_status = 'pending');
create policy "Allow super admins to review highlights" on public.highlights
  for update using (public.is_super_admin()) with check (public.is_super_admin());
create policy "Allow super admins to delete highlights" on public.highlights
  for delete using (public.is_super_admin());

create or replace function public.protect_match_scoreline()
returns trigger language plpgsql security definer set search_path = public as $$
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
drop trigger if exists protect_match_scoreline on public.matches;
create trigger protect_match_scoreline before update on public.matches
for each row execute function public.protect_match_scoreline();

drop policy if exists "Allow super admins to insert matches" on public.matches;
create policy "Allow super admins to insert matches" on public.matches
  for insert with check (public.is_super_admin());
drop policy if exists "Allow super admins to update any match" on public.matches;
create policy "Allow super admins to update any match" on public.matches
  for update using (public.is_super_admin()) with check (public.is_super_admin());
drop policy if exists "Allow super admins to delete matches" on public.matches;
create policy "Allow super admins to delete matches" on public.matches
  for delete using (public.is_super_admin());

-- After creating Mouici in Authentication > Users, replace the UUID below and run once.
-- A super admin is global and intentionally has no team assignment.
-- update public.profiles
-- set role = 'super_admin', team_id = null, full_name = 'Mouici'
-- where id = 'MOUICI_AUTH_USER_UUID';

-- Replace this UUID with the Auth user UUID of the one super admin.
-- update public.profiles set role = 'super_admin', team_id = null
-- where id = 'SUPER_ADMIN_AUTH_USER_UUID';