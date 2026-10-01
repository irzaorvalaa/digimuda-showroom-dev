-- seed.sql — data dummy realistis untuk LOCAL + STAGING.
-- DILARANG dijalankan di production (data asli dari client).
-- Idempotent: aman dijalankan ulang (on conflict do nothing).
-- SEMENTARA: gambar memakai foto lokal di public/images/cars/ (path root-relatif,
-- dioptimasi otomatis oleh next/image). Ganti dengan foto Supabase Storage
-- setelah admin mengunggah foto asli ke bucket "cars".

-- ============ BRANDS ============
insert into brands (name, slug) values
  ('Bentley', 'bentley'),
  ('Mercedes-Benz', 'mercedes-benz'),
  ('BMW', 'bmw'),
  ('Porsche', 'porsche'),
  ('Ford', 'ford')
on conflict (slug) do nothing;

-- ============ CARS ============
-- 4 unit is_featured + available (pas untuk getFeaturedCars limit 4),
-- plus 1 sold, 1 reserved, 1 price null ("Ask Us") untuk uji filter.
insert into cars (
  slug, name, brand_id, year, price_idr, status,
  engine, power_hp, torque_nm, acceleration_0_100, top_speed_kmh,
  transmission, drivetrain, exterior_color, interior_color, mileage_km,
  description, is_featured, cover_image_url, gallery_urls
) values
  (
    'bentley-continental-gt-speed-2022',
    'Bentley Continental GT Speed',
    (select id from brands where slug = 'bentley'),
    2022, 8750000000, 'available',
    '6.0L W12 Twin-Turbo', 650, 900, 3.9, 335,
    '8-Speed Dual-Clutch', 'All-Wheel Drive', 'Hijau Botol', 'Kulit Coklat', 7420,
    'Full main dealer history in Jakarta, ceramic-coated since new. Rear-seat entertainment and the Naim audio system are intact; tires replaced at 6.800 km.',
    true,
    '/images/cars/bentley-continental-gt-speed.jpg',
    array['/images/cars/bentley-continental-gt-speed.jpg', '/images/cars/bentley-flying-spur.jpg']
  ),
  (
    'mercedes-amg-gt-63-s-4matic-2023',
    'Mercedes-AMG GT 63 S 4MATIC+',
    (select id from brands where slug = 'mercedes-benz'),
    2023, 5200000000, 'available',
    '4.0L V8 Biturbo', 630, 900, 3.2, 315,
    'AMG SPEEDSHIFT MCT 9-Speed', 'All-Wheel Drive', 'Abu-abu', 'Kulit Hitam', 4180,
    'AMG Driver A package and rear-axle steering optioned from the factory. One owner, service done at Sunter authorized workshop.',
    true,
    '/images/cars/mercedes-amg-gt-63-s.jpg',
    array['/images/cars/mercedes-amg-gt-63-s.jpg', '/images/cars/mercedes-s-580.jpg']
  ),
  (
    'bmw-m4-competition-xdrive-2023',
    'BMW M4 Competition xDrive',
    (select id from brands where slug = 'bmw'),
    2023, 2850000000, 'available',
    '3.0L I6 Twin-Turbo', 523, 650, 3.5, 290,
    '8-Speed M Steptronic', 'M xDrive', 'Abu-abu Tua', 'Kulit Hitam', 11250,
    'M Driver''s Package and carbon bucket seats. Front PPF still on, two sets of keys and original run-flat plus a spare wheel set included.',
    true,
    '/images/cars/bmw-m4-competition.jpg',
    array['/images/cars/bmw-m4-competition.jpg', '/images/cars/bmw-m8-competition.jpg']
  ),
  (
    'porsche-911-carrera-s-cabriolet-992-2022',
    'Porsche 911 Carrera S Cabriolet (992)',
    (select id from brands where slug = 'porsche'),
    2022, 4650000000, 'available',
    '3.0L Flat-Six Twin-Turbo', 444, 530, 3.7, 308,
    '8-Speed PDK', 'Rear-Wheel Drive', 'Silver', 'Kulit Merah Bordeaux', 9870,
    'Sport Chrono, PASM, and the Bose surround system on the original options list. Soft top has no repairs and the paint meter readings are factory across all panels.',
    true,
    '/images/cars/porsche-911-carrera-s.jpg',
    array['/images/cars/porsche-911-carrera-s.jpg']
  ),
  (
    'ford-mustang-gt-convertible-2021',
    'Ford Mustang GT Convertible',
    (select id from brands where slug = 'ford'),
    2021, 1650000000, 'available',
    '5.0L V8 Ti-VCT', 460, 550, 4.6, 250,
    '10-Speed Automatic', 'Rear-Wheel Drive', 'Merah', 'Kulit Hitam', 18340,
    'Active exhaust with the factory quad tips, magnetic dampers, and the comfort package. Recent major service with fresh fluids and a new battery.',
    false,
    '/images/cars/ford-mustang-gt.jpg',
    array['/images/cars/ford-mustang-gt.jpg']
  ),
  (
    'bmw-m8-competition-gran-coupe-2022',
    'BMW M8 Competition Gran Coupe',
    (select id from brands where slug = 'bmw'),
    2022, 4300000000, 'available',
    '4.4L V8 Twin-Turbo', 625, 750, 3.2, 305,
    '8-Speed M Steptronic', 'M xDrive', 'Merah Marun', 'Kulit Abu-abu', 6540,
    'Executive Lounge rear seats and the Bowers & Wilkins diamond surround system. Kept indoors since delivery; all four tires are the original batch.',
    false,
    '/images/cars/bmw-m8-competition.jpg',
    array['/images/cars/bmw-m8-competition.jpg', '/images/cars/bmw-m4-competition.jpg']
  ),
  (
    'mercedes-benz-s-580-4matic-2021',
    'Mercedes-Benz S 580 4MATIC',
    (select id from brands where slug = 'mercedes-benz'),
    2021, 3950000000, 'sold',
    '4.0L V8 Biturbo + EQ Boost', 503, 700, 4.4, 250,
    '9G-TRONIC', 'All-Wheel Drive', 'Hitam Metalik', 'Kulit Beige', 23780,
    'Executive package with rear first-class seats. Sold through our showroom in March; listed here for reference of our recent stock.',
    false,
    '/images/cars/mercedes-s-580.jpg',
    array['/images/cars/mercedes-s-580.jpg', '/images/cars/mercedes-amg-gt-63-s.jpg']
  ),
  (
    'bentley-flying-spur-mulliner-2020',
    'Bentley Flying Spur Mulliner',
    (select id from brands where slug = 'bentley'),
    2020, null, 'reserved',
    '6.0L W12 Twin-Turbo', 626, 820, 4.3, 325,
    '8-Speed Dual-Clutch', 'All-Wheel Drive', 'Krem', 'Kulit Krem', 15920,
    'Mulliner driving specification with the rotating display and diamond knurling on the vents. Price on request — currently held with a deposit.',
    false,
    '/images/cars/bentley-flying-spur.jpg',
    array['/images/cars/bentley-flying-spur.jpg', '/images/cars/bentley-continental-gt-speed.jpg']
  )
on conflict (slug) do nothing;

-- ============ INTERIOR HEX (0008) ============
-- Swatch warna interior. Nama material tetap di interior_color; kolom ini
-- hanya menambah kode hex untuk visual. Idempotent lewat where interior_hex is null.
update cars set interior_hex = case slug
  when 'bentley-continental-gt-speed-2022' then '#6b4a2f'
  when 'mercedes-amg-gt-63-s-4matic-2023' then '#1c1c1e'
  when 'bmw-m4-competition-xdrive-2023' then '#1c1c1e'
  when 'porsche-911-carrera-s-cabriolet-992-2022' then '#5e1a24'
  when 'ford-mustang-gt-convertible-2021' then '#1c1c1e'
  when 'bmw-m8-competition-gran-coupe-2022' then '#c8c9c6'
  when 'mercedes-benz-s-580-4matic-2021' then '#c9b391'
  when 'bentley-flying-spur-mulliner-2020' then '#d8ccb8'
  else interior_hex
end
where interior_hex is null;

-- ============ CAR COLORS ============
-- Satu mobil bisa punya beberapa pilihan warna; tiap warna punya galeri
-- sendiri. Idempotent: hanya insert jika mobil itu belum punya warna sama
-- sekali (menghindari duplikat saat seed dijalankan ulang).
insert into car_colors (car_id, name, hex, gallery_urls, is_default, sort_order)
select c.id, v.name, v.hex, v.gallery_urls, v.is_default, v.sort_order
from (values
  -- Bentley Continental GT Speed — 2 warna
  ('bentley-continental-gt-speed-2022', 'Hijau Botol', '#3F4A2F',
    array['/images/cars/bentley-continental-gt-speed.jpg', '/images/cars/bentley-flying-spur.jpg'], true, 0),
  ('bentley-continental-gt-speed-2022', 'Hitam Metalik', '#1C1C1C',
    array['/images/cars/bentley-flying-spur.jpg', '/images/cars/bentley-continental-gt-speed.jpg'], false, 1),

  -- Mercedes-AMG GT 63 S — 2 warna
  ('mercedes-amg-gt-63-s-4matic-2023', 'Abu-abu', '#6B6B6B',
    array['/images/cars/mercedes-amg-gt-63-s.jpg', '/images/cars/mercedes-s-580.jpg'], true, 0),
  ('mercedes-amg-gt-63-s-4matic-2023', 'Hitam', '#0A0A0A',
    array['/images/cars/mercedes-s-580.jpg', '/images/cars/mercedes-amg-gt-63-s.jpg'], false, 1),

  -- BMW M4 Competition — 2 warna
  ('bmw-m4-competition-xdrive-2023', 'Abu-abu Tua', '#3F3F3F',
    array['/images/cars/bmw-m4-competition.jpg', '/images/cars/bmw-m8-competition.jpg'], true, 0),
  ('bmw-m4-competition-xdrive-2023', 'Hijau Botol', '#3F4A2F',
    array['/images/cars/bmw-m8-competition.jpg', '/images/cars/bmw-m4-competition.jpg'], false, 1),

  -- Porsche 911 Carrera S — 2 warna
  ('porsche-911-carrera-s-cabriolet-992-2022', 'Silver', '#C0C0C0',
    array['/images/cars/porsche-911-carrera-s.jpg'], true, 0),
  ('porsche-911-carrera-s-cabriolet-992-2022', 'Merah', '#B91C1C',
    array['/images/cars/porsche-911-carrera-s.jpg'], false, 1),

  -- Ford Mustang GT — 1 warna
  ('ford-mustang-gt-convertible-2021', 'Merah', '#B91C1C',
    array['/images/cars/ford-mustang-gt.jpg'], true, 0),

  -- BMW M8 Competition — 1 warna
  ('bmw-m8-competition-gran-coupe-2022', 'Merah Marun', '#7F1D1D',
    array['/images/cars/bmw-m8-competition.jpg', '/images/cars/bmw-m4-competition.jpg'], true, 0),

  -- Mercedes-Benz S 580 (sold) — 1 warna
  ('mercedes-benz-s-580-4matic-2021', 'Hitam Metalik', '#1C1C1C',
    array['/images/cars/mercedes-s-580.jpg', '/images/cars/mercedes-amg-gt-63-s.jpg'], true, 0),

  -- Bentley Flying Spur Mulliner — 1 warna
  ('bentley-flying-spur-mulliner-2020', 'Krem', '#E8DFC8',
    array['/images/cars/bentley-flying-spur.jpg', '/images/cars/bentley-continental-gt-speed.jpg'], true, 0)
) as v(car_slug, name, hex, gallery_urls, is_default, sort_order)
join cars c on c.slug = v.car_slug
where not exists (
  select 1 from car_colors cc where cc.car_id = c.id
);

-- ============ INQUIRIES ============
-- Contoh masuk untuk demo admin panel (lokal/staging saja).
insert into inquiries (full_name, whatsapp, message, car_id, status, created_at) values
  (
    'Raka Hadinoto',
    '+6281224567103',
    'I would like to arrange a private viewing of the Continental GT Speed this Saturday afternoon. Is the car currently in the showroom?',
    (select id from cars where slug = 'bentley-continental-gt-speed-2022'),
    'new', now() - interval '2 days'
  ),
  (
    'Nadira Puspitasari',
    '+6281192034578',
    'Do you offer leasing for the AMG GT 63 S? My company can put the car under a fleet name.',
    (select id from cars where slug = 'mercedes-amg-gt-63-s-4matic-2023'),
    'contacted', now() - interval '9 days'
  ),
  (
    'Bagas Wicaksono',
    '+6285712349876',
    'Is the Flying Spur still open for offers, or is the deposit already placed? Happy to discuss over WhatsApp.',
    (select id from cars where slug = 'bentley-flying-spur-mulliner-2020'),
    'new', now() - interval '17 hours'
  )
on conflict do nothing;
-- ============ ADMIN USER (HANYA LOCAL + STAGING) ============
-- Akun admin untuk menguji area staff. Ditaruh di seed (BUKAN migration)
-- supaya hanya dibuat saat `supabase db reset` (local) atau dijalankan
-- manual ke staging. PRODUCTION tidak menerima akun ini karena seed
-- DILARANG dijalankan di production (lihat AGENTS.md).
--
--   Email    : curator@digimuda-showroom.com
--   Password : Showroom@2026
--
-- Catatan teknis penting (login gagal bila salah satu dilanggar):
--   1. auth.users.instance_id WAJIB terisi (GoTrue memfilter per instance).
--   2. auth.identities (provider 'email') WAJIB ada (GoTrue v2 cek di sini).
--   3. kolom token (confirmation_token dll) WAJIB '' — NULL bikin error 500.

do $$
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change,
    email_change_token_new, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    'e7c0f2a1-4b3d-4e2a-9c1f-8a5b6c7d8e9f',
    'authenticated',
    'authenticated',
    'curator@digimuda-showroom.com',
    crypt('Showroom@2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '', '', '', '', '', '', '', ''
  )
  on conflict (id) do update
    set instance_id = excluded.instance_id,
        encrypted_password = excluded.encrypted_password,
        email_confirmed_at = coalesce(auth.users.email_confirmed_at, now()),
        confirmation_token = '',
        recovery_token = '',
        email_change = '',
        email_change_token_new = '',
        email_change_token_current = '',
        updated_at = now();
end $$;

insert into auth.identities (
  provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
values (
  'curator@digimuda-showroom.com',
  'e7c0f2a1-4b3d-4e2a-9c1f-8a5b6c7d8e9f',
  jsonb_build_object(
    'sub', 'e7c0f2a1-4b3d-4e2a-9c1f-8a5b6c7d8e9f',
    'email', 'curator@digimuda-showroom.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(), now(), now()
)
on conflict (provider_id, provider) do nothing;

insert into admins (user_id, role)
values ('e7c0f2a1-4b3d-4e2a-9c1f-8a5b6c7d8e9f', 'super_admin')
on conflict (user_id) do update
  set role = excluded.role;
