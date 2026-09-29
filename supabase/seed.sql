-- seed.sql — data dummy realistis untuk LOCAL + STAGING.
-- DILARANG dijalankan di production (data asli dari client).
-- Idempotent: aman dijalankan ulang (on conflict do nothing).
-- Gambar pakai picsum.photos/seed/... — nanti diganti URL Supabase Storage
-- setelah admin upload foto asli ke bucket "cars".

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
    'https://picsum.photos/seed/bentley-gt-speed-front/800/600',
    array['https://picsum.photos/seed/bentley-gt-speed-side/800/600', 'https://picsum.photos/seed/bentley-gt-speed-interior/800/600']
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
    'https://picsum.photos/seed/amg-gt63s-front/800/600',
    array['https://picsum.photos/seed/amg-gt63s-rear/800/600', 'https://picsum.photos/seed/amg-gt63s-cockpit/800/600']
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
    'https://picsum.photos/seed/bmw-m4-competition-front/800/600',
    array['https://picsum.photos/seed/bmw-m4-competition-side/800/600', 'https://picsum.photos/seed/bmw-m4-seats/800/600']
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
    'https://picsum.photos/seed/porsche-992-cab-front/800/600',
    array['https://picsum.photos/seed/porsche-992-cab-top-down/800/600', 'https://picsum.photos/seed/porsche-992-dash/800/600']
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
    'https://picsum.photos/seed/mustang-gt-red-front/800/600',
    array['https://picsum.photos/seed/mustang-gt-side/800/600', 'https://picsum.photos/seed/mustang-gt-shaker/800/600']
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
    'https://picsum.photos/seed/bmw-m8-red-front/800/600',
    array['https://picsum.photos/seed/bmw-m8-rear/800/600', 'https://picsum.photos/seed/bmw-m8-lounge/800/600']
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
    'https://picsum.photos/seed/mercedes-s580-front/800/600',
    array['https://picsum.photos/seed/mercedes-s580-rear-seat/800/600']
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
    'https://picsum.photos/seed/flying-spur-mulliner-front/800/600',
    array['https://picsum.photos/seed/flying-spur-mulliner-interior/800/600', 'https://picsum.photos/seed/flying-spur-wheel/800/600']
  )
on conflict (slug) do nothing;

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