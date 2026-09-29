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
    '8-Speed Dual-Clutch', 'All-Wheel Drive', 'British Racing Green', 'Burnt Oak / Linen', 7420,
    'Full main dealer history in Jakarta, ceramic-coated since new. Rear-seat entertainment and the Naim audio system are intact; tires replaced at 6.800 km.',
    true,
    '/images/cars/6.jpg',
    array['/images/cars/6.jpg', '/images/cars/41.jpg', '/images/cars/48.jpg']
  ),
  (
    'mercedes-amg-gt-63-s-4matic-2023',
    'Mercedes-AMG GT 63 S 4MATIC+',
    (select id from brands where slug = 'mercedes-benz'),
    2023, 5200000000, 'available',
    '4.0L V8 Biturbo', 630, 900, 3.2, 315,
    'AMG SPEEDSHIFT MCT 9-Speed', 'All-Wheel Drive', 'Selenite Grey', 'Nappa Leather Black', 4180,
    'AMG Driver A package and rear-axle steering optioned from the factory. One owner, service done at Sunter authorized workshop.',
    true,
    '/images/cars/27.jpg',
    array['/images/cars/27.jpg', '/images/cars/6.jpg', '/images/cars/38.jpg']
  ),
  (
    'bmw-m4-competition-xdrive-2023',
    'BMW M4 Competition xDrive',
    (select id from brands where slug = 'bmw'),
    2023, 2850000000, 'available',
    '3.0L I6 Twin-Turbo', 523, 650, 3.5, 290,
    '8-Speed M Steptronic', 'M xDrive', 'Brooklyn Grey', 'Merino Leather Black', 11250,
    'M Driver''s Package and carbon bucket seats. Front PPF still on, two sets of keys and original run-flat plus a spare wheel set included.',
    true,
    '/images/cars/30.jpg',
    array['/images/cars/30.jpg', '/images/cars/46.jpg', '/images/cars/41.jpg']
  ),
  (
    'porsche-911-carrera-s-cabriolet-992-2022',
    'Porsche 911 Carrera S Cabriolet (992)',
    (select id from brands where slug = 'porsche'),
    2022, 4650000000, 'available',
    '3.0L Flat-Six Twin-Turbo', 444, 530, 3.7, 308,
    '8-Speed PDK', 'Rear-Wheel Drive', 'GT Silver Metallic', 'Bordeaux Red Leather', 9870,
    'Sport Chrono, PASM, and the Bose surround system on the original options list. Soft top has no repairs and the paint meter readings are factory across all panels.',
    true,
    '/images/cars/38.jpg',
    array['/images/cars/38.jpg', '/images/cars/27.jpg', '/images/cars/48.jpg']
  ),
  (
    'ford-mustang-gt-convertible-2021',
    'Ford Mustang GT Convertible',
    (select id from brands where slug = 'ford'),
    2021, 1650000000, 'available',
    '5.0L V8 Ti-VCT', 460, 550, 4.6, 250,
    '10-Speed Automatic', 'Rear-Wheel Drive', 'Race Red', 'Black Onyx Leather', 18340,
    'Active exhaust with the factory quad tips, magnetic dampers, and the comfort package. Recent major service with fresh fluids and a new battery.',
    false,
    '/images/cars/41.jpg',
    array['/images/cars/41.jpg', '/images/cars/6.jpg', '/images/cars/30.jpg']
  ),
  (
    'bmw-m8-competition-gran-coupe-2022',
    'BMW M8 Competition Gran Coupe',
    (select id from brands where slug = 'bmw'),
    2022, 4300000000, 'available',
    '4.4L V8 Twin-Turbo', 625, 750, 3.2, 305,
    '8-Speed M Steptronic', 'M xDrive', 'Toronto Red', 'Silverstone Merino', 6540,
    'Executive Lounge rear seats and the Bowers & Wilkins diamond surround system. Kept indoors since delivery; all four tires are the original batch.',
    false,
    '/images/cars/46.jpg',
    array['/images/cars/46.jpg', '/images/cars/30.jpg', '/images/cars/38.jpg']
  ),
  (
    'mercedes-benz-s-580-4matic-2021',
    'Mercedes-Benz S 580 4MATIC',
    (select id from brands where slug = 'mercedes-benz'),
    2021, 3950000000, 'sold',
    '4.0L V8 Biturbo + EQ Boost', 503, 700, 4.4, 250,
    '9G-TRONIC', 'All-Wheel Drive', 'Obsidian Black', 'Macchiato Beige Nappa', 23780,
    'Executive package with rear first-class seats. Sold through our showroom in March; listed here for reference of our recent stock.',
    false,
    '/images/cars/48.jpg',
    array['/images/cars/48.jpg', '/images/cars/27.jpg']
  ),
  (
    'bentley-flying-spur-mulliner-2020',
    'Bentley Flying Spur Mulliner',
    (select id from brands where slug = 'bentley'),
    2020, null, 'reserved',
    '6.0L W12 Twin-Turbo', 626, 820, 4.3, 325,
    '8-Speed Dual-Clutch', 'All-Wheel Drive', 'Moonbeam', 'Burnished Cream', 15920,
    'Mulliner driving specification with the rotating display and diamond knurling on the vents. Price on request — currently held with a deposit.',
    false,
    '/images/cars/6.jpg',
    array['/images/cars/6.jpg', '/images/cars/48.jpg', '/images/cars/41.jpg']
  )
on conflict (slug) do nothing;

-- ============ CAR COLORS ============
-- Satu mobil bisa punya beberapa pilihan warna; tiap warna punya galeri
-- sendiri. Idempotent: hanya insert jika mobil itu belum punya warna sama
-- sekali (menghindari duplikat saat seed dijalankan ulang).
insert into car_colors (car_id, name, hex, gallery_urls, is_default, sort_order)
select c.id, v.name, v.hex, v.gallery_urls, v.is_default, v.sort_order
from (values
  -- Bentley Continental GT Speed — 2 warna
  ('bentley-continental-gt-speed-2022', 'British Racing Green', '#0a3d2c',
    array['/images/cars/6.jpg', '/images/cars/41.jpg', '/images/cars/48.jpg'], true, 0),
  ('bentley-continental-gt-speed-2022', 'Beluga Black', '#111114',
    array['/images/cars/48.jpg', '/images/cars/6.jpg'], false, 1),

  -- Mercedes-AMG GT 63 S — 2 warna
  ('mercedes-amg-gt-63-s-4matic-2023', 'Selenite Grey', '#6b6f72',
    array['/images/cars/27.jpg', '/images/cars/6.jpg', '/images/cars/38.jpg'], true, 0),
  ('mercedes-amg-gt-63-s-4matic-2023', 'Obsidian Black', '#101012',
    array['/images/cars/38.jpg', '/images/cars/27.jpg'], false, 1),

  -- BMW M4 Competition — 2 warna
  ('bmw-m4-competition-xdrive-2023', 'Brooklyn Grey', '#8a8d90',
    array['/images/cars/30.jpg', '/images/cars/46.jpg', '/images/cars/41.jpg'], true, 0),
  ('bmw-m4-competition-xdrive-2023', 'Isle of Man Green', '#1f4d3a',
    array['/images/cars/46.jpg', '/images/cars/30.jpg'], false, 1),

  -- Porsche 911 Carrera S — 2 warna
  ('porsche-911-carrera-s-cabriolet-992-2022', 'GT Silver Metallic', '#b9bcc0',
    array['/images/cars/38.jpg', '/images/cars/27.jpg', '/images/cars/48.jpg'], true, 0),
  ('porsche-911-carrera-s-cabriolet-992-2022', 'Guards Red', '#c8102e',
    array['/images/cars/48.jpg', '/images/cars/38.jpg'], false, 1),

  -- Ford Mustang GT — 1 warna
  ('ford-mustang-gt-convertible-2021', 'Race Red', '#d4132a',
    array['/images/cars/41.jpg', '/images/cars/6.jpg', '/images/cars/30.jpg'], true, 0),

  -- BMW M8 Competition — 1 warna
  ('bmw-m8-competition-gran-coupe-2022', 'Toronto Red', '#c0362c',
    array['/images/cars/46.jpg', '/images/cars/30.jpg', '/images/cars/38.jpg'], true, 0),

  -- Mercedes-Benz S 580 (sold) — 1 warna
  ('mercedes-benz-s-580-4matic-2021', 'Obsidian Black', '#101012',
    array['/images/cars/48.jpg', '/images/cars/27.jpg'], true, 0),

  -- Bentley Flying Spur Mulliner — 1 warna
  ('bentley-flying-spur-mulliner-2020', 'Moonbeam', '#d9d4c6',
    array['/images/cars/6.jpg', '/images/cars/48.jpg', '/images/cars/41.jpg'], true, 0)
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