import { createClient } from "@/lib/supabase/server";
import type { BrandRow, BrandInsert } from "@/lib/queries/admin-types";
import { ERR } from "@/lib/queries/admin-types";

export interface BrandsResult {
  rows: BrandRow[];
  failure: string | null;
}

export interface BrandResult {
  brand: BrandRow | null;
  failure: string | null;
}

export interface BrandMutation {
  error: string | null;
}

// Semua brand untuk tabel admin.
export async function getAllBrands(): Promise<BrandsResult> {
  const supabase = await createClient();
  const response = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (response.error || !response.data) {
    return { rows: [], failure: ERR.brands };
  }
  return { rows: response.data, failure: null };
}

// Satu brand berdasarkan id (untuk form edit).
export async function getAdminBrandById(id: string): Promise<BrandResult> {
  const supabase = await createClient();
  const response = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (response.error || !response.data) {
    return { brand: null, failure: ERR.oneBrand };
  }
  return { brand: response.data, failure: null };
}

// Buat brand baru.
export async function createBrand(
  payload: BrandInsert
): Promise<BrandMutation> {
  const supabase = await createClient();
  const response = await supabase.from("brands").insert(payload);

  if (response.error) return { error: ERR.createBrand };
  return { error: null };
}

// Update brand berdasarkan id.
export async function updateBrand(
  id: string,
  payload: BrandInsert
): Promise<BrandMutation> {
  const supabase = await createClient();
  const response = await supabase.from("brands").update(payload).eq("id", id);

  if (response.error) return { error: ERR.updateBrand };
  return { error: null };
}

// Hapus brand. cars.brand_id jadi null via on delete set null.
export async function deleteBrand(id: string): Promise<BrandMutation> {
  const supabase = await createClient();
  const response = await supabase.from("brands").delete().eq("id", id);

  if (response.error) return { error: ERR.deleteBrand };
  return { error: null };
}
