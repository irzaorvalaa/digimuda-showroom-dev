// Interface Car — sesuai kolom tabel cars (0001_init.sql).
// Tipe field diverifikasi dari respons REST lokal (numeric & bigint
// dikirim PostgREST sebagai JSON number, timestamptz sebagai ISO string).
// TODO: setelah types/database.ts di-generate dari Supabase, turunkan:
//   type Car = Database["public"]["Tables"]["cars"]["Row"]

export type CarStatus = "available" | "sold" | "reserved";

// Satu pilihan warna mobil beserta galeri gambarnya sendiri.
// is_default menandakan warna yang tampil pertama saat detail dibuka.
export interface CarColor {
  id: string;
  car_id: string;
  name: string;
  /** Format HEX 6 digit, contoh "#c8102e". Dipakai swatch & aksesibilitas. */
  hex: string;
  gallery_urls: string[];
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export interface Car {
  id: string;
  slug: string;
  name: string;
  brand_id: string | null;
  year: number;
  /** null = "Ask Us" (harga negosiasi) */
  price_idr: number | null;
  status: CarStatus;
  engine: string | null;
  power_hp: number | null;
  torque_nm: number | null;
  acceleration_0_100: number | null;
  top_speed_kmh: number | null;
  transmission: string | null;
  drivetrain: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  mileage_km: number | null;
  description: string | null;
  is_featured: boolean;
  cover_image_url: string;
  gallery_urls: string[];
  created_at: string;
  updated_at: string;
  /** Daftar warna + galeri per warna (join dari car_colors). */
  colors: CarColor[];
}
