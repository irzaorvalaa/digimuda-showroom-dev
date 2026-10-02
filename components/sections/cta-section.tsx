import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";

// CTA panel gelap (bg-zinc-900, bukan #000) dengan inner border putih tipis
// untuk efek edge refraction (SKILL §4 Liquid Glass) — tanpa outer glow.
export default function CtaSection() {
  return (
    <section className="px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 px-6 py-16 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] md:px-16 md:py-24">
          {/* Inner border 1px — simulasi refraksi tepi, bukan neon glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-white/10" />

          {/* Aksen emas organik, sangat halus, di sudut kanan atas */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-500">
                Private access
              </p>
              <h2 className="mt-5 max-w-[18ch] text-h1 font-semibold text-white">
                Some cars never reach the floor.
              </h2>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-zinc-400 md:text-lg">
                Reserve arrives before public listing — often within 48 hours of
                acquisition. Tell us your shortlist and we will call you the
                moment one lands.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
              <ButtonLink
                href="/contact"
                variant="gold"
                className="w-full md:w-auto"
              >
                Request early access
                <ArrowRight size={16} weight="bold" />
              </ButtonLink>
              <p className="text-xs text-zinc-400 lg:text-right">
                No mailing list. One advisor, one conversation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
