import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

// Refresh token Supabase sebelum request diteruskan ke rute.
// Dipanggil dari proxy.ts (root) HANYA untuk rute /admin dan /auth.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guard /admin: belum login → redirect ke halaman login. Halaman login
  // sendiri (/auth/*) tetap bisa diakses tanpa session.
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
