import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import BrandForm from "@/components/sections/brand-form";
import { createClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Edit a Brand",
  description: "Update an existing brand.",
  robots: { index: false, follow: false },
};

interface EditBrandPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  // Edit = operasi tulis → hanya super_admin.
  await requireSuperAdmin();

  const { id } = await params;
  const supabase = await createClient();

  const { data: brand, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!brand) notFound();

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <ButtonLink
          href="/admin/brands"
          variant="ghost"
          className="border-white/15 px-0 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to brands
        </ButtonLink>

        <div className="mt-8">
          <p className="text-sm font-medium text-amber-500">Editing</p>
          <h1 className="mt-2 text-h1 font-semibold text-zinc-100">
            {brand.name}
          </h1>
        </div>

        <div className="mt-10">
          <BrandForm brand={brand} />
        </div>
      </div>
    </main>
  );
}
