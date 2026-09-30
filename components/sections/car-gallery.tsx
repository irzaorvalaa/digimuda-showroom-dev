"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CarColor } from "@/types/car";

interface CoverflowThumbProps {
  url: string;
  alt: string;
  index: number;
  active: boolean;
  distance: number;
  onSelect: () => void;
}

// Thumbnail gaya "coverflow" (SKILL.md §8): foto di tengah fokus penuh,
// foto di sisi menyusut (scale + opacity) seiring jaraknya dari item aktif.
// Skala dihitung langsung dari prop `distance` (bukan state) sehingga murah
// dan tetap 60fps. Animate via transform/opacity saja.
function CoverflowThumb({
  url,
  alt,
  index,
  active,
  distance,
  onSelect,
}: CoverflowThumbProps) {
  // Skala menurun per langkah jarak; dibatasi supaya tidak terlalu kecil.
  const scale = Math.max(0.8, 1 - distance * 0.08);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`View photo ${index + 1} of ${alt}`}
      aria-current={active}
      animate={{
        scale,
        opacity: active ? 1 : 0.55,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileTap={{ scale: scale * 0.98 }}
      className={cn(
        "relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-white will-change-transform",
        active ? "border-amber-500" : "border-stone-200/60"
      )}
    >
      <Image src={url} alt="" fill sizes="80px" className="object-cover" />
    </motion.button>
  );
}

interface CarGalleryProps {
  coverImageUrl: string;
  galleryUrls: string[];
  alt: string;
  colors: CarColor[];
}

interface ColorOption {
  name: string;
  hex: string;
  images: string[];
}

// Galeri detail mobil dengan pemilih warna. Setiap warna (dari car_colors)
// punya galeri sendiri; memilih warna mengganti daftar foto dengan transisi
// spring. Warna is_default tampil pertama. Fallback ke cover/gallery lama
// jika belum ada data warna (kompatibilitas migrasi).
export default function CarGallery({
  coverImageUrl,
  galleryUrls,
  alt,
  colors,
}: CarGalleryProps) {
  // Susun opsi warna: prioritaskan data car_colors, fallback ke satu opsi.
  const options: ColorOption[] =
    colors.length > 0
      ? [...colors]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((color) => ({
            name: color.name,
            hex: color.hex,
            images: color.gallery_urls.length
              ? color.gallery_urls
              : [coverImageUrl, ...galleryUrls],
          }))
      : [
          {
            name: "Standard",
            hex: "#c9c5bb",
            images: [coverImageUrl, ...galleryUrls],
          },
        ];

  const defaultIndex = colors.length
    ? Math.max(
        0,
        [...colors]
          .sort((a, b) => a.sort_order - b.sort_order)
          .findIndex((c) => c.is_default)
      )
    : 0;

  const [colorIndex, setColorIndex] = useState(defaultIndex);
  const [selected, setSelected] = useState(0);
  const images = options[colorIndex].images;

  const selectColor = (index: number) => {
    setColorIndex(index);
    setSelected(0);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white shadow-diffusion">
        <motion.div
          key={`${colorIndex}-${selected}`}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute inset-0"
        >
          <Image
            src={images[selected]}
            alt={`${alt} — ${options[colorIndex].name}`}
            fill
            priority={selected === 0 && colorIndex === defaultIndex}
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {options.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <button
              key={option.name}
              type="button"
              onClick={() => selectColor(index)}
              aria-pressed={colorIndex === index}
              aria-label={`Show ${option.name} finish`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors active:scale-[0.98]",
                colorIndex === index
                  ? "border-amber-500 text-zinc-900"
                  : "border-stone-200/60 hover:border-stone-300"
              )}
            >
              <span
                aria-hidden
                className="size-3.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: option.hex }}
              />
              {option.name}
            </button>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto px-6 py-2 pb-1 md:justify-center">
          {images.map((url, index) => (
            <CoverflowThumb
              key={`${url}-${index}`}
              url={url}
              alt={alt}
              index={index}
              active={selected === index}
              distance={Math.abs(index - selected)}
              onSelect={() => setSelected(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
