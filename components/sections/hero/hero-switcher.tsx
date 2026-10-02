"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HeroVideo from "./hero-video";
import HeroImage from "./hero-image";
import HeroSplit from "./hero-split";
import { getHeroVariant, type HeroVariant } from "./hero-variant";

interface HeroSwitcherProps {
  /** Jumlah unit tersedia nyata dari database, diteruskan ke tiap varian. */
  availableCount: number;
}

// Baca query param ?hero=video|image|split (override env) lalu render varian.
// useSearchParams dari next/navigation supaya SSR-safe, bukan window.location.
function HeroVariantResolver({ availableCount }: HeroSwitcherProps) {
  const searchParams = useSearchParams();
  const variant: HeroVariant = getHeroVariant(searchParams?.get("hero"));

  if (variant === "video") return <HeroVideo availableCount={availableCount} />;
  if (variant === "image") return <HeroImage availableCount={availableCount} />;
  return <HeroSplit availableCount={availableCount} />;
}

// Fallback: varian default dari env. Dipakai Next.js saat men-prerender halaman
// statis yang memakai useSearchParams (mencegah CSR bailout error di build),
// sekaligus jadi tampilan awal sebelum query param terbaca di klien.
function HeroFallback({ availableCount }: HeroSwitcherProps) {
  const variant = getHeroVariant(null);
  if (variant === "video") return <HeroVideo availableCount={availableCount} />;
  if (variant === "image") return <HeroImage availableCount={availableCount} />;
  return <HeroSplit availableCount={availableCount} />;
}

export default function HeroSwitcher({ availableCount }: HeroSwitcherProps) {
  return (
    <Suspense fallback={<HeroFallback availableCount={availableCount} />}>
      <HeroVariantResolver availableCount={availableCount} />
    </Suspense>
  );
}
