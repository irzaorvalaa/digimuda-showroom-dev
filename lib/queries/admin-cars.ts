import { createClient } from "@/lib/supabase/server";
import type { CarRow, CarInsert, CarColorRow } from "@/lib/queries/admin-types";
import { ERR } from "@/lib/queries/admin-types";

// Warna yang dikirim dari form (belum punya id saat create).
export interface CarColorInput {
  id?: string;
  name: string;
  hex: string;
  gallery_urls: string[];
  is_default: boolean;
}

export interface CarsResult {
  rows: CarRow[];
  failure: string | null;
}

export interface CarDetailResult {
  car: CarRow | null;
  colours: CarColorRow[];
  failure: string | null;
}

export interface CarMutation {
  id: string | null;
  error: string | null;
}

export interface SimpleMutation {
  error: string | null;
}

// Semua mobil untuk tabel admin.
export async function getAllCars(): Promise<CarsResult> {
  const supabase = await createClient();
  const response = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (response.error || !response.data) {
    return { rows: [], failure: ERR.cars };
  }
  return { rows: response.data, failure: null };
}

// Satu mobil + warnanya (urut sort_order). Untuk form edit.
export async function getAdminCarById(id: string): Promise<CarDetailResult> {
  const supabase = await createClient();
  const response = await supabase
    .from("cars")
    .select("*, car_colors(*)")
    .eq("id", id)
    .order("sort_order", {
      referencedTable: "car_colors",
      ascending: true,
    })
    .maybeSingle();

  if (response.error || !response.data) {
    return { car: null, colours: [], failure: ERR.oneCar };
  }

  const record = response.data as CarRow & {
    car_colors: CarColorRow[] | null;
  };
  const colours = record.car_colors ?? [];
  return { car: record, colours, failure: null };
}

// Buat mobil baru, kembalikan id untuk menyimpan warna.
export async function createCar(payload: CarInsert): Promise<CarMutation> {
  const supabase = await createClient();
  const response = await supabase
    .from("cars")
    .insert(payload)
    .select("id")
    .single();

  if (response.error || !response.data) {
    return { id: null, error: ERR.createCar };
  }
  return { id: response.data.id, error: null };
}

// Update mobil berdasarkan id.
export async function updateCar(
  id: string,
  payload: CarInsert
): Promise<SimpleMutation> {
  const supabase = await createClient();
  const response = await supabase.from("cars").update(payload).eq("id", id);

  if (response.error) return { error: ERR.updateCar };
  return { error: null };
}

// Hapus mobil. car_colors ikut terhapus via on delete cascade.
export async function deleteCar(id: string): Promise<SimpleMutation> {
  const supabase = await createClient();
  const response = await supabase.from("cars").delete().eq("id", id);

  if (response.error) return { error: ERR.deleteCar };
  return { error: null };
}
