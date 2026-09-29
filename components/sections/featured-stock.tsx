import Link from "next/link";
import CarCard from "@/components/ui/car-card";
import type { Car } from "@/types/car";

interface FeaturedStockProps {
  cars: Car[];
}

// Bento asimetris 12 kolom: 7/5 lalu 5/7 — bukan 4 kolom sejajar.
const spanClasses = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
];

// Server component: data dikirim dari page (fetch di server), tanpa JS client.
export default function FeaturedStock({ cars }: FeaturedStockProps) {
  return (
    <section id="featured" className="px-4 pb-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-tight text-amber-800">
              Featured Stock
            </p>
            <h2 className="mt-3 max-w-[18ch] text-3xl font-semibold leading-none tracking-tighter text-zinc-900 md:text-5xl">
              Currently on the gallery floor
            </h2>
          </div>
          <Link
            href="/cars"
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium tracking-tight text-zinc-900 transition-colors hover:bg-stone-100"
          >
            View all stock
          </Link>
        </div>

        {cars.length === 0 ? (
          // Empty state — bukan panel kosong tanpa arah
          <div className="mt-10 rounded-[2.5rem] border border-dashed border-stone-200 bg-white/60 p-12 text-center md:p-20">
            <p className="text-lg font-medium tracking-tight text-zinc-900">
              The floor is being refreshed.
            </p>
            <p className="mx-auto mt-2 max-w-[45ch] text-sm leading-relaxed text-zinc-600">
              New arrivals are inspected before they are listed. Leave a request
              and we will notify you first.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium tracking-tight text-white transition-colors hover:bg-zinc-800"
            >
              Request a notification
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12">
            {cars.slice(0, 4).map((car, index) => (
              <CarCard
                key={car.id}
                car={car}
                priority={index === 0}
                className={spanClasses[index] ?? "md:col-span-6"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
