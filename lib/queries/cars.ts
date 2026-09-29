import { createPublicClient } from "@/lib/supabase/public";
import type { Car, CarStatus } from "@/types/car";

// Query data publik mobil lewat createPublicClient() (tanpa cookies)
// supaya halaman bisa static/ISR. Setiap query cek error eksplisit.
// TODO: ganti Car dari types/car.ts dengan turunan Database setelah
// types/database.ts di-generate dari Supabase.

export async function getFeaturedCars(): Promise<Car[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("getFeaturedCars error:", error);
    return [];
  }
  return (data as Car[] | null) ?? [];
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getCarBySlug error:", error, { slug });
    return null;
  }
  return (data as Car | null) ?? null;
}

export async function getCarsByStatus(status: CarStatus): Promise<Car[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCarsByStatus error:", error, { status });
    return [];
  }
  return (data as Car[] | null) ?? [];
}
