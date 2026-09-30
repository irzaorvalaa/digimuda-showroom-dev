"use client";

import { memo } from "react";

interface GrainOverlayProps {
  className?: string;
}

// Data URI noise SVG (feTurbulence) — disimpan sebagai string statis
// supaya tidak dipecah formatter.
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Grain/noise halus untuk menambah tekstur premium (SKILL.md §5).
// Berupa elemen fixed/absolute pointer-events-none supaya tidak memicu
// repaint GPU saat scroll. Diisolasi + memo karena tidak perlu re-render.
function GrainOverlay({ className }: GrainOverlayProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: NOISE_DATA_URI,
        backgroundSize: "120px 120px",
      }}
    />
  );
}

export default memo(GrainOverlay);
