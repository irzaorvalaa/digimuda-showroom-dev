import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import CarForm from "@/components/sections/car-form";
import { getBrands, requireAdmin } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Add a Car",
  description: "Create a new car listing.",
  robots: { index: false, follow: false },
};

export default async function NewCarPage() {
  await requireAdmin();

  const { data: brands, error } = await getBrands();

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
          <p className="text-sm font-medium text-amber-500">New listing</p>
          <h1 className="mt-2 text-h1 font-semibold text-zinc-100">
            Add a car
          </h1>
          <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-zinc-400">
            Fill in the details below. Only the name, slug, year, and cover
            image are required — everything else can be added later.
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </p>
        ) : (
          <div className="mt-10">
            <CarForm brands={brands} />
          </div>
        )}
      </div>
    </main>
  );
}
