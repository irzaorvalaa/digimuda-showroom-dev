import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const exploreLinks = [
  { label: "The Collection", href: "/cars" },
  { label: "Digimuda Club", href: "/club" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

// Footer compact luxury — quiet closing note, bukan showcase.
// Satu baris wordmark + grid 3 kolom tipis + signature bar.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto bg-[#161412] text-stone-400">
      {/* Hairline emas tipis — signature line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
      />

      <div className="mx-auto max-w-[1400px] px-6 pb-8 pt-14 md:px-10 md:pb-10 md:pt-16">
        {/* ─── Tier 1: Wordmark + tagline (satu baris) ─── */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="font-serif text-3xl italic leading-none tracking-tight text-stone-100 md:text-4xl">
            Digimuda
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-500/80">
            Est. MMXXIV · Jakarta
          </p>
        </div>

        {/* ─── Tier 2: 3 kolom direktori ─── */}
        <div className="mt-10 grid gap-10 border-t border-white/8 pt-8 md:mt-12 md:grid-cols-12 md:gap-8 md:pt-10">
          {/* Visit */}
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
              Visit
            </p>
            <address className="mt-3 not-italic text-sm leading-[1.7] text-stone-300">
              Jl. Ciputat Raya No. 21, Kebayoran Lama
              <br />
              Jakarta Selatan 12240
            </address>
            <p className="mt-3 flex items-center gap-2 text-xs leading-relaxed text-stone-500">
              <span
                aria-hidden="true"
                className="relative flex size-2 shrink-0"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Open daily from 9am. Viewings by appointment.</span>
            </p>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
              Contact
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  href="mailto:hello@digimuda-showroom.com"
                  className="group inline-flex items-baseline gap-1.5 text-sm text-stone-300 transition-colors hover:text-amber-500"
                >
                  <span className="border-b border-transparent transition-colors group-hover:border-amber-500/40">
                    hello@digimuda-showroom.com
                  </span>
                  <ArrowUpRight
                    size={11}
                    className="translate-y-px opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281192630840"
                  className="group inline-flex items-baseline gap-1.5 font-mono text-sm text-stone-300 transition-colors hover:text-amber-500"
                >
                  <span className="border-b border-transparent transition-colors group-hover:border-amber-500/40">
                    +62 811 9263 0840
                  </span>
                  <ArrowUpRight
                    size={11}
                    className="translate-y-px opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
              Explore
            </p>
            <ul className="mt-3 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-stone-300 transition-colors hover:text-amber-500"
                  >
                    <span className="border-b border-transparent transition-colors group-hover:border-amber-500/40">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Tier 3: Signature bar ─── */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 md:mt-12 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">
            © {year} Digimuda ShowRoom
          </p>
        </div>
      </div>
    </footer>
  );
}
