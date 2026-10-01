import Skeleton from "@/components/ui/skeleton";

// Skeleton halaman login — bentuk mengikuti LoginForm yang baru
// (lock badge, 2 input, tombol) di atas surface gelap.
export default function LoginLoading() {
  return (
    <main className="flex min-h-[100dvh] items-center px-4 py-20 md:px-8">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col justify-center lg:col-span-5">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="mt-3 h-3 w-44" />
          <Skeleton className="mt-10 h-12 w-48 md:w-56" />
          <Skeleton className="mt-6 h-4 w-full max-w-[45ch]" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-[45ch]" />
        </div>

        <div className="flex items-center lg:col-span-7">
          <div className="flex w-full flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl md:p-10">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
