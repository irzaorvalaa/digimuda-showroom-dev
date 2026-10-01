import type { Metadata } from "next";
import ContactForm from "@/components/sections/contact-form";
import LocationMap from "@/components/sections/location-map";
import { getCarBySlug } from "@/lib/queries/cars";

export const metadata: Metadata = {
  title: "Contact | Digimuda ShowRoom",
  description:
    "Get in touch with Digimuda ShowRoom to book a private viewing or ask about a specific car.",
};

interface ContactPageProps {
  searchParams: Promise<{ car?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { car } = await searchParams;

  // Resolve slug → car_id untuk pre-fill form (opsional).
  let carId: string | undefined;
  if (car) {
    const { data } = await getCarBySlug(car);
    carId = data?.id;
  }

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px] space-y-16 md:space-y-24">
        {/* Section 1: Peta lokasi showroom */}
        <section>
          <LocationMap />
        </section>

        {/* Section 2: Split asimetris (DESIGN_VARIANCE 8) — teks kiri, form kanan */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
              Concierge
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-none tracking-tighter text-zinc-900 md:text-5xl">
              Start a conversation.
            </h1>
            <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-zinc-600">
              Tell us which model caught your eye. A Digimuda advisor will reach
              out on WhatsApp to arrange a private viewing or answer any
              questions — no pressure, no obligation.
            </p>

            <div className="mt-12 space-y-6">
              <div className="border-t border-stone-200/60 pt-6">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  Showroom
                </p>
                <p className="mt-2 font-mono text-sm text-zinc-900">
                  Jl. Senopati No. 88, Jakarta Selatan
                </p>
              </div>

              <div className="border-t border-stone-200/60 pt-6">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  Hours
                </p>
                <p className="mt-2 font-mono text-sm text-zinc-900">
                  Tue – Sun, 10:00 – 20:00 WIB
                </p>
              </div>

              <div className="border-t border-stone-200/60 pt-6">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  WhatsApp
                </p>
                <p className="mt-2 font-mono text-sm text-zinc-900">
                  +62 812 8471 9284
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm carId={carId} />
          </div>
        </section>
      </div>
    </main>
  );
}
