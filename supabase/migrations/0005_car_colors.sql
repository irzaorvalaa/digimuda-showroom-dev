-- 0005_car_colors.sql — tabel warna per mobil + galeri per warna.
-- Setiap mobil bisa punya banyak pilihan warna; tiap warna punya galeri
-- gambar sendiri (gallery_urls). Warna is_default ditampilkan pertama.

create table car_colors (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null
    constraint car_colors_car_id_fkey
    references cars(id) on delete cascade,
  name text not null,
  hex text not null check (hex ~ '^#[0-9A-Fa-f]{6}$'),
  gallery_urls text[] not null default '{}',
  is_default boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============ RLS ============
alter table car_colors enable row level security;

-- Publik boleh membaca warna + galeri (data publik, seperti cars).
create policy "car_colors_select_public" on car_colors
  for select using (true);

-- Tulis hanya admin, konsisten dengan tabel cars.
create policy "car_colors_insert_admin" on car_colors
  for insert to authenticated with check (is_admin());

create policy "car_colors_update_admin" on car_colors
  for update to authenticated using (is_admin()) with check (is_admin());

create policy "car_colors_delete_admin" on car_colors
  for delete to authenticated using (is_admin());

-- ============ INDEX ============
-- Pencarian warna per mobil, urut berdasar sort_order lalu nama.
create index idx_car_colors_car on car_colors(car_id, sort_order);