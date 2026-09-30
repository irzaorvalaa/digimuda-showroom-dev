import { createPublicClient } from "@/lib/supabase/public";
import type { Car } from "@/types/car";

// Semua query mengembalikan { data, error } supaya UI bisa membedakan
// "kosong" dan "gagal" (aturan #6 error handling).
interface QueryResult<T> {
  data: T;
  error: string | null;
}

export async function getFeaturedCars(): Promise<QueryResult<Car[]>> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*, colors:car_colors(*)")
    .eq("is_featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("getFeaturedCars error:", error.message);
    return { data: [], error: "Gagal memuat mobil unggulan." };
  }
  return { data: (data as Car[]) ?? [], error: null };
}

export async function getCarBySlug(
  slug: string
): Promise<QueryResult<Car | null>> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*, colors:car_colors(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getCarBySlug error:", error.message);
    return { data: null, error: "Gagal memuat detail mobil." };
  }
  return { data: (data as Car) ?? null, error: null };
}

const CAR_PAGE_SIZE = 9;

export function getCarPageSize() {
  return CAR_PAGE_SIZE;
}

export interface CarsPageResult {
  cars: Car[];
  /** Total unit untuk status terpilih (dipakai hitung jumlah halaman). */
  total: number;
  error: string | null;
}

// Katalog dengan paginasi (limit 9 + range + count). Count diambil sekaligus
// supaya UI bisa menghitung jumlah halaman tanpa request tambahan.
export async function getCarsPage(
  status?: string,
  page = 1
): Promise<CarsPageResult> {
  const supabase = createPublicClient();
  const from = Math.max(0, (page - 1) * CAR_PAGE_SIZE);
  const to = from + CAR_PAGE_SIZE - 1;

  let query = supabase
    .from("cars")
    .select("*, colors:car_colors(*)", { count: "exact" });

  if (status && ["available", "sold", "reserved"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getCarsPage error:", error.message);
    return { cars: [], total: 0, error: "Gagal memuat katalog." };
  }
  return { cars: (data as Car[]) ?? [], total: count ?? 0, error: null };
}

// Jumlah unit tersedia — dipakai hero sebagai angka organik yang nyata,
// bukan angka statis karangan.
export async function getAvailableCount(): Promise<QueryResult<number>> {
  const supabase = createPublicClient();
  const { count, error } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("status", "available");

  if (error) {
    console.error("getAvailableCount error:", error.message);
    return { data: 0, error: "Gagal memuat jumlah unit." };
  }
  return { data: count ?? 0, error: null };
}
