import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: konvensi "middleware.ts" deprecated dan berganti menjadi "proxy.ts".
// Matcher HANYA rute yang butuh session Supabase (/admin, /auth) — halaman
// publik tidak tersentuh proxy supaya tetap static/ISR dan cepat.
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};

export async function proxy(request: NextRequest) {
  return updateSession(request);
}
