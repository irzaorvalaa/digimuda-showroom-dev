import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Callback OAuth/magic-link. Tidak dipakai untuk login email+password
// (signIn langsung redirect ke /admin), tetapi wajib ada bila suatu saat
// admin login lewat provider atau link email.
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/admin";

  if (code) {
    const supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Tukar code dengan session; error dilempar ke halaman login.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=1`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // Tanpa code: tidak ada yang bisa ditukar, kembali ke login.
  return NextResponse.redirect(`${origin}/auth/login`);
}
