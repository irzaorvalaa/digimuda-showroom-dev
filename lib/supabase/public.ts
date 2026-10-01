import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client publik TANPA cookies — untuk data publik (cars, brands) di Server
// Component. Tanpa session, halaman tetap bisa static/ISR.
// Auth TIDAK ditangani di sini — pakai server.ts untuk area admin/auth.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
