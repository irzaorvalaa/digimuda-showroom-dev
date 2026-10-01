import GrainOverlay from "@/components/motion/grain-overlay";

// Layout area auth: background gelap premium (zinc-950, bukan #000) dengan
// ambient glow emas + grain texture. Sengaja gelap untuk memisahkan area
// staff dari showroom publik yang terang (Art Gallery Mode).
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Ambient glow: dua blob emas lembut, murni dekoratif (aria-hidden). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-10%] size-[36rem] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-[-10%] size-[32rem] rounded-full bg-amber-600/8 blur-[120px]" />
      </div>

      {/* Grain texture halus di atas glow (pointer-events-none, tidak ganggu interaksi). */}
      <GrainOverlay className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay" />

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
