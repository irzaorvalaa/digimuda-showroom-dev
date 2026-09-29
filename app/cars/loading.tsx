import Skeleton from "@/components/ui/skeleton";

// Skeleton grid katalog — ukuran mengikuti CarCard (image 4/3 + baris teks).
export default function CarsLoading() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-12 w-64 md:w-80" />
          </div>
          <Skeleton className="h-10 w-full max-w-md rounded-full" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white shadow-diffusion"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="flex flex-col gap-3 p-8">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="mt-2 h-5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
