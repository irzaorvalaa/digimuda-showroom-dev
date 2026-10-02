import HeroVideo from "./hero-video";
import HeroImage from "./hero-image";
import HeroSplit from "./hero-split";
import HeroSwitcher from "./hero-switcher";

// Re-export helper varian dari hero-variant.ts (sumber tunggal, anti circular).
export { getHeroVariant, type HeroVariant } from "./hero-variant";

export { HeroVideo, HeroImage, HeroSplit, HeroSwitcher };
