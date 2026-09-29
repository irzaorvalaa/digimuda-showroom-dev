import { createBrowserClient } from "@supabase/ssr";

// Client untuk Client Components — hanya bila memang perlu akses Supabase
// dari browser (mis. filter katalog interaktif). Data publik utama tetap
// di-fetch di Server Component lewat public.ts.
// TODO: tambahkan generic <Database> setelah types/database.ts di-generate.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
