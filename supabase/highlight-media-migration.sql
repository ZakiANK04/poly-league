-- Run once in the Supabase SQL editor before using the file attachment controls.
-- The bucket is public so approved highlight images and videos can be displayed publicly.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'highlight-media',
  'highlight-media',
  true,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can upload highlight media" on storage.objects;
create policy "Authenticated users can upload highlight media"
on storage.objects for insert to authenticated
with check (bucket_id = 'highlight-media');
