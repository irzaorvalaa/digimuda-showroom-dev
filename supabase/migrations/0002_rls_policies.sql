-- 0002_rls_policies.sql — Row Level Security WAJIB di semua tabel
-- Aturan: baca publik untuk brands & cars; tulis hanya is_admin();
-- inquiry boleh dikirim siapa saja, dibaca/di-update hanya admin.

alter table brands enable row level security;
alter table cars enable row level security;
alter table inquiries enable row level security;
alter table admins enable row level security;

-- ============ BRANDS ============
create policy "brands_select_public" on brands
  for select using (true);

create policy "brands_insert_admin" on brands
  for insert to authenticated with check (is_admin());

create policy "brands_update_admin" on brands
  for update to authenticated using (is_admin()) with check (is_admin());

create policy "brands_delete_admin" on brands
  for delete to authenticated using (is_admin());

-- ============ CARS ============
-- SELECT publik untuk SEMUA status (available/sold/reserved) —
-- filter status dilakukan di query, bukan di policy.
create policy "cars_select_public" on cars
  for select using (true);

create policy "cars_insert_admin" on cars
  for insert to authenticated with check (is_admin());

create policy "cars_update_admin" on cars
  for update to authenticated using (is_admin()) with check (is_admin());

create policy "cars_delete_admin" on cars
  for delete to authenticated using (is_admin());

-- ============ INQUIRIES ============
-- Siapa saja boleh mengirim inquiry (form contact).
create policy "inquiries_insert_public" on inquiries
  for insert with check (true);

create policy "inquiries_select_admin" on inquiries
  for select to authenticated using (is_admin());

create policy "inquiries_update_admin" on inquiries
  for update to authenticated using (is_admin()) with check (is_admin());

-- ============ ADMINS ============
-- Sengaja TIDAK ada policy: tabel hanya dibaca lewat fungsi is_admin()
-- (security definer). Tanpa policy, semua akses langsung terblokir RLS.