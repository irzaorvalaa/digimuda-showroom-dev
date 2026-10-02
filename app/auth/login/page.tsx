import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/sections/login-form";
import { getSession } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Restricted area — Digimuda ShowRoom staff only.",
  // Cegah indeks mesin pencari untuk halaman auth (bukan konten publik).
  robots: { index: false, follow: false },
};

// Sudah login sebagai admin? Langsung ke dashboard.
export default async function LoginPage() {
  const user = await getSession();
  if (user) redirect("/admin");

  return (
    <main className="flex min-h-[100dvh] items-center px-4 py-20 md:px-8">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Split asimetris (DESIGN_VARIANCE 8): teks kiri, form kanan. */}
        <div className="flex flex-col justify-center lg:col-span-5">
          {/* Wordmark — konsisten dengan footer publik (font-serif italic). */}
          <p className="font-serif text-3xl italic leading-none tracking-tight text-stone-100 md:text-4xl">
            Digimuda
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/80">
            Est. MMXXIV · Jakarta
          </p>

          <h1 className="mt-10 text-h1 font-semibold leading-none text-zinc-100">
            Staff access.
          </h1>
          <p className="mt-6 max-w-[45ch] text-base leading-relaxed text-zinc-400">
            This area is reserved for Digimuda ShowRoom curators. Sign in to
            manage inventory and review client inquiries.
          </p>

          {/* Hairline emas — signature line, sama dengan footer publik. */}
          <div
            aria-hidden="true"
            className="mt-10 h-px w-full max-w-xs bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent"
          />
        </div>

        <div className="flex items-center lg:col-span-7">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
