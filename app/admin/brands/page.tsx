import type { Metadata } from "next";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import EmptyState from "@/components/ui/empty-state";
import BrandForm from "@/components/sections/brand-form";
import { deleteBrandAction } from "@/app/admin/brands/actions";
import { getBrandsWithCounts, requireAdmin } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Brands",
  description: "Manage the brands shown in the showroom.",
  robots: { index: false, follow: false },
};

export default async function AdminBrandsPage() {
  const user = await requireAdmin();
  const { data: brands, error } = await getBrandsWithCounts();

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div>
          <p className="text-sm font-medium text-amber-500">Catalogue</p>
          <h1 className="mt-2 text-h1 font-semibold text-zinc-100">Brands</h1>
          <p className="mt-3 font-mono text-sm text-zinc-500">
            {brands.length} {brands.length === 1 ? "brand" : "brands"}
          </p>
        </div>

        {/* Split asimetris 7/5: daftar brand kiri, form kanan. */}
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            {error ? (
              <EmptyState
                icon={<WarningCircle size={22} />}
                title="Couldn't load brands"
                description={error}
                className="border-white/10 bg-white/[0.03]"
              />
            ) : brands.length === 0 ? (
              <EmptyState
                icon={<WarningCircle size={22} />}
                title="No brands yet"
                description="Add a brand so cars can be grouped by marque."
                className="border-white/10 bg-white/[0.03]"
              />
            ) : (
              <div className="divide-y divide-white/8 border-t border-white/8">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between gap-6 py-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {brand.name}
                      </p>
                      <p className="mt-1 font-mono text-xs text-zinc-600">
                        {brand.car_count}{" "}
                        {brand.car_count === 1 ? "car" : "cars"} · {brand.slug}
                      </p>
                    </div>

                    {user.role === "super_admin" ? (
                      <div className="flex shrink-0 items-center gap-3">
                        <ButtonLink
                          href={`/admin/brands/${brand.id}/edit`}
                          variant="ghost"
                          className="border-white/15 px-4 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
                        >
                          Edit
                        </ButtonLink>
                        <DeleteButton
                          action={deleteBrandAction}
                          id={brand.id}
                          label={brand.name}
                        />
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-zinc-700">
                        Read only
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <h2 className="text-sm font-medium tracking-tight text-zinc-100">
              Add a brand
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Brands appear as filters on the car catalogue.
            </p>
            <div className="mt-6">
              <BrandForm />
            </div>
          </div>
        </div>

        {user.role === "super_admin" ? null : (
          <p className="mt-12 font-mono text-xs text-zinc-600">
            Editing and removing brands requires a super admin account.
          </p>
        )}
      </div>
    </main>
  );
}
