import Skeleton from "@/components/ui/skeleton";

// Skeleton dashboard — bentuk mengikuti header + 4 stat card + inquiry rows.
export default function AdminLoading() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-12 w-64 md:w-80" />
            <Skeleton className="mt-3 h-4 w-56" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-28 rounded-full" />
          </div>
        </div>

        {/* Bento Grid 12 kolom, proporsi sama dengan dashboard asli. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12">
          <div className="md:col-span-6">
            <Skeleton className="h-36 rounded-[2rem]" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-36 rounded-[2rem]" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-36 rounded-[2rem]" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-36 rounded-[2rem]" />
          </div>
        </div>

        <div className="mt-16">
          <Skeleton className="h-8 w-48" />
          <div className="mt-8 divide-y divide-white/8 border-t border-white/8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2.5 h-3 w-full max-w-[65ch]" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
