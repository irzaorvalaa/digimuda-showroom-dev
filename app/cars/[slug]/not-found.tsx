import { Car } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";

// not-found.tsx untuk slug mobil yang tidak ada (dipanggil lewat notFound()
// di page.tsx). Bukan error — mobilnya memang tidak ada di koleksi.
export default function CarNotFound() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start gap-4 rounded-[2.5rem] border border-dashed border-stone-200/60 p-10 md:p-12">
          <span className="flex size-12 items-center justify-center rounded-full border border-stone-200/60 bg-white text-amber-800">
            <Car size={22} />
          </span>
          <div>
            <p className="text-base font-medium tracking-tight text-zinc-900">
              This car is not in the collection
            </p>
            <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-zinc-600">
              The listing you are looking for may have been sold, reserved, or
              moved. Browse the current collection instead.
            </p>
          </div>
          <ButtonLink href="/cars" variant="primary">
            Back to collection
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
