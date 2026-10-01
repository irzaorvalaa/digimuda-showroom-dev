-- 0008_interior_hex.sql — kode hex warna interior.
-- interior_color (nama material, contoh "Burnt Oak / Linen") tetap dipertahankan;
-- kolom baru ini hanya untuk swatch visual di halaman detail mobil.

alter table cars
  add column if not exists interior_hex text
  check (interior_hex is null or interior_hex ~ '^#[0-9A-Fa-f]{6}$');