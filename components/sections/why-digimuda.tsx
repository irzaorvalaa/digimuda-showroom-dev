"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 4 keunggulan konkret — spesifik dan bisa dibuktikan, bukan klaim generic.
interface Reason {
  headline: string;
  body: string;
  imageText: string;
  alt: string;
}

const REASONS: Reason[] = [
  {
    headline: "Setiap unit lolos 142 titik inspeksi.",
    body: "Diperiksa teknisi bersertifikat sebelum masuk showroom.",
    imageText: "Inspeksi",
    alt: "Teknisi memeriksa bagian mesin mobil di area inspeksi",
  },
  {
    headline: "Dealer lain beri garansi mesin satu tahun. Kami tiga.",
    body: "Tiga tahun garansi mesin untuk setiap unit yang kami jual.",
    imageText: "Garansi+Mesin",
    alt: "Dokumen garansi mesin dan pemeriksaan tune up",
  },
  {
    headline: "Foto 360° dan video walkaround untuk setiap unit.",
    body: "Lihat kondisi asli mobil sebelum melangkah ke showroom.",
    imageText: "Foto+360",
    alt: "Pengambilan foto 360 derajat interior mobil",
  },
  {
    headline: "Antar-jemput gratis untuk test drive di seluruh Jabodetabek.",
    body: "Sulit ke Kebayoran Lama? Kami antar mobilnya ke lokasi Anda.",
    imageText: "Test+Drive",
    alt: "Pelanggan mencoba mobil saat sesi test drive",
  },
];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export function WhyDigimuda() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[var(--surface-base)] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Why Digimuda</h2>

        <div className="flex flex-col gap-20 md:gap-28">
          {REASONS.map((reason, index) => {
            const isReversed = index % 2 === 1;
            const isFirst = index === 0;

            return (
              <motion.article
                key={reason.headline}
                variants={rowVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className={cn(
                  "grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12",
                  !isFirst &&
                    "border-t border-[var(--border-subtle)] pt-20 md:pt-28"
                )}
              >
                {/* Gambar: sisi kiri pada baris genap, kanan pada baris ganjil. */}
                <div
                  className={cn(
                    "md:col-span-6",
                    isReversed ? "md:order-2" : "md:order-1"
                  )}
                >
                  <Image
                    src={`https://placehold.co/900x675/e5e7eb/52525b/png?text=${reason.imageText}`}
                    alt={reason.alt}
                    width={900}
                    height={675}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="aspect-[4/3] w-full rounded-2xl object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:hover:scale-[1.02]"
                  />
                </div>

                {/* Teks: sisi kanan pada baris genap, kiri pada baris ganjil. */}
                <div
                  className={cn(
                    "md:col-span-6",
                    isReversed ? "md:order-1" : "md:order-2"
                  )}
                >
                  <h3 className="text-[clamp(1.5rem,2.5vw,1.875rem)] font-semibold leading-tight tracking-tight text-[var(--text-primary)]">
                    {reason.headline}
                  </h3>
                  <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-[var(--text-secondary)]">
                    {reason.body}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyDigimuda;
