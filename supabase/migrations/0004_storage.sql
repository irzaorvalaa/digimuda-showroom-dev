-- 0004_storage.sql — bucket "cars" & "brand-logos"
-- Public read (gambar katalog); upload/update/delete hanya is_admin().
-- Catatan: paket GRATIS Supabase — TIDAK ada image transformation,
-- optimasi gambar sepenuhnya lewat next/image.

insert into storage.buckets (id, name, public)
values
  ('cars', 'cars', true),
  ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

-- Baca publik untuk kedua bucket
create policy "storage_public_read" on storage.objects
  for select using (bucket_id in ('cars', 'brand-logos'));

create policy "storage_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('cars', 'brand-logos') and is_admin());

create policy "storage_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('cars', 'brand-logos') and is_admin())
  with check (bucket_id in ('cars', 'brand-logos') and is_admin());

create policy "storage_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('cars', 'brand-logos') and is_admin());