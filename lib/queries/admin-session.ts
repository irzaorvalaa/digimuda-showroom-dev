import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { AdminRole } from "@/lib/admin/constants";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface AdminSession {
  userId: string;
  email: string | null;
  role: AdminRole;
}

interface AdminRow {
  user_id: string;
  role: AdminRole;
  email: string | null;
}

export interface InventoryStats {
  totalCars: number;
  available: number;
  reserved: number;
  sold: number;
}

// Baca sesi admin (user + peran). Redirect bila tidak valid.
export async function getAdminSession(): Promise<AdminSession> {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  const user = authResult.data.user;

  if (!user) redirect("/auth/login");

  const { data, error } = await supabase
    .from("admins")
    .select("user_id, role, email")
    .eq("user_id", user.id)
    .maybeSingle<AdminRow>();

  if (error || !data) redirect("/auth/login");

  return { userId: data.user_id, email: data.email, role: data.role };
}

// Hanya super_admin yang boleh mengubah warna / menghapus.
export function assertSuperAdmin(role: AdminRole): void {
  if (role !== "super_admin") {
    throw new Error("Only super admins may perform this action.");
  }
}

// Statistik inventaris untuk dashboard.
export async function getInventoryStats(
  supabase: SupabaseClient
): Promise<InventoryStats> {
  const base = supabase.from("cars").select("status");
  const { data, error } = await base;

  if (error || !data) {
    return { totalCars: 0, available: 0, reserved: 0, sold: 0 };
  }

  let available = 0;
  let reserved = 0;
  let sold = 0;
  for (const row of data) {
    if (row.status === "available") available += 1;
    else if (row.status === "reserved") reserved += 1;
    else if (row.status === "sold") sold += 1;
  }

  return {
    totalCars: data.length,
    available,
    reserved,
    sold,
  };
}

// Jumlah inquiry berstatus "new" (badge notifikasi).
export async function getNewInquiryCount(
  supabase: SupabaseClient
): Promise<number> {
  const { count, error } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) return 0;
  return count ?? 0;
}

// Tipe DB tidak lagi dipakai langsung di sini, tapi dijaga untuk konsistensi.
export type { Database };
