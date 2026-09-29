import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresh token Supabase sebelum request diteruskan ke rute.
// Dipanggil dari proxy.ts (root) HANYA untuk rute /admin dan /auth.
// TODO: tambahkan guard redirect ke halaman login saat admin panel dibangun.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Tulis ulang cookie ke request (untuk render ini) DAN ke response.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: jangan menaruh kode apa pun antara createServerClient dan
  // getUser() — bisa membatalkan refresh token dan merusak session.
  await supabase.auth.getUser();

  return supabaseResponse;
}
