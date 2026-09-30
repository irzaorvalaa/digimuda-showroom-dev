import Skeleton from "@/components/ui/skeleton";

// Skeleton halaman contact — mengikuti split asimetris 5/7 (teks kiri, form kanan).
export default function ContactLoading() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-12 w-full max-w-sm" />
          <Skeleton className="mt-6 h-4 w-full max-w-[46ch]" />
          <Skeleton className="mt-2 h-4 w-3/4" />

          <Skeleton className="mt-12 h-px w-full" />
          <Skeleton className="mt-6 h-3 w-20" />
          <Skeleton className="mt-3 h-4 w-56" />

          <Skeleton className="mt-8 h-px w-full" />
          <Skeleton className="mt-6 h-3 w-16" />
          <Skeleton className="mt-3 h-4 w-40" />
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col gap-5 rounded-[2.5rem] border border-stone-200/60 bg-white p-8 shadow-diffusion md:p-10">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-11 w-full rounded-2xl" />
              <Skeleton className="h-3 w-52" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
