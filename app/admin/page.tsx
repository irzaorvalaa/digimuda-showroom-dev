import type { Metadata } from "next";
import { ArrowRight, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import SignOutButton from "@/components/ui/sign-out-button";
import { ButtonLink } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import {
  getAdminStats,
  getRecentInquiries,
  requireAdmin,
  type AdminInquiry,
} from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Digimuda ShowRoom inventory overview.",
  robots: { index: false, follow: false },
};

// Warna status inquiry — sesuai palet badge publik (emerald/amber/zinc).
const inquiryStatusStyles: Record<string, string> = {
  new: "bg-emerald-500",
  contacted: "bg-amber-500",
  closed: "bg-zinc-400",
};

// Kartu metrik glassmorphism — angka font-mono (aturan tipografi teknis).
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:p-8">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-3 font-mono text-3xl font-medium tabular-nums text-zinc-100 md:text-4xl">
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboard() {
  const user = await requireAdmin();
  const [stats, inquiries] = await Promise.all([
    getAdminStats(),
    getRecentInquiries(),
  ]);

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header asimetris: info kiri, tombol kanan (DESIGN_VARIANCE 8). */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-500">Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tighter text-zinc-100 md:text-6xl">
              Inventory overview
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-500">
              Signed in as {user.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/admin/cars/new" variant="gold">
              Add a car
              <ArrowRight size={16} />
            </ButtonLink>
            <SignOutButton />
          </div>
        </div>

        {/* Bento Grid asimetris 12 kolom (bukan 4 kolom sejajar). */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12">
          <div className="md:col-span-6">
            <StatCard label="Cars in collection" value={stats.totalCars} />
          </div>
          <div className="md:col-span-2">
            <StatCard label="Available" value={stats.available} />
          </div>
          <div className="md:col-span-2">
            <StatCard label="Reserved" value={stats.reserved} />
          </div>
          <div className="md:col-span-2">
            <StatCard label="Sold" value={stats.sold} />
          </div>
        </div>

        {stats.error ? (
          <EmptyState
            icon={<WarningCircle size={22} />}
            title="Couldn't load stats"
            description={stats.error}
            className="mt-8 border-white/10 bg-white/[0.03]"
          />
        ) : null}

        {/* Inquiry terbaru — baris divide-y, tanpa kartu (SKILL.md Rule 4). */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tighter text-zinc-100 md:text-3xl">
              Recent inquiries
            </h2>
            <ButtonLink
              href="/admin/inquiries"
              variant="ghost"
              className="border-white/15 px-0 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              View all
              <ArrowRight size={14} />
            </ButtonLink>
          </div>

          {inquiries.error ? (
            <EmptyState
              icon={<WarningCircle size={22} />}
              title="Couldn't load inquiries"
              description={inquiries.error}
              className="mt-8 border-white/10 bg-white/[0.03]"
            />
          ) : inquiries.data.length === 0 ? (
            <EmptyState
              icon={<WarningCircle size={22} />}
              title="No inquiries yet"
              description="Client messages from the contact form will appear here."
              className="mt-8 border-white/10 bg-white/[0.03]"
            />
          ) : (
            <div className="mt-8 divide-y divide-white/8 border-t border-white/8">
              {inquiries.data.map((inquiry: AdminInquiry) => (
                <div
                  key={inquiry.id}
                  className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between md:gap-8"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${
                          inquiryStatusStyles[inquiry.status] ?? "bg-zinc-400"
                        }`}
                      />
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {inquiry.full_name}
                      </p>
                    </div>
                    <p className="mt-1.5 line-clamp-2 max-w-[65ch] text-sm leading-relaxed text-zinc-400">
                      {inquiry.message ?? "No message attached."}
                    </p>
                    <p className="mt-1.5 font-mono text-xs text-zinc-600">
                      {inquiry.car_name
                        ? `Re: ${inquiry.car_name}`
                        : "General inquiry"}{" "}
                      · {formatDate(inquiry.created_at)}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-zinc-500 md:text-right">
                    {inquiry.whatsapp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
