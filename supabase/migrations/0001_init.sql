-- 0001_init.sql — skema awal Digimuda ShowRoom
-- brands, cars, inquiries, admins + trigger updated_at + helper is_admin()

-- Tabel brand mobil
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

-- Tabel mobil
create table cars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand_id uuid references brands(id) on delete set null,
  year int not null check (year between 1900 and 2100),
  -- null = "Ask Us" (harga negosiasi)
  price_idr bigint check (price_idr is null or price_idr >= 0),
  status text not null default 'available' check (status in ('available', 'sold', 'reserved')),
  engine text,
  power_hp int,
  torque_nm int,
  -- contoh: 3.9 detik
  acceleration_0_100 numeric(3,1),
  top_speed_kmh int,
  transmission text,
  drivetrain text,
  exterior_color text,
  interior_color text,
  mileage_km int,
  description text,
  is_featured boolean not null default false,
  cover_image_url text not null,
  gallery_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger updated_at otomatis untuk cars
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cars_set_updated_at
before update on cars
for each row execute function set_updated_at();

-- Tabel inquiry dari contact form
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  whatsapp text not null check (char_length(whatsapp) between 8 and 20),
  message text check (message is null or char_length(message) <= 1000),
  car_id uuid references cars(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- Siapa yang boleh mengelola data (admin dibuat manual via dashboard)
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Helper RLS: security definer agar policy tidak rekursif membaca tabel admins
create or replace function is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;