import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import CarForm from "@/components/sections/car-form";
import {
  getAdminCarById,
  getBrands,
  requireSuperAdmin,
} from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Edit a Car",
  description: "Update an existing car listing.",
  robots: { index: false, follow: false },
};

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  // Edit = operasi tulis → hanya super_admin (RLS + guard UI).
  await requireSuperAdmin();

  const { id } = await params;
  const [{ data: car, error }, { data: brands, error: brandsError }] =
    await Promise.all([getAdminCarById(id), getBrands()]);

  if (error) throw new Error(error);
  if (!car) notFound();

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <ButtonLink
          href="/admin/cars"
          variant="ghost"
          className="border-white/15 px-0 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to cars
        </ButtonLink>

        <div className="mt-8">
          <p className="text-sm font-medium text-amber-500">Editing</p>
          <h1 className="mt-2 text-h1 font-semibold text-zinc-100">
            {car.car.name}
          </h1>
          <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-zinc-400">
            Changes are live on the website as soon as you save.
          </p>
        </div>

        {brandsError ? (
          <p
            role="alert"
            className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {brandsError}
          </p>
        ) : (
          <div className="mt-10">
            <CarForm car={car} brands={brands} />
          </div>
        )}
      </div>
    </main>
  );
}
