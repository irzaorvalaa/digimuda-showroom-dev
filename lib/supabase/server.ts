import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Client Supabase untuk Server Component / Route Handler yang butuh session
// (area admin/auth). Rute yang memakainya otomatis menjadi dynamic karena
// membaca cookies. Data publik TIDAK pakai file ini — pakai public.ts.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component yang tidak bisa menulis cookie.
            // Refresh token tetap ditangani oleh proxy.ts (root).
          }
        },
      },
    }
  );
}
