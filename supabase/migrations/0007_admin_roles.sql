-- 0007_admin_roles.sql — role-based access untuk area admin.
--
--   super_admin → CREATE + READ + UPDATE + DELETE (kelola penuh)
--   admin       → CREATE + READ saja (input + lihat data, tanpa edit/hapus)
--
-- Enforce role ada di DUA tempat: UI (lib/queries/admin.ts) DAN RLS Supabase
-- (migration ini). RLS adalah source of truth — admin biasa TIDAK bisa
-- edit/hapus walau memanggil Server Action langsung.

-- ============ SKEMA ============
alter table admins
  add column if not exists role text not null default 'admin'
  check (role in ('super_admin', 'admin'));

-- Fungsi pembaca role. Sama seperti is_admin(), ini WAJIB security definer
-- karena tabel admins sengaja tidak punya policy SELECT (lihat 0002).
create or replace function current_admin_role()
returns text language sql security definer set search_path = public stable as $$
  select role from admins where user_id = auth.uid();
$$;

create or replace function is_super_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from admins where user_id = auth.uid() and role = 'super_admin');
$$;

-- Akun admin yang SUDAH ADA (staging) diangkat jadi super_admin agar tidak
-- terkunci setelah migrasi ini. Local selalu di-seed ulang — role di seed.sql.
update admins set role = 'super_admin' where role = 'admin';

-- ============ RLS: UPDATE & DELETE KINI HANYA SUPER_ADMIN ============
-- INSERT tetap is_admin() (semua role boleh create). SELECT tidak berubah.

drop policy if exists "brands_update_admin" on brands;
drop policy if exists "brands_delete_admin" on brands;

create policy "brands_update_super_admin" on brands
  for update to authenticated using (is_super_admin()) with check (is_super_admin());

create policy "brands_delete_super_admin" on brands
  for delete to authenticated using (is_super_admin());

drop policy if exists "cars_update_admin" on cars;
drop policy if exists "cars_delete_admin" on cars;

create policy "cars_update_super_admin" on cars
  for update to authenticated using (is_super_admin()) with check (is_super_admin());

create policy "cars_delete_super_admin" on cars
  for delete to authenticated using (is_super_admin());

drop policy if exists "car_colors_update_admin" on car_colors;
drop policy if exists "car_colors_delete_admin" on car_colors;

create policy "car_colors_update_super_admin" on car_colors
  for update to authenticated using (is_super_admin()) with check (is_super_admin());

create policy "car_colors_delete_super_admin" on car_colors
  for delete to authenticated using (is_super_admin());

-- inquiries: update status (new → contacted → closed) & hapus = super_admin.
drop policy if exists "inquiries_update_admin" on inquiries;

create policy "inquiries_update_super_admin" on inquiries
  for update to authenticated using (is_super_admin()) with check (is_super_admin());

create policy "inquiries_delete_super_admin" on inquiries
  for delete to authenticated using (is_super_admin());

-- Storage: upload tetap is_admin(), ganti/hapus file hanya super_admin.
drop policy if exists "storage_admin_update" on storage.objects;
drop policy if exists "storage_admin_delete" on storage.objects;

create policy "storage_super_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('cars', 'brand-logos') and is_super_admin())
  with check (bucket_id in ('cars', 'brand-logos') and is_super_admin());

create policy "storage_super_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('cars', 'brand-logos') and is_super_admin());