"use client";

import { memo, useState } from "react";
import { ArrowUpRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";

// Koordinat showroom (Jl. Senopati No. 88, Jakarta Selatan).
const SHOWROOM_COORDINATES = "-6.238269,106.804664";
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${SHOWROOM_COORDINATES}&hl=en&z=16&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${SHOWROOM_COORDINATES}`;

// Peta statis di dalam kontainer premium. Filter CSS meredam saturasi
// peta agar selaras palet cream; hover memunculkan warna penuh.
function LocationMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      aria-label="Showroom location"
      className="border-t border-stone-200/60 pt-20"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Kolom teks kiri — anti-center bias */}
        <div className="lg:col-span-4">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
            Visit us
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-none tracking-tighter text-zinc-900 md:text-4xl">
            The room is open.
          </h2>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-zinc-600">
            Drop by for a quiet walk-through of the current lineup. Espresso is
            on the house — appointments preferred for private viewings.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-amber-800" />
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  Digimuda ShowRoom
                </p>
                <p className="mt-1 font-mono text-sm text-zinc-600">
                  Jl. Senopati No. 88, Kebayoran Baru
                </p>
                <p className="font-mono text-sm text-zinc-600">
                  Jakarta Selatan 12190
                </p>
              </div>
            </div>

            <ButtonLink href={DIRECTIONS_URL} variant="primary">
              Get directions
              <ArrowUpRight size={16} className="ml-2" />
            </ButtonLink>
          </div>
        </div>

        {/* Kolom peta kanan — kontainer besar, tidak full-width generik */}
        <div className="lg:col-span-8">
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <iframe
              title="Digimuda ShowRoom location map"
              src={MAPS_EMBED_URL}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setLoaded(true)}
              className="h-[420px] w-full border-0 grayscale-[0.35] transition-[filter] duration-500 group-hover:grayscale-0 md:h-[520px]"
            />

            {/* Skeleton saat peta belum dimuat */}
            {!loaded && (
              <div className="absolute inset-0 -z-10 animate-pulse bg-stone-200/50" />
            )}

            {/* Kartu lokasi mengambang — breating pulse dot */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.2,
              }}
              className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-zinc-900/90 px-5 py-3 text-white backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium tracking-tight">
                Open now — Tue to Sun
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Perpetual animation diisolasi (pulse dot) via memo.
export default memo(LocationMap);
