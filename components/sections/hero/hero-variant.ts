// Helper varian hero — dipisah dari index.ts untuk mencegah circular import
// (index.ts meng-export HeroSwitcher yang butuh getHeroVariant).

export type HeroVariant = "video" | "image" | "split";

const VALID_VARIANTS: readonly HeroVariant[] = ["video", "image", "split"];

// Tentukan varian akhir: query param mengalahkan env, fallback ke "split".
// Nilai tidak valid diabaikan (bukan crash).
export function getHeroVariant(fromQuery?: string | null): HeroVariant {
  if (fromQuery && VALID_VARIANTS.includes(fromQuery as HeroVariant)) {
    return fromQuery as HeroVariant;
  }
  const fromEnv = process.env.NEXT_PUBLIC_HERO_VARIANT;
  if (fromEnv && VALID_VARIANTS.includes(fromEnv as HeroVariant)) {
    return fromEnv as HeroVariant;
  }
  return "split";
}
