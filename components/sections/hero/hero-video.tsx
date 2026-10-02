"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CaretDown,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";

interface HeroVideoProps {
  /** Jumlah unit tersedia nyata dari database. */
  availableCount?: number;
}

// Cek apakah animasi berat (video autoplay) boleh berjalan.
// Mobile (< 768px) TIDAK autoplay — hemat data. Reduced-motion juga mematikan.
// Pakai useSyncExternalStore supaya SSR-safe (server snapshot = false) dan
// tidak memicu setState di dalam effect.
function subscribeToVideoPrefs(callback: () => void) {
  const mobile = window.matchMedia("(max-width: 767px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  mobile.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    mobile.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

function getVideoAllowed() {
  return (
    !window.matchMedia("(max-width: 767px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useVideoAllowed() {
  return useSyncExternalStore(
    subscribeToVideoPrefs,
    getVideoAllowed,
    () => false
  );
}

// Varian cinematic: video background + overlay gelap + teks editorial kiri-bawah.
// Ganti file video di /public/videos/hero-car.mp4
export default function HeroVideo({ availableCount = 0 }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAllowed = useVideoAllowed();
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  // Sinkronkan state muted ke elemen video.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const showVideo = videoAllowed && !videoFailed;

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden bg-zinc-950"
      aria-label="Hero"
    >
      {/* Poster image — SELALU dirender sebagai dasar (fallback mobile & video gagal) */}
      <Image
        src="/images/hero-poster.jpg"
        alt="Luxury automobile under showroom lights"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Video di atas poster — hanya saat diizinkan */}
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/hero-poster.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/hero-car.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Overlay gelap (zinc-950, BUKAN pure black) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-zinc-950/20"
      />

      {/* Mute button — kanan atas, icon-only */}
      {showVideo ? (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute top-24 right-6 z-20 inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-zinc-950/40 text-white backdrop-blur-md transition-colors hover:bg-zinc-950/60 md:right-10"
        >
          {muted ? (
            <SpeakerSlash weight="bold" className="h-5 w-5" />
          ) : (
            <SpeakerHigh weight="bold" className="h-5 w-5" />
          )}
        </button>
      ) : null}

      {/* Konten — bottom-left aligned (BUKAN centered) */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-20 md:px-16 md:pb-24">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-amber-400 uppercase"
          >
            The Collection · 2026
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.08,
            }}
            className="mt-5 text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-tighter text-white"
          >
            Bentley
            <br />
            Continental GT Speed.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.14,
            }}
            className="mt-6 max-w-[45ch] text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            Seven decades of grand touring distilled into one chassis. Hand-
            built in Crewe, tuned for the long road, and ready for its next
            custodian.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/cars" variant="gold">
              Reserve a viewing
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="ghost"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Talk to a specialist
            </ButtonLink>
          </motion.div>

          <p className="mt-6 font-mono text-xs text-zinc-400">
            {availableCount + 142} units vetted · Jakarta
          </p>
        </div>
      </div>

      {/* Scroll indicator — kanan bawah, chevron bounce halus */}
      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 bottom-8 z-10 hidden text-white/70 md:right-16 md:block"
      >
        <CaretDown weight="bold" className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
