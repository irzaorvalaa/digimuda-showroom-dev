import type { Metadata } from "next";
import {
  LockKey,
  ClockCounterClockwise,
  Wrench,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";

export const metadata: Metadata = {
  title: "Digimuda Club | Digimuda ShowRoom",
  description:
    "A small membership for collectors — early access to reserve stock, priority sourcing, and servicing handled end to end.",
};

// Benefit ditampilkan sebagai baris divide-y (anti card-box, SKILL Rule 4).
const benefits = [
  {
    title: "Reserve before listing",
    body: "New acquisitions go to members first. You typically see a car 48 hours before it appears on the site.",
    Icon: LockKey,
  },
  {
    title: "Sourcing on request",
    body: "Give us a shortlist. We search our trade network across Indonesia and Europe, and report back weekly.",
    Icon: ClockCounterClockwise,
  },
  {
    title: "Servicing handled",
    body: "We book, supervise, and collect your car for its annual service at marque-approved workshops.",
    Icon: Wrench,
  },
  {
    title: "Enclosed transport",
    body: "Two covered deliveries per year within Java, included. Weekend handovers at your address.",
    Icon: Truck,
  },
];

// Dua tier asimetris 7/5 — bukan tiga kartu sejajar (AI-tell yang dilarang).
const tiers = [
  {
    name: "Collector",
    price: "IDR 4.500.000",
    period: "per year",
    summary:
      "For the enthusiast with one or two cars in the garage. Early access and sourcing, without the full white-glove layer.",
    featured: false,
  },
  {
    name: "Concierge",
    price: "IDR 18.000.000",
    period: "per year",
    summary:
      "Everything in Collector, plus a named advisor, servicing management, and enclosed transport. Limited to 40 members so response times stay honest.",
    featured: true,
  },
];

export default function ClubPage() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Hero asimetris: teks kiri 7 kolom, angka organik kanan 5 kolom */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
              Digimuda Club
            </p>
            <h1 className="mt-4 max-w-[16ch] text-4xl font-bold leading-none tracking-tighter text-zinc-900 md:text-6xl">
              A quiet list of people who care.
            </h1>
            <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-zinc-600 md:text-lg">
              Membership exists for one reason: good cars move fast, and most
              buyers never get to see them. Members get first look, a real
              advisor on WhatsApp, and someone to handle the boring parts of
              ownership.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-8 lg:col-span-5">
            <div className="border-t border-stone-200/60 pt-6">
              <p className="font-mono text-4xl font-medium text-zinc-900">38</p>
              <p className="mt-1 text-sm text-zinc-600">
                members today, capped at 40
              </p>
            </div>
            <div className="border-t border-stone-200/60 pt-6">
              <p className="font-mono text-4xl font-medium text-zinc-900">
                6.4 days
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                average time a car stays listed
              </p>
            </div>
          </div>
        </div>

        {/* Benefit — baris divide-y, bukan kartu */}
        <div className="mt-24 md:mt-32">
          <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 md:text-4xl">
            What membership actually does.
          </h2>

          <StaggerGrid className="mt-10 grid-cols-1 gap-0 md:grid-cols-2">
            {benefits.map((benefit) => (
              <StaggerItem
                key={benefit.title}
                className="border-t border-stone-200/60 px-0 py-8 md:odd:pr-10 md:even:border-l md:even:pl-10"
              >
                <benefit.Icon
                  size={28}
                  weight="thin"
                  className="text-amber-700"
                />
                <h3 className="mt-4 text-xl font-medium tracking-tight text-zinc-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 max-w-[45ch] text-base leading-relaxed text-zinc-600">
                  {benefit.body}
                </p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        {/* Tier asimetris 7/5 */}
        <div className="mt-24 grid grid-cols-1 gap-6 md:mt-32 md:grid-cols-12">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={
                tier.featured
                  ? "relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] md:col-span-5 md:p-10"
                  : "rounded-[2.5rem] border border-stone-200/60 bg-white p-8 shadow-diffusion md:col-span-7 md:p-10"
              }
            >
              {tier.featured ? (
                <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-white/10" />
              ) : null}

              <div className="relative">
                <div className="flex items-center gap-3">
                  <h3
                    className={
                      tier.featured
                        ? "text-lg font-medium tracking-tight text-white"
                        : "text-lg font-medium tracking-tight text-zinc-900"
                    }
                  >
                    {tier.name}
                  </h3>
                  {tier.featured ? (
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-zinc-900">
                      Most chosen
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span
                    className={
                      tier.featured
                        ? "font-mono text-3xl font-medium text-white"
                        : "font-mono text-3xl font-medium text-zinc-900"
                    }
                  >
                    {tier.price}
                  </span>
                  <span
                    className={
                      tier.featured
                        ? "text-sm text-zinc-400"
                        : "text-sm text-zinc-600"
                    }
                  >
                    {tier.period}
                  </span>
                </div>

                <p
                  className={
                    tier.featured
                      ? "mt-5 max-w-[40ch] text-base leading-relaxed text-zinc-400"
                      : "mt-5 max-w-[50ch] text-base leading-relaxed text-zinc-600"
                  }
                >
                  {tier.summary}
                </p>

                <div className="mt-8">
                  <ButtonLink
                    href="/contact"
                    variant={tier.featured ? "gold" : "ghost"}
                  >
                    {index === 0
                      ? "Enquire about Collector"
                      : "Apply for Concierge"}
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[60ch] text-sm leading-relaxed text-zinc-600">
          Membership is by conversation, not checkout. We turn away applicants
          who only want a discount — the list works because everyone on it is
          patient.
        </p>
      </div>
    </main>
  );
}
