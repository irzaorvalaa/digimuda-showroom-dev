# HIGH-AGENCY FRONTEND SKILL — UNIFIED EDITION (v3.3.1)

Gabungan Doc 1 (Sections 1–10) + Doc 2 (Sections 11–21) + 22 perbaikan produksi.
**Optimized for: Tailwind v4 + Next.js 16 + React 19 + Geist + Framer Motion 13.**
Semua aturan berlaku. Bila terjadi konflik, ikuti Hierarki Dokumen di Section 2.

---

## PART 0 — OPERATING PRINCIPLES

### Section 1 — Active Baseline Configuration

```
DESIGN_VARIANCE    : 8   (1=Symmetry, 10=Artsy Chaos)
MOTION_INTENSITY   : 6   (1=Static, 10=Cinematic)
VISUAL_DENSITY     : 4   (1=Gallery, 10=Cockpit)
```

**AI Instruction:** Baseline default = **(8, 6, 4)**. Jangan minta user mengedit file ini. **Selalu** dengarkan user — override nilai secara dinamis bila user memintanya di chat. Nilai-nilai ini adalah _global variable_ yang menggerakkan logika di Section 8–11.

### Section 2 — Document Hierarchy (Conflict Resolution)

Bila dua aturan bertabrakan, urutan prioritas:

1. **Instruksi user di chat** (paling tinggi)
2. **Section 1 baseline** (jika user tidak override)
3. **Section 17 — AI Tells** (larangan absolut; tidak bisa di-_override_ tanpa permintaan eksplisit)
4. **Section 15 — Editorial Tone**, **Section 16 — Performance Budget**, **Section 16.5 — Accessibility** (batas keras)
5. **Semua section lain** (default, bisa disesuaikan)

---

## PART 1 — ARCHITECTURE & CONVENTIONS

### Section 3 — Stack & Conventions

**DEPENDENCY VERIFICATION [MANDATORY]:** Sebelum import library pihak ketiga (mis. `framer-motion`, `zustand`, `react-hook-form`, `@tanstack/react-query`), **WAJIB** cek `package.json`. Jika tidak ada, output perintah instalasi (`npm install package-name`) sebelum kode. Jangan asumsikan library sudah ada.

**FRAMER MOTION (verified v13.4.4):** Proyek ini pakai `framer-motion@^13.4.4`.

- Import runtime: `import { motion, AnimatePresence } from "framer-motion"`
- Import type: `import type { Transition } from "framer-motion"`
- Peer dependency React 18/19 kompatibel. **Jangan** migrasi ke package `motion`.

- **Framework:** React / Next.js. Default ke Server Components (RSC).
- **RSC SAFETY:** Global state HANYA di Client Component. Di Next.js, bungkus provider dalam komponen `"use client"`.
- **INTERACTIVITY ISOLATION:** Jika Section 10 atau 11 aktif, komponen UI interaktif **WAJIB** diekstrak sebagai leaf component terisolasi dengan `'use client'` di paling atas. Server Component hanya merender layout statis.
- **State Management:** `useState`/`useReducer` untuk UI lokal. Global state hanya untuk menghindari prop-drilling dalam.
- **Styling:** Tailwind CSS v4 (CSS-first via `@theme`). Sisanya: inline style hanya untuk nilai dinamis (canvas, SVG).
- **TAILWIND VERSION LOCK:** Cek `package.json`. Untuk v4, **WAJIB** pakai `@tailwindcss/postcss` — bukan plugin `tailwindcss` di `postcss.config.js`.
- **ANTI-EMOJI POLICY [CRITICAL]:** Jangan pernah pakai emoji di kode, markup, teks, atau alt text. Ganti dengan ikon berkualitas (Radix, Phosphor) atau SVG primitif.
- **Responsiveness:** Standarkan breakpoint (`sm, md, lg, xl`). Konten dibungkus `max-w-[1400px] mx-auto` atau `max-w-7xl`.
- **Viewport Stability [CRITICAL]:** Jangan pakai `h-screen` untuk Hero. Selalu `min-h-[100dvh]`.
- **Grid over Flex-Math:** Jangan pakai `w-[calc(33%-1rem)]`. Pakai CSS Grid.
- **Icons:** Pakai **`@phosphor-icons/react`** atau **`@radix-ui/react-icons`**. **Icon library lain tidak diizinkan** (termasuk `lucide-react`, `react-icons`, `heroicons`). Standarkan `strokeWidth` global (`1.5` untuk utility, `2.0` untuk display).

### Section 4 — Design Tokens (Tailwind v4 CSS-First)

**Aturan inti:** JANGAN pakai hex mentah di JSX. Definisi semua token di `app/globals.css` via `@theme`. Di Tailwind v4, prefix `--color-` otomatis menghasilkan utility `bg-*`, `text-*`, `border-*`.

#### 4A. Theme Definition (`app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Surfaces */
  --color-surface-base: #f6f3ed;
  --color-surface-elevated: #ffffff;
  --color-surface-sunken: #ebe6dc;
  --color-surface-inverse: #18181b;

  /* Text (prefix "ink-" untuk hindari clash dengan utility text-*) */
  --color-ink-primary: #18181b;
  --color-ink-secondary: #52525b;
  --color-ink-muted: #a1a1aa;
  --color-ink-inverse: #fafaf9;
  --color-ink-accent: #92400e;
  --color-ink-accent-lg: #d97706;

  /* Borders — hex-alpha agar opacity modifier (/50, /80) bekerja */
  --color-border-subtle: #78716c26; /* stone-500 @ 0.15 */
  --color-border-default: #78716c40; /* stone-500 @ 0.25 */
  --color-border-accent: #f59e0b66; /* amber-500 @ 0.40 */

  /* Accent (Amber/Gold) */
  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --color-accent-soft: #f59e0b1a; /* amber-500 @ 0.10 */

  /* State */
  --color-state-success: #10b981;
  --color-state-warning: #f59e0b;
  --color-state-danger: #dc2626;
  --color-state-info: #3b82f6;

  /* Radius */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-xl: 2rem;
  --radius-2xl: 2.5rem;
  --radius-pill: 9999px;

  /* Motion */
  --motion-instant: 100ms;
  --motion-quick: 200ms;
  --motion-standard: 350ms;
  --motion-slow: 600ms;
  --motion-cinematic: 1200ms;
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

#### 4B. `postcss.config.mjs`

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Bukan** `tailwindcss: {}`. Itu v3.

#### 4C. Pemakaian di JSX

```tsx
<div className="bg-surface-elevated text-ink-primary border border-border-subtle rounded-2xl p-10">
```

Opacity modifier **bekerja native** karena token pakai hex-alpha:

```tsx
<div className="bg-surface-inverse/40 border-border-subtle/60 backdrop-blur-sm">
```

**Aturan:**

- Jangan hardcode hex di JSX kecuali SVG fill / canvas.
- Butuh warna baru? Tambahkan token `--color-*` di `@theme`.
- Satu accent color saja. Butuh kedua? Tanya user.
- **LILA BAN:** Purple/blue AI aesthetic dilarang. Neutral base (Zinc/Slate/Stone) + satu accent desaturated (< 80% saturasi).
- **NO `tailwind.config.ts`** kecuali butuh plugin JS. Semua warna/radius/motion via `@theme`.
- Untuk token semi-transparan, **selalu pakai hex-alpha** (`#78716c26`), bukan `rgba()` — supaya opacity modifier v4 bekerja.

### Section 5 — Fluid Typography Scale

Ganti fixed size dengan `clamp()` untuk hero & display.

```css
@theme {
  --text-display: clamp(2.5rem, 8vw, 7rem);
  --text-h1: clamp(2.25rem, 5vw, 4rem);
  --text-h2: clamp(1.75rem, 3.5vw, 2.5rem);
  --text-h3: clamp(1.25rem, 2vw, 1.5rem);
  --text-body: clamp(0.9375rem, 1vw, 1rem);
  --text-caption: clamp(0.6875rem, 0.8vw, 0.75rem);
}
```

Pemakaian: `text-[clamp(2.5rem,8vw,7rem)] tracking-tighter leading-[0.95]`

**Aturan:**

- Display & H1 **WAJIB** `clamp()`. Fixed size hanya untuk body/caption.
- **Nilai minimum display = `2.5rem`.** Ini sumber tunggal kebenaran; Section 14 #11 hanya merujuk ke sini.
- Leading display: `leading-[0.9]` s/d `leading-[1.05]`.
- Tracking display: `-0.03em` (tighter). H2/H3: `tracking-tight`.
- **JANGAN `font-black`** untuk display — pakai `font-semibold` atau `font-medium`.
- Font stack: **Geist, Outfit, Cabinet Grotesk, Satoshi**. **Inter DILARANG.**
- Body: `text-base text-ink-secondary leading-relaxed max-w-[65ch]`.
- **Serif BANNED** untuk Dashboard/Software UI. Serif hanya untuk creative/editorial.
- **NO Oversized H1s:** kontrol hierarki dengan weight & color, bukan skala masif.

### Section 6 — Depth System (5 Levels)

| Level | Nama     | Pemakaian                          | Style                                         |
| ----- | -------- | ---------------------------------- | --------------------------------------------- |
| 0     | FLAT     | Section, divider                   | `border border-border-subtle` saja            |
| 1     | RAISED   | Tombol secondary, badge interaktif | `shadow-[0_1px_2px_rgba(0,0,0,0.04)]`         |
| 2     | FLOATING | Kartu utama, panel                 | `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]` |
| 3     | MODAL    | Dialog, drawer, popover            | `shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]` |
| 4     | OVERLAY  | Backdrop modal                     | `bg-surface-inverse/40 backdrop-blur-sm`      |

**Aturan kritis:**

- **Max 2 level shadow per halaman.** Contoh: Level 0 (section) + Level 2 (kartu).
- Shadow hanya untuk elevasi fungsional, bukan dekorasi.
- **Tint shadow ke background hue.** Cream → `rgba(120,113,108,0.05)`, bukan `rgba(0,0,0,0.05)`.
- Jangan pakai shadow blur > 80px.
- **DASHBOARD HARDENING:** Untuk `VISUAL_DENSITY > 7`, kartu generik BANNED. Pakai `border-t`, `divide-y`, atau negative space. Angka pakai `font-mono`.

### Section 7 — Ambient Detail Layer

**A. Grain / Noise Overlay**

- Posisi: `fixed inset-0 pointer-events-none z-0`
- SVG noise 200×200, opacity `0.03`
- HANYA di hero & section fullscreen. JANGAN di scrolling container.

**B. Vignette**

- Posisi: `absolute inset-0` pada hero
- `radial-gradient(ellipse at center, transparent 40%, rgba(24,24,27,0.15) 100%)`
- HANYA hero dengan gambar besar.

**C. Ambient Glow**

- Posisi: `absolute` di belakang produk/gambar
- `radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)`
- Size: 150% dari ukuran gambar
- **WAJIB** `blur(80px)` di pseudo-element, BUKAN di elemen utama
- Ini bukan shadow — ini layer background, jadi tidak melanggar Section 6.

**Definisi teknis (untuk menghindari ambiguitas Section 17):**

- **Outer Glow** = `box-shadow` atau `filter: drop-shadow` pada elemen itu sendiri. → **DILARANG.**
- **Ambient Layer** = gradient background di pseudo-element terpisah (`::before`/`::after` atau `<div aria-hidden>`), `pointer-events-none`, `z-index` di bawah konten. → **DIIZINKAN.**

**Aturan:** Semua ambient detail `pointer-events-none`, di belakang konten, max 2 layer per section. `prefers-reduced-motion` tidak berpengaruh (statis).

---

## PART 2 — DESIGN ENGINEERING DIRECTIVES

### Section 8 — Design Directives (Bias Correction)

**Rule 1 — Typography (lihat Section 5).**

**Rule 2 — Color (lihat Section 4).**

**Rule 3 — Layout Diversification**

- **ANTI-CENTER BIAS:** Centered Hero/H1 BANNED bila `DESIGN_VARIANCE > 4`. Paksa Split Screen (50/50), Left-Aligned content/Right asset, atau Asymmetric Whitespace.
- **NO 3-Column Card Layouts** (yang dimaksud: 3 kolom **sama rata**, feature-row generik). Pakai 2-column Zig-Zag, asymmetric grid, atau horizontal scroll. **Bento grid dengan 3 kolom asymmetric (mis. `grid-cols-[2fr_1fr_1fr]`) TIDAK dilarang** — lihat Section 11C.

**Rule 4 — Materiality & Anti-Card Overuse**

- Pakai kartu HANYA bila elevasi mengkomunikasikan hierarki.
- **Liquid Glass:** `backdrop-blur` + `border border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`.

**Rule 5 — Interactive UI States**

- **Loading:** Skeleton yang match layout (bukan spinner bundar).
- **Empty:** Komposisi indah, bukan "No data".
- **Error:** Inline, actionable (bukan `alert()` browser).
- **Tactile:** `:active` → `-translate-y-[1px]` atau `scale-[0.98]`.

**Rule 6 — Data & Form Patterns**

- Label DI ATAS input. Helper text opsional. Error text DI BAWAH input.
- `gap-2` untuk blok input.
- Font input minimal **16px** (cegah iOS auto-zoom).

### Section 9 — Creative Proactivity (Anti-Slop)

- **Liquid Glass Refraction:** `backdrop-blur` + `border border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`.
- **Magnetic Micro-physics (MOTION_INTENSITY > 5):** Tombol yang menarik ke kursor. **JANGAN** pakai `useState`. Pakai Framer Motion `useMotionValue` + `useTransform` di luar render cycle.
- **Perpetual Micro-Interactions (MOTION_INTENSITY > 5):** Pulse, Typewriter, Float, Shimmer, Carousel pada komponen standar. Spring physics: `SPRING.standard`. **Interval ≥ 2s.**
- **Layout Transitions:** Gunakan `layout` dan `layoutId` Framer Motion untuk re-order, resize, shared element.
- **Staggered Orchestration:** Jangan mount list/grid instan. `staggerChildren` (Framer) atau `animation-delay: calc(var(--index) * 100ms)`. Parent & Children HARUS di Client Component tree yang sama.
- **CRITICAL:** Untuk stagger dengan banyak item, gunakan `staggerChildren` (satu parent, banyak children) — ini **bukan** "N simultaneous springs", melainkan satu orchestration. Lihat catatan di Section 16.

---

## PART 3 — MOTION

### Section 10 — Motion Choreography

**Named durations:**

| Token                | Durasi | Fungsi                        | Spring                              |
| -------------------- | ------ | ----------------------------- | ----------------------------------- |
| `--motion-instant`   | 100ms  | Tap, hover kecil              | stiffness 300, damping 25           |
| `--motion-quick`     | 200ms  | Button press, toggle          | stiffness 200, damping 22           |
| `--motion-standard`  | 350ms  | Card reveal, modal, accordion | stiffness 100, damping 20 ← default |
| `--motion-slow`      | 600ms  | Hero entrance, section reveal | stiffness 80, damping 25            |
| `--motion-cinematic` | 1200ms | Page transition, marquee      | tween, `cubic-bezier(0.16,1,0.3,1)` |

**Spring Mapping (WAJIB pakai ini — jangan hardcode di komponen):**

```ts
// lib/motion.ts
import type { Transition } from "framer-motion";

export const SPRING = {
  instant: { type: "spring", stiffness: 300, damping: 25 },
  quick: { type: "spring", stiffness: 200, damping: 22 },
  standard: { type: "spring", stiffness: 100, damping: 20 },
  slow: { type: "spring", stiffness: 80, damping: 25 },
  cinematic: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
} as const satisfies Record<string, Transition>;

export type MotionToken = keyof typeof SPRING;
```

Pemakaian:

```tsx
import { motion } from "framer-motion";
import { SPRING } from "@/lib/motion";

<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={SPRING.standard}
/>;
```

**Aturan:**

- **Satu interaksi = satu tujuan motion.** Jangan scale + rotate + color + shadow sekaligus.
- Urutan reveal: container dulu, isi kedua.
- Stagger: `0.08s` untuk list padat, `0.12s` untuk kartu.
- **Exit animation lebih cepat dari enter (60%).** Enter 350ms → Exit 200ms.
- Perpetual animation interval **≥ 2s**.
- Jangan animasi `top/left/width/height`. Hanya `transform` & `opacity`.
- Jangan `window.addEventListener('scroll')`. Pakai Framer Motion hooks.
- **JANGAN campur GSAP/ThreeJS dengan Framer Motion** di component tree yang sama. GSAP/ThreeJS hanya untuk full-page scrolltelling terisolasi dengan cleanup di `useEffect`.

### Section 11 — Motion-Engine Bento Paradigm

**A. Philosophy**

- Aesthetic: High-end, minimal, fungsional.
- Palette: `bg-surface-base` untuk halaman, `bg-surface-elevated` untuk kartu, `border-border-subtle` untuk border.
- Surfaces: `rounded-2xl` untuk kontainer utama. Diffusion shadow (`shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]` — atau versi tinted).
- Typography: Geist / Satoshi / Cabinet Grotesk. `tracking-tight` untuk header.
- Labels: Judul & deskripsi **DI LUAR** kartu, di bawah.
- Padding: `p-8` atau `p-10`.

**B. Animation Engine**

- Spring physics: `SPRING.standard`.
- `layout` & `layoutId` untuk re-order & shared element.
- Setiap kartu punya **Active State loop infinite** (Pulse, Typewriter, Float, Carousel).
- Wrap list dinamis dalam `<AnimatePresence>`.
- **PERFORMANCE CRITICAL:** Perpetual animation **WAJIB** `React.memo` + diisolasi di Client Component mikroskopis. Jangan trigger re-render parent.

**C. 5 Card Archetypes**

1. **The Intelligent List** — Auto-sorting loop infinite, `layoutId` untuk swap posisi.
2. **The Command Input** — Typewriter multi-step, blinking cursor, "processing" shimmer.
3. **The Live Status** — "Breathing" status indicator + badge pop-up dengan overshoot spring, muncul 3s, hilang.
4. **The Wide Data Stream** — Infinite carousel horizontal (`x: ["0%", "-100%"]`), seamless.
5. **The Contextual UI (Focus Mode)** — Staggered highlight + float-in toolbar dengan micro-icons.

**Grid layout:** Row 1 (3 cols **ASYMMETRIC** — mis. `grid-cols-[2fr_1fr_1fr]`), Row 2 (2 cols split 70/30, mis. `grid-cols-[7fr_3fr]`).

**Catatan penting:** Ini **BUKAN** "3 equal cards" yang dilarang Section 8 Rule 3. Setiap tile punya **dimensi & kepentingan berbeda** — itulah esensi Bento grid. Yang dilarang adalah 3 kolom **sama rata** tanpa hierarki.

---

## PART 4 — INTERACTION & STATE

### Section 12 — State Machine (7 States)

Setiap komponen data **WAJIB** punya 7 state:

1. **IDLE** — Skeleton, bukan spinner.
2. **LOADING** — Skeleton match layout final.
3. **SUCCESS** — Data valid, render normal.
4. **EMPTY** — Fetch sukses, 0 baris. Ilustrasi SVG + copy konkret + CTA. Bukan merah.
5. **ERROR** — Pesan singkat + tombol retry + opsi alternatif. Bukan `alert()`.
6. **PARTIAL** — Data ada, sebagian null. Handle gracefully. Contoh: mobil tanpa harga → "Ask Us". Jangan crash / tampil "null".
7. **OPTIMISTIC** — Tampilkan hasil dulu, rollback kalau gagal.

**Aturan:**

- Loading **WAJIB** skeleton, bukan spinner bundar.
- Empty **BUKAN** error. Jangan merah.
- Semua state **WAJIB** diuji: matikan server, restart, ubah data.

### Section 12.5 — Reference Implementation (7-State Component)

Template ini adalah _source of truth_ untuk semua komponen data. **Pola request-ID** dipakai untuk mencegah race condition saat user spam-retry.

```tsx
// components/data-card.tsx
"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";

type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T[] }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "partial"; data: T[] }
  | { status: "optimistic"; data: T[] };

type Action<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T[] }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "OPTIMISTIC_ADD"; payload: T }
  | { type: "ROLLBACK"; payload: T[] };

function reducer<T>(state: FetchState<T>, action: Action<T>): FetchState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS": {
      if (action.payload.length === 0) return { status: "empty" };
      const hasNulls = action.payload.some(
        (item) =>
          item == null || Object.values(item as object).some((v) => v == null)
      );
      return hasNulls
        ? { status: "partial", data: action.payload }
        : { status: "success", data: action.payload };
    }
    case "FETCH_ERROR":
      return { status: "error", message: action.message };
    case "OPTIMISTIC_ADD": {
      const current = "data" in state ? state.data : [];
      return { status: "optimistic", data: [action.payload, ...current] };
    }
    case "ROLLBACK":
      return { status: "success", data: action.payload };
    default:
      return state;
  }
}

type DataCardProps<T> = {
  /**
   * WAJIB di-memoize dengan useCallback di parent.
   * Kalau tidak, akan terjadi infinite refetch loop.
   * Alternatif lebih aman: pakai <DataCardByUrl url="..." /> di bawah.
   */
  fetcher: () => Promise<T[]>;
};

export function DataCard<T>({ fetcher }: DataCardProps<T>) {
  const [state, dispatch] = useReducer(reducer<T>, { status: "idle" });
  const requestIdRef = useRef(0);

  const load = useCallback(() => {
    const myId = ++requestIdRef.current;

    dispatch({ type: "FETCH_START" });

    fetcher()
      .then((data) => {
        // Hanya request terbaru yang boleh menulis state
        if (myId === requestIdRef.current) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      })
      .catch((err) => {
        if (myId === requestIdRef.current) {
          dispatch({
            type: "FETCH_ERROR",
            message: err?.message ?? "Gagal memuat data.",
          });
        }
      });
  }, [fetcher]);

  useEffect(() => {
    load();
    return () => {
      // Invalidasi request yang masih in-flight saat unmount
      requestIdRef.current++;
    };
  }, [load]);

  switch (state.status) {
    case "idle":
    case "loading":
      return <SkeletonCard />;
    case "empty":
      return <EmptyState />;
    case "error":
      return <ErrorState message={state.message} onRetry={load} />;
    case "partial":
      return <DataList data={state.data} allowNulls />;
    case "optimistic":
      return <DataList data={state.data} optimistic />;
    case "success":
      return <DataList data={state.data} />;
  }
}

/* Sub-komponen skeleton — match layout final, bukan spinner */
function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border border-border-subtle bg-surface-elevated p-10">
      <div className="h-4 w-1/3 rounded-sm bg-surface-sunken" />
      <div className="h-8 w-2/3 rounded-sm bg-surface-sunken" />
      <div className="h-4 w-full rounded-sm bg-surface-sunken" />
    </div>
  );
}
```

**Varian lebih aman — pakai URL, bukan function (recommended untuk pemula):**

```tsx
type DataCardByUrlProps<T> = {
  url: string;
};

export function DataCardByUrl<T>({ url }: DataCardByUrlProps<T>) {
  const [state, dispatch] = useReducer(reducer<T>, { status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T[]>;
      })
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err: unknown) => {
        if ((err as Error)?.name !== "AbortError") {
          dispatch({
            type: "FETCH_ERROR",
            message: (err as Error)?.message ?? "Gagal memuat data.",
          });
        }
      });

    return () => controller.abort();
  }, [url]);

  // Render block IDENTIK dengan DataCard di atas —
  // copy-paste switch statement yang sama persis.
}
```

**Aturan implementasi:**

- Setiap komponen data yang fetch dari server **WAJIB** mengikuti pola ini.
- Skeleton **match layout final** (tinggi/lebar sama), bukan bundar.
- Empty state **tidak** pakai warna `--color-state-danger`.
- Error state **wajib** sediakan `retry` yang benar-benar memicu fetch ulang.
- Optimistic state **wajib** sediakan `rollback`.
- **Jangan** simpan fungsi di dalam state reducer (menyebabkan referential instability & re-render). Simpan hanya data; handler (`retry`, `rollback`) didefinisikan di komponen via `useCallback`.
- **Gunakan request-ID pattern** atau `AbortController` untuk mencegah race condition saat user spam-retry.

### Section 13 — Forms

- Label **DI ATAS** input (`gap-2`).
- Helper text opsional, error text **DI BAWAH** input.
- Font input **≥ 16px**.
- Touch target **≥ 44×44px**.
- State loading/error inline, bukan browser default.

---

## PART 5 — MOBILE-FIRST DEPTH

### Section 14 — 12 Aturan Mobile Wajib

1. Touch target min **44×44px**. Ikon sosial min 40×40.
2. Font input min **16px** (cegah iOS auto-zoom).
3. Safe area iOS: `pb-[calc(1.5rem+env(safe-area-inset-bottom))]`.
4. Sticky CTA di mobile (bottom, fixed). Desktop: inline.
5. **Swipe gesture untuk galeri:** `drag="x"` Framer Motion, snap. Jangan scroll horizontal biasa.
6. **Tidak ada info yang hanya tampil saat hover.** Semua harus tap-accessible.
7. **Reduce backdrop-blur di mobile: max 1 layer.** Lebih dari itu → lag.
8. Matikan parallax tilt di mobile: `window.matchMedia('(pointer: fine)')`.
9. Matikan hover scale di mobile.
10. **Menu mobile:** bottom sheet ATAU fullscreen overlay, BUKAN dropdown.
11. **Font hero di mobile:** min **2.5rem** (lihat Section 5 — nilai minimum sudah ditetapkan di `--text-display`).
12. **Section spacing di mobile:** 60% dari desktop (desktop 96px → mobile 64px).

**Mobile override untuk DESIGN_VARIANCE 4–10:** asymmetric layout di atas `md:` WAJIB fallback ke single-column (`w-full px-4 py-8`) di viewport < 768px.

---

## PART 6 — CONTENT

### Section 15 — Editorial Tone

Copywriting = editorial, tenang, konkret. Setiap kata harus berfungsi.

**Pola Buruk → Baik:**

| Buruk                                      | Baik                                           |
| ------------------------------------------ | ---------------------------------------------- |
| "Experience the ultimate driving machine." | "V6. 480 hp. 5 detik dari 0 ke 100."           |
| "We're passionate about cars."             | "142 titik inspeksi. Setiap unit."             |
| "Unleash your potential on the road."      | "Siap dibawa pulang minggu ini."               |
| "Luxury redefined."                        | "Bentley Continental GT. 2024. 8.750.000.000." |
| "Seamless ownership experience."           | "Servis gratis 3 tahun. Antar jemput."         |

**Aturan:**

- Subject-verb-object. Hindari passive voice.
- Angka konkret > kata sifat.
- **10 kata terlarang:** Elevate, Seamless, Unleash, Next-Gen, Revolutionize, Empower, Transform, Redefine, Curated, Bespoke.
- Kalimat max 20 kata. Paragraf max 3 kalimat.
- Title case untuk heading (bukan ALL CAPS).
- Bahasa Indonesia untuk konten lokal. Bahasa Inggris untuk term teknis.

---

## PART 7 — PERFORMANCE & ACCESSIBILITY

### Section 16 — Performance Budget & Guardrails

**Core Web Vitals (mobile, 4G):**

- LCP < 1.5s
- CLS < 0.05
- INP < 150ms
- TTFB < 500ms

**Asset Budget:**

- JS bundle (first load): < 150 KB gzip
- CSS bundle: < 30 KB gzip
- Fonts (2 weights × 2 family): < 80 KB total
- Images (5–8 per halaman): < 1.2 MB total
- Video: < 3 MB per file

**Image Optimization (Next.js 16):**

- **WAJIB** pakai `next/image`, **JANGAN** `<img>` biasa.

```tsx
import Image from "next/image";

<Image
  src="/path/to/image.jpg"
  alt="Deskripsi spesifik"
  width={800}
  height={600}
  priority={isLCPImage} // true HANYA untuk hero image LCP
  sizes="(max-width: 768px) 100vw, 50vw"
  className="..."
/>;
```

- Set `priority` **hanya** untuk 1 image LCP per halaman.
- Selalu isi `sizes` prop untuk layout responsif.
- Selalu isi `width` & `height` (atau `fill`) untuk cegah CLS.

**Font Optimization (verified Geist v1.7.2):**

- **WAJIB** pakai `next/font` + package `geist`, **JANGAN** `@import` Google Fonts via CSS, **JANGAN** `<link>` manual.

```tsx
// app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${GeistSans.className} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Animation Budget:**

- Max **3 perpetual animation per halaman**.
- **Max 2 _simultaneous perpetual_ spring saat scroll.** Catatan: orchestrated stagger (`staggerChildren`) dihitung sebagai **satu** orchestration, bukan N springs. Yang dihitung adalah **loop infinite** yang berjalan bersamaan.
- No `backdrop-filter` di scrolling container.
- No `filter blur` di elemen bergerak.
- `will-change: transform` **HANYA** saat hover/aktif, hapus setelah idle.

**DOM Cost:**

- Grain/noise **HANYA** di `fixed inset-0 z-0 pointer-events-none`. **JANGAN** di scrolling container.

**Hardware Acceleration:**

- Jangan animasi `top/left/width/height`. Hanya `transform` & `opacity`.

**Z-Index Restraint:**

- Jangan spam `z-50`/`z-10`. Gunakan untuk Sticky Navbar, Modals, Overlays.

**Audit:** Lighthouse, Web Vitals extension, DevTools Performance tab.

### Section 16.5 — Accessibility (Non-Negotiable)

Ini **bukan** opsional. Semua output **WAJIB** memenuhi ini:

**Focus States**

- Semua elemen interaktif **WAJIB** punya focus ring visible: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`.
- **JANGAN** hapus outline default tanpa pengganti.
- Urutan tab mengikuti hierarki visual.

**Semantic HTML**

- Gunakan elemen semantik: `<button>` untuk aksi, `<a>` untuk navigasi. **JANGAN** `<div onClick>`.
- Heading hierarki berurutan (`h1 → h2 → h3`), jangan skip.
- Landmark: `<nav>`, `<main>`, `<aside>`, `<footer>`.

**Skip-to-Content Link**

**Definisi "halaman panjang":** halaman dengan `scrollHeight > 3× viewportHeight`, **atau** halaman dengan navigasi utama yang **tidak** sticky.

Letakkan sebagai elemen **pertama** di `<body>`:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-surface-inverse focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-inverse focus:outline-none focus:ring-2 focus:ring-accent"
>
  Lewati ke konten utama
</a>

<main id="main-content" tabIndex={-1} className="...">
  {/* konten */}
</main>
```

Syarat teknis:

- `<main>` **WAJIB** punya `id="main-content"` (atau nama lain yang match dengan `href`).
- `<main>` **WAJIB** punya `tabIndex={-1}` agar bisa di-fokus setelah skip.
- Link **default hidden** (`sr-only`), hanya muncul saat di-fokus via keyboard (`focus:not-sr-only`).

**ARIA & Alt**

- Semua gambar **WAJIB** punya `alt` deskriptif. `alt=""` hanya untuk gambar dekoratif (dengan `aria-hidden="true"`).
- Ikon-only button **WAJIB** punya `aria-label`.
- Live region (`aria-live="polite"`) untuk toast/notification.
- Form error **WAJIB** terhubung via `aria-describedby` ke input.

**Contrast**

- Body text: min **4.5:1** (WCAG AA).
- Large text (≥ 18.66px bold / ≥ 24px normal): min **3:1**.
- Interactive elements (border, icon): min **3:1**.
- Verifikasi dengan Chrome DevTools → Inspect → Contrast.

**Motion**

- Hormati `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Perpetual animation **WAJIB** dinonaktifkan saat `prefers-reduced-motion: reduce`.

**Keyboard Navigation**

- Semua fungsi dapat diakses via keyboard.
- Modal/sheet: focus trap + `Escape` untuk close.

---

## PART 8 — ANTI-GENERIC

### Section 17 — AI Tells (Forbidden Patterns)

**Visual & CSS:**

- **NO Neon/Outer Glows.** Definisi: `box-shadow` atau `filter: drop-shadow` pada elemen itu sendiri. **DILARANG.** Ambient Layer (Section 7C) **BUKAN** outer glow — itu gradient background di pseudo-element terpisah.
- **NO Pure Black** (`#000000`). Pakai Off-Black/Zinc-950/Charcoal.
- **NO Oversaturated Accents.** Desaturate (< 80%).
- **NO Excessive Gradient Text.**
- **NO Custom Mouse Cursors.**
- **NO 3-Column Card Layouts** (3 kolom sama rata). Bento asymmetric grid DIIZINKAN.

**Typography:**

- **NO Inter.**
- **NO Oversized H1s.**
- **NO Serif untuk Dashboard.**

**Content:**

- **NO "John Doe" / "Sarah Chan" / "Jack Su".**
- **NO** generic avatars (egg/SVG user icon). Pakai placeholder yang realistis atau styling spesifik.
- **NO** fake numbers (99.99%, 50%, 1234567). Pakai organic messy data (47.2%, +1 (312) 847-1928).
- **NO** startup slop names: "Acme", "Nexus", "SmartFlow".
- **NO** filler words: "Elevate", "Seamless", "Unleash", "Next-Gen".
- **NO** "Lorem ipsum" di commit final.
- **NO** "business people shaking hands" photos.
- **NO** Google Maps default style. Pakai grayscale minimal + pin custom.
- **NO** cookie banner default template.

**UI Patterns:**

- **NO** "Loading..." spinner bundar.
- **NO** pagination "1 2 3 4 Next" untuk > 20 item. Pakai infinite scroll / "Load more".
- **NO** cookie consent dengan 2 tombol sama besar. Satu Accept, satu link Settings.
- **NO** newsletter popup saat page load. Hanya setelah 30s + scroll 50%.
- **NO** chatbot bubble avatar robot default.
- **NO** "Back to top" arrow (kecuali halaman > 5000px).

**Micro-detail:**

- Border `1px solid zinc-200` → pakai hex-alpha dengan opacity.
- "..." loading text di tombol → morph jadi progress bar / dot pulse.
- Hover effect hanya warna → tambah `scale 1.02` + `translate-y -1px`.

**External Resources:**

- **NO Unsplash.** Pakai `https://picsum.photos/seed/{random_string}/800/600` atau SVG UI Avatars.
- **shadcn/ui:** Jika di masa depan menambah, **JANGAN** pakai default state. Kustomisasi radii, colors, shadows.

### Section 18 — Extended Anti-Generic Checklist

- Halaman "About Us" dengan "Our Mission" generik → ganti cerita spesifik.
- Testimoni nama palsu + foto stok senyum → hapus atau ganti review spesifik.
- Rating 5 bintang tanpa sumber → cantumkan platform (Google Review, 4.9 dari 127 ulasan).
- Icon 24×24 stroke 1px di semua tempat → variasi 1.5 utility, 2.0 display.

### Section 19 — Creative Arsenal (Decision Guide)

**Gunakan saat sesuai.** Default Framer Motion untuk UI/Bento. GSAP/ThreeJS hanya untuk isolated full-page scrolltelling/canvas.

**Decision guide — kapan pakai apa:**

| Kebutuhan                 | Pattern yang disarankan                |
| ------------------------- | -------------------------------------- |
| Fokus produk tunggal      | Spotlight Border + Zoom Parallax       |
| Katalog > 20 item         | Drag-to-Pan Grid + Infinite Scroll     |
| Brand statement / hero    | Kinetic Marquee + Text Mask Reveal     |
| Dashboard analytics       | Bento Grid + Chroma Grid               |
| Dashboard live            | Sticky Scroll Stack + Live Status Card |
| Cerita berurutan (brand)  | Curtain Reveal + Split Screen Scroll   |
| Galeri visual / portfolio | Masonry + Hover Image Trail            |
| Coverflow / showcase      | Coverflow Carousel atau Dome Gallery   |
| Navigasi utama kompleks   | Mega Menu Reveal                       |
| Toolbar melayang / FAB    | Dynamic Island + Floating Speed Dial   |
| Form / konversi           | Magnetic Button + Ripple Click         |
| Loading halus             | Skeleton Shimmer                       |

**Katalog lengkap:**

- **Hero:** Asymmetric (text left/right, bg image with subtle fade).
- **Navigation:** Mac OS Dock Magnification, Magnetic Button, Gooey Menu, Dynamic Island, Contextual Radial Menu, Floating Speed Dial, Mega Menu Reveal.
- **Layout:** Bento Grid, Masonry, Chroma Grid, Split Screen Scroll, Curtain Reveal.
- **Cards:** Parallax Tilt, Spotlight Border, Glassmorphism, Holographic Foil, Tinder Swipe Stack, Morphing Modal.
- **Scroll:** Sticky Scroll Stack, Horizontal Scroll Hijack, Locomotive Scroll Sequence, Zoom Parallax, Scroll Progress Path, Liquid Swipe Transition.
- **Galleries:** Dome Gallery, Coverflow Carousel, Drag-to-Pan Grid, Accordion Image Slider, Hover Image Trail, Glitch Effect.
- **Typography:** Kinetic Marquee, Text Mask Reveal, Text Scramble, Circular Text Path, Gradient Stroke Animation, Kinetic Typography Grid.
- **Micro:** Particle Explosion Button, Liquid Pull-to-Refresh, Skeleton Shimmer, Directional Hover Aware Button, Ripple Click, Animated SVG Line Drawing, Mesh Gradient Background, Lens Blur Depth.

---

## PART 9 — PRE-FLIGHT

### Section 20 — Final Pre-Flight Check (Unified, 30 Item)

Jawab **semua** sebelum commit. Ada yang "tidak"? Perbaiki dulu.

**Struktur & Tipografi**

1. Hero pakai `clamp()` (min 2.5rem) dan tidak centered di layar > 768px?
2. Warna diambil dari `@theme` tokens (utility `bg-surface-*`), bukan hex mentah?
3. Display pakai `font-semibold`/`font-medium`, bukan `font-black`?
4. Font stack bebas Inter; Serif tidak dipakai di dashboard?

**Warna & Depth**

5. Accent color hanya satu, saturasi < 80%, bebas Lila/neon?
6. Shadow level ≤ 2 per halaman, dan tinted ke background hue?
7. Grain/vignette hanya di hero, bukan di scrolling container?

**Motion**

8. Setiap perpetual animation interval ≥ 2s?
9. Exit animation lebih cepat dari enter (60%)?
10. Spring physics dari `SPRING` map (bukan hardcode)? `useMotionValue` untuk magnetic hover?
11. Perpetual animation diisolasi di Client Component + `React.memo`?
12. Orchestrated stagger (bukan N simultan) dihitung sebagai satu unit motion?

**Mobile**

13. Touch target min 44×44px di semua tombol mobile?
14. Font input min 16px di mobile?
15. Ada swipe gesture (`drag="x"` + snap) untuk galeri mobile?
16. Menu mobile: bottom sheet / fullscreen overlay?
17. Font hero di mobile ≥ 2.5rem?
18. `min-h-[100dvh]` (bukan `h-screen`) untuk full-height?

**State & Form**

19. Setiap komponen data punya 7 state (idle/loading/success/empty/error/partial/optimistic)?
20. Loading pakai skeleton (bukan spinner bundar)? Empty state bukan merah?
21. Retry pakai request-ID / AbortController (anti race-condition)?
22. `fetcher` di-memoize di parent, atau pakai `DataCardByUrl` (anti infinite loop)?

**Konten**

23. Copywriting bebas 10 kata terlarang? Angka konkret (bukan "berkualitas")?

**Performance**

24. Image pakai `next/image` dengan `sizes` + `priority` untuk LCP?
25. Font pakai `geist/font/sans` + `geist/font/mono` (bukan import path salah)?
26. JS bundle < 150KB gzip? Backdrop-filter max 1 layer per halaman?
27. Lighthouse Performance ≥ 90 di mobile?

**Accessibility**

28. Focus ring visible di semua interaktif? Tidak ada outline yang dihapus?
29. Skip-to-content ada di halaman `scrollHeight > 3× viewport`? `<main>` punya `id="main-content"` + `tabIndex={-1}`?
30. Semua gambar punya `alt`; ikon-only button punya `aria-label`? Kontras ≥ 4.5:1 / 3:1? `prefers-reduced-motion` dihormati? Lighthouse Accessibility ≥ 95?

---

**END OF DOCUMENT**
