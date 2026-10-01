import Skeleton from "@/components/ui/skeleton";

// Skeleton halaman detail — bentuk mengikuti layout asli (split 7/5),
// bukan spinner bundar (SKILL.md Rule 5: skeletal loaders).
export default function CarDetailLoading() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Skeleton className="h-5 w-40" />

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <Skeleton className="aspect-[4/3] w-full rounded-[2.5rem]" />
            <div className="mt-4 flex gap-3">
              <Skeleton className="size-20 rounded-2xl" />
              <Skeleton className="size-20 rounded-2xl" />
              <Skeleton className="size-20 rounded-2xl" />
            </div>
          </div>

          <div className="flex flex-col gap-8 md:col-span-5">
            <div>
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="mt-4 h-12 w-3/4" />
              <Skeleton className="mt-3 h-8 w-1/2" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
            </div>
            <Skeleton className="h-56 w-full rounded-3xl" />
            <Skeleton className="h-12 w-full max-w-xs rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
