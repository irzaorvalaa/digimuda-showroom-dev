import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Badge from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import CarGallery from "@/components/sections/car-gallery";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";
import { getCarBySlug } from "@/lib/queries/cars";
import { formatMileage } from "@/lib/utils";
import type { Car } from "@/types/car";

// ISR: data publik mobil bisa di-cache 60 detik (aturan fetching #1).
export const revalidate = 60;

interface CarDetailPageProps {
  // Next.js 15+: params berupa Promise yang harus di-await.
  params: Promise<{ slug: string }>;
}

// Metadata diambil dari data mobil — BUKAN di-hardcode (aturan #9 SEO).
export async function generateMetadata({
  params,
}: CarDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: car } = await getCarBySlug(slug);

  if (!car) {
    return { title: "Car not found" };
  }

  return {
    title: `${car.name} ${car.year}`,
    description:
      car.description ??
      `${car.name} ${car.year} at Digimuda ShowRoom. Contact us for a private viewing.`,
    openGraph: {
      title: `${car.name} ${car.year} | Digimuda ShowRoom`,
      description:
        car.description?.slice(0, 160) ??
        `${car.name} ${car.year} at Digimuda ShowRoom.`,
      images: [
        {
          url: car.cover_image_url,
          width: 800,
          height: 600,
          alt: `${car.name} exterior`,
        },
      ],
    },
  };
}

// Spesifikasi "panjang" ditampilkan sebagai baris border divide-y
// (SKILL.md Rule 4: kelompokkan dengan garis, bukan kotak kartu).
// swatch: kode hex opsional untuk swatch bulat kecil di samping nilai.
function buildSpecRows(car: Car) {
  const rows: Array<{
    label: string;
    value: string | null;
    swatch?: string | null;
  }> = [
    { label: "Engine", value: car.engine },
    { label: "Transmission", value: car.transmission },
    { label: "Drivetrain", value: car.drivetrain },
    {
      label: "Exterior",
      value: car.exterior_color,
      swatch: car.colors.find((color) => color.is_default)?.hex ?? null,
    },
    { label: "Interior", value: car.interior_color, swatch: car.interior_hex },
    { label: "Mileage", value: formatMileage(car.mileage_km) },
    { label: "Year", value: String(car.year) },
  ];
  return rows.filter((row) => row.value !== null);
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params;
  const { data: car, error } = await getCarBySlug(slug);

  // Query gagal → lempar ke error.tsx (Client Component dengan tombol retry).
  if (error) throw new Error(error);
  // Mobil tidak ditemukan → not-found.tsx.
  if (!car) notFound();

  const specRows = buildSpecRows(car);
  const metrics = [
    {
      label: "Power",
      value: car.power_hp !== null ? `${car.power_hp} hp` : "—",
    },
    {
      label: "Torque",
      value: car.torque_nm !== null ? `${car.torque_nm} Nm` : "—",
    },
    {
      label: "0–100 km/h",
      value:
        car.acceleration_0_100 !== null ? `${car.acceleration_0_100} s` : "—",
    },
    {
      label: "Top speed",
      value: car.top_speed_kmh !== null ? `${car.top_speed_kmh} km/h` : "—",
    },
  ];

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to collection
        </Link>

        {/* Split 7/5 asimetris (DESIGN_VARIANCE 8): galeri kiri, info kanan. */}
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <CarGallery
              coverImageUrl={car.cover_image_url}
              galleryUrls={car.gallery_urls}
              alt={car.name}
              colors={car.colors}
            />
          </div>

          <div className="flex flex-col gap-8 md:col-span-5">
            <div>
              <Badge status={car.status} />
              <h1 className="mt-4 text-4xl font-bold leading-none tracking-tighter text-zinc-900 md:text-5xl">
                {car.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-sm text-zinc-600">
                  {car.year}
                </span>
                <span className="h-4 w-px bg-stone-200/60" />
                <span className="font-mono text-2xl font-medium text-zinc-900"></span>
              </div>
            </div>

            {car.description && (
              <p className="max-w-[65ch] text-base leading-relaxed text-zinc-600">
                {car.description}
              </p>
            )}

            {/* Metrik performa — angka font-mono (aturan tipografi teknis). */}
            <StaggerGrid className="grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <StaggerItem
                  key={metric.label}
                  className="rounded-3xl border border-stone-200/60 bg-white p-5 shadow-diffusion"
                >
                  <p className="text-xs font-medium text-zinc-600">
                    {metric.label}
                  </p>
                  <p className="mt-1 font-mono text-xl font-medium text-zinc-900">
                    {metric.value}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* Baris spesifikasi panjang — divide-y, tanpa kartu. */}
            <div className="divide-y divide-stone-200/60 border-t border-stone-200/60">
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="text-sm text-zinc-600">{row.label}</span>
                  <span className="flex items-center gap-2 font-mono text-sm font-medium text-zinc-900">
                    {row.swatch && (
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 rounded-full border border-stone-200/60"
                        style={{ backgroundColor: row.swatch }}
                      />
                    )}
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/contact?car=${car.slug}`} variant="gold">
                Book a viewing
              </ButtonLink>
              <ButtonLink href="/cars" variant="ghost">
                Browse more cars
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
