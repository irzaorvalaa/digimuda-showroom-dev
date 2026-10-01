import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Client untuk Client Components — hanya bila memang perlu akses Supabase
// dari browser (mis. filter katalog interaktif). Data publik utama tetap
// di-fetch di Server Component lewat public.ts.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
