import Link from "next/link";
import {
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";

const exploreLinks = [
  { label: "The Collection", href: "/cars" },
  { label: "Digimuda Club", href: "/club" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/digimuda.showroom",
    Icon: InstagramLogo,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6281192630840",
    Icon: WhatsappLogo,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@digimudashowroom",
    Icon: YoutubeLogo,
  },
  {
    label: "Email",
    href: "mailto:hello@digimuda-showroom.com",
    Icon: EnvelopeSimple,
  },
];

// Footer premium "Art Gallery": wordmark besar left-aligned, kolom
// Visit/Contact/Explore, social pill, status "open" pulse. Tanpa kartu —
// grouping pakai border + negative space (SKILL Rule 4).
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200/60 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 md:gap-16">
        {/* Baris atas: wordmark besar + CTA, asimetris */}
        <div className="flex flex-col gap-8 border-b border-stone-200/60 pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
          <div>
            <p className="text-4xl font-bold leading-none tracking-tighter text-zinc-900 md:text-6xl">
              Digimuda <span className="text-amber-600">ShowRoom</span>
            </p>
            <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-zinc-600 md:text-base">
              A private showroom for curated luxury cars. Every car inspected
              across 142 points. Viewing by appointment.
            </p>
          </div>
          <ButtonLink href="/contact" variant="gold" className="w-fit">
            Book a viewing
          </ButtonLink>
        </div>

        {/* Baris tengah: Visit / Contact / Explore */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              Visit
            </p>
            <p className="mt-4 flex max-w-[32ch] items-start gap-2 text-sm leading-relaxed text-zinc-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-700" />
              <span>
                Jl. Ciputat Raya No. 21
                <br />
                Kebayoran Lama, Jakarta Selatan 12240
              </span>
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-600">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Open daily, 09.00–18.00 WIB
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              Contact
            </p>
            <a
              href="mailto:hello@digimuda-showroom.com"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              hello@digimuda-showroom.com
            </a>
            <a
              href="https://wa.me/6281192630840"
              className="font-mono text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              +62 811 9263 0840
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              Explore
            </p>
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Baris bawah: copyright + social pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200/60 pt-6">
          <p className="text-xs text-zinc-600">
            © {year} Digimuda ShowRoom. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Digimuda ShowRoom on ${label}`}
                className="flex size-9 items-center justify-center rounded-full border border-stone-200/60 text-zinc-600 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-100 hover:text-zinc-900 active:scale-[0.98]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
