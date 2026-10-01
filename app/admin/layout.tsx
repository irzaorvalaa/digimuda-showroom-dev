import GrainOverlay from "@/components/motion/grain-overlay";
import AdminNav from "@/components/layout/admin-nav";
import { requireAdmin } from "@/lib/queries/admin";

// Layout area admin: background gelap premium (zinc-950, bukan #000) dengan
// grain texture halus. Konsisten dengan area auth — memisahkan workspace
// staff dari showroom publik yang terang (Art Gallery Mode).
//
// requireAdmin di sini (bukan per-halaman) supaya SELURUH rute /admin
// ter-guard sekali saja. Halaman CRUD tambahan tetap memanggil
// requireSuperAdmin() untuk operasi tulis.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Ambient glow emas lembut di pojok (dekoratif, aria-hidden). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-[-10%] size-[32rem] rounded-full bg-amber-500/8 blur-[120px]" />
      </div>

      <GrainOverlay className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay" />

      <AdminNav role={user.role} />

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
