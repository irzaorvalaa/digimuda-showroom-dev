# Progress — Digimuda ShowRoom

**Terakhir update:** 2026-09-30
**Repo:** https://github.com/irzaorvalaa/demo-digimuda-showroom
**Next.js:** 16.3.6 · **Tailwind:** v4 · **Package manager:** npm

---

## 📊 Status Keseluruhan

| Fase                                                                                     | Status         |
| ---------------------------------------------------------------------------------------- | -------------- |
| **SETUP INTI (Langkah 1-25)**                                                            | ✅ **RAMPUNG** |
| Langkah 1-10 (env, supabase clients, utils, validators, types)                           | ✅ Selesai     |
| Langkah 11-16 (config, migrations, seed)                                                 | ✅ Selesai     |
| Langkah 17-19 (next.config, layout, globals.css)                                         | ✅ Selesai     |
| Langkah 20 (navbar)                                                                      | ✅ Selesai     |
| Langkah 21 (hero-section)                                                                | ✅ Selesai     |
| Langkah 22 (car-card)                                                                    | ✅ Selesai     |
| Langkah 23 (lib/queries/cars.ts)                                                         | ✅ Selesai     |
| Langkah 24 (featured-stock)                                                              | ✅ Selesai     |
| Langkah 25 (app/page.tsx — Home)                                                         | ✅ Selesai     |
| **Batch A (26-29: skeleton, badge, input, footer)**                                      | ✅ **RAMPUNG** |
| **Batch B (30-34: katalog /cars)**                                                       | ✅ **RAMPUNG** |
| **Batch C (35-39: detail /cars/[slug])**                                                 | ✅ **RAMPUNG** |
| **Enhancement: galeri per-warna (car_colors)**                                           | ✅ **RAMPUNG** |
| **Batch D (40-43: contact + form + inquiries)**                                          | ✅ **RAMPUNG** |
| **Section statis (44-47 AGENTS: process, cta, club, events)**                            | ✅ **RAMPUNG** |
| Batch E (floating: social-dock, concierge-button)                                        | ✅ **RAMPUNG** |
| Batch F (multi language ( english & indonesia), add toggle di navbar (mobile & desktop)) | ⬜ Belum       |
| Batch G (auth admin, with supabase, luxury design)                                       | ✅ **RAMPUNG** |
| Batch H (admin dashboard + crud content cars)                                            | ✅ **RAMPUNG** |
| Batch I (finalisasi + deploy)                                                            | ⬜ Belum       |

---

## 🎯 Next Step

**Selesai:** Batch H — Admin Dashboard + CRUD + 2 Roles.

- `supabase/migrations/0007_admin_roles.sql` — kolom `admins.role` (`super_admin` / `admin`) + fungsi `current_admin_role()` & `is_super_admin()` (security definer). Policy UPDATE/DELETE untuk cars, brands, car_colors, inquiries, dan storage dipecah: sekarang hanya `is_super_admin()`. INSERT tetap `is_admin()` (semua role boleh create). Admin existing di-staging di-promote ke `super_admin` saat migrasi.
- `types/database.ts` — tambah kolom `role` + 2 fungsi baru (sesuai hasil `supabase gen types`).
- `supabase/seed.sql` — admin lokal di-seed sebagai `super_admin`.
- `lib/queries/admin.ts` — `getSession()` kembali membaca role via RPC; guard baru `requireSuperAdmin()`; query CRUD: `getAdminCars`, `getAdminCarById`, `createCar`, `updateCar`, `deleteCar`, `getInquiries`, `updateInquiryStatus`, `deleteInquiry`, `getBrandsWithCounts`, `createBrand`, `updateBrand`, `deleteBrand`.
- `lib/admin/constants.ts` — `ADMIN_NAV_ITEMS` + `AdminRole` dipindah ke file client-safe (tanpa `next/headers`) supaya `admin-nav.tsx` tidak menarik server client ke browser bundle (build error Turbopack).
- `lib/validators.ts` — `carSchema` (cermin constraint tabel cars), `brandSchema`, `inquiryStatusSchema`.
- Server Actions: `app/admin/cars/actions.ts`, `app/admin/inquiries/actions.ts`, `app/admin/brands/actions.ts` — semua validasi zod + `requireSuperAdmin()` + `revalidatePath` (admin + halaman publik).
- Komponen: `components/layout/admin-nav.tsx` (pill gelap + layoutId + badge role), `components/sections/car-form.tsx` (3 kelompok field), `components/sections/brand-form.tsx`, `components/sections/inquiry-status-form.tsx` (inline), `components/ui/delete-button.tsx` (konfirmasi inline).
- Halaman: `/admin` (dashboard + link inquiries), `/admin/cars` (list divide-y + thumbnail), `/admin/cars/new`, `/admin/cars/[id]/edit`, `/admin/inquiries`, `/admin/brands`, `/admin/brands/[id]/edit`.
- `app/admin/layout.tsx` — `requireAdmin()` dipindah ke layout (guard sekali untuk semua rute /admin) + `AdminNav` dengan role.

**Verifikasi:** `tsc --noEmit` exit 0 · `eslint` exit 0 · `next build` exit 0
Route admin semuanya dynamic (ƒ): `/admin`, `/admin/cars`, `/admin/cars/new`, `/admin/cars/[id]/edit`, `/admin/inquiries`, `/admin/brands`, `/admin/brands/[id]/edit`

**Hero variants: 3 varian + switcher — selesai.**

- `components/sections/hero/` — pecah hero jadi 3 varian + switcher pitching:
  - `hero-split.tsx` — varian default (dipindah dari `hero-section.tsx` lama), fluid typography `clamp(2.5rem,6vw,6rem)`, grain overlay, stagger lebih halus.
  - `hero-image.tsx` — editorial parallax (7/5 asimetris), parallax hanya saat `pointer: fine` + motion normal.
  - `hero-video.tsx` — cinematic fullscreen video, poster fallback untuk mobile (< 768px), slow network, dan `prefers-reduced-motion`; mute toggle; scroll indicator.
  - `hero-switcher.tsx` — Client Component, baca `?hero=video|image|split` (via `useSearchParams`) lalu fallback ke `NEXT_PUBLIC_HERO_VARIANT` (default `split`); varian tak valid → `split`.
  - `index.ts` — export + `getHeroVariant()`.
- `app/(public)/page.tsx` — import diganti ke `HeroSwitcher`; `components/sections/hero-section.tsx` lama dihapus.
- `.env.local` + `.env.example` — tambah `NEXT_PUBLIC_HERO_VARIANT=split`.
- `public/videos/` — `.gitkeep` + `README.md` (spesifikasi media). Placeholder `hero-car.mp4` & `hero-poster.jpg` menyusul.

**Verifikasi:** `tsc --noEmit` exit 0 · `eslint` exit 0 · `next build` exit 0 (lihat Next Step di bawah).

**Berikutnya:** Batch F — multi-language (EN + ID) + toggle navbar, atau Batch I — finalisasi + deploy.

---

**Selesai (lama):** Redesign "Art Gallery Mode" (harga → "Ask Us", bento grid, motion).

- `supabase/migrations/0006_set_all_prices_null.sql` — `update cars set price_idr = null` (semua harga "Ask Us")
- `components/ui/car-card.tsx` — hapus angka harga → baris "PRICE / Ask Us" (text-amber-700), tetap pakai spotlight + foil + tilt (MotionValue, tanpa re-render)
- `components/sections/featured-stock.tsx` — Bento Grid 3 kolom x 2 baris: kartu pertama jadi hero 2x2 (aspect-video), sisanya 1x1
- `components/ui/car-results.tsx` — grid katalog jadi 12 kolom asimetris (pola 7/5, 5/7), AnimatePresence + layout animation dipertahankan
- Status pulse (`animate-pulse` emerald di available) + spotlight + tilt sudah ada, tanpa perubahan tambahan

**Verifikasi:** `tsc --noEmit` exit 0 · `next build` exit 0
Route: `/` static (revalidate 1m) · `/cars` & `/cars/[slug]` dynamic · `/contact` dynamic · `/club` & `/events` static

**Berikutnya:** Batch F — multi-language (EN + ID) + toggle navbar.

---

**Selesai (lama):** Batch E — komponen floating.

- `components/floating/social-dock.tsx` — 3 tombol circular (Instagram, Facebook, TikTok), stack vertikal, selalu tampil (tanpa toggle)
- `components/floating/concierge-button.tsx` — pill gradient emas + shine overlay, `Sparkle` icon, link WhatsApp
- `app/layout.tsx` — kedua komponen dibungkus satu wrapper `fixed bottom-6 right-6 z-40` (dock di atas, concierge di bawah)
- Icon dari `@phosphor-icons/react/dist/ssr` (BUKAN emoji), `aria-label` di semua tombol, `React.memo` pada keduanya

**Berikutnya:** Batch F — multi-language (EN + ID) + toggle navbar.

---

**Konteks untuk Batch F dan Batch H**

## BATCH F — Multi-language + Button Toggle

- Tujuan: website bisa tampil 2 bahasa (rencana: **Inggris + Indonesia**), dengan tombol toggle di navbar.

- Library: pakai yang **simple dari React saja**, bukan lib berat. Kandidat realistis tanpa dependensi eksternal:

  - **React Context + `useState`** untuk menyimpan locale aktif (mis. `"en"` / `"id"`), plus file kamus JSON/TS statis (`lib/i18n/dictionaries/`).
  - Ini murni React, tidak menambah package baru, cocok dengan aturan "JANGAN pakai library di luar daftar tanpa konfirmasi".

- Konsekuensi teknis yang perlu Anda putuskan nanti (belum sekarang):

  - **Routing**: pakai `[locale]` segment di App Router (`/en/...`, `/id/...`) ATAU locale disimpan di Context + cookie saja tanpa ubah URL. Yang Context+cookie paling sederhana; yang `[locale]` lebih SEO-friendly tapi menyentuh hampir semua route.
  - Teks UI (headline, CTA, label) sekarang Inggris → nanti jadi dikelola lewat kamus.
  - `generateMetadata` juga perlu versi per-bahasa.

- Catatan: aturan "UI copy Bahasa Inggris" dari AGENTS.md akan **di-override** oleh kebutuhan multi-language ini (dengan persetujuan Anda).

## BATCH H — Admin Dashboard + 2 Roles

- Fokus: login (Supabase Auth) + CRUD data mobil/brand/inquiry, plus **role-based access**.

- **2 role:**

  - `super_admin` → **CREATE + READ + UPDATE + DELETE** (kelola penuh).
  - `admin` → **CREATE + READ saja** (input data + lihat data, TANPA edit & hapus).

- Dampak ke skema database (bukan sekarang, hanya catatan): tabel `admins` yang sekarang cuma `user_id` perlu **kolom `role`** (`text check (role in ('super_admin','admin'))`), lalu fungsi `is_admin()` di RLS dipecah jadi mis. `is_admin()` (boleh insert/read) dan `is_super_admin()` (boleh update/delete). Policy RLS tiap tabel disesuaikan.

- Enforce role **WAJIB di level RLS Supabase** (bukan hanya UI), supaya `admin` biasa tidak bisa edit/hapus walau memanggil API langsung.

- Area admin tetap di belakang auth; halaman publik tidak kena middleware (sesuai aturan matcher `/admin`, `/auth`).

## Yang saya catat sebagai konsekuensi

- Update PROGRESS.md line 29-32 (Batch F multi-language, Batch G auth admin, Batch H admin dashboard + roles) **Anda simpan sendiri** — saya tidak mengeditnya kecuali Anda minta.
- Batch D (contact) masih `NEXT`; Batch F & H dieksekusi belakangan sesuai urutan yang Anda perintahkan.
- Belum ada keputusan final soal: **bahasa apa** (EN+ID?), **routing multi-language** (`[locale]` vs Context+cookie), dan detail struktur role. Itu bisa kita bahas saat batch-nya dikerjakan.

---

## 📝 File Terakhir Selesai

**Perbaikan hasil re-audit (Batch D):**

- `app/contact/loading.tsx` + `app/contact/error.tsx` — aturan #8: route yang fetch Supabase wajib punya keduanya (`/contact` memanggil `getCarBySlug` saat ada `?car=`).
- `app/layout.tsx` — tambah `metadataBase: new URL("https://digimuda-showroom.com")` → warning Open Graph hilang, URL share jadi absolut.
- `components/sections/cta-section.tsx` — teks kecil `text-zinc-500` → `text-zinc-400` di panel gelap (kontras 4.0:1 → 6.3:1, target A11y ≥ 95).

**Temuan penting — hydration mismatch di `/cars` (catatan lama user):**

- Penyebabnya BUKAN StaggerGrid/Framer Motion. Atribut yang beda adalah `bis_skin_checked="1"` dan `bis_register="..."` → disuntikkan **browser extension BitBrowser** ke DOM sebelum React hydration. React sendiri menyebut kemungkinan "browser extension installed which messes with the HTML".
- `stagger-grid.tsx` sudah benar (pakai `useSyncExternalStore`, `initial={false}`) → tidak ada inline opacity di HTML server.
- **Cara memastikan:** buka `http://localhost:3000/cars` di jendela Incognito (extension nonaktif) atau browser bersih. Jika warning hilang, isu selesai — tidak perlu ubah kode.

---

**Batch D (40-43) — Contact & inquiry:**

- `lib/queries/inquiries.ts` — `createInquiry()` → `{ data, error }`, type-safe dari `Database`
- `app/contact/actions.ts` — Server Action `submitInquiry(prevState, formData)`, honeypot `website`, zod re-validate
- `components/sections/contact-form.tsx` — Client Component, `useActionState` (React 19), honeypot + success/error state
- `app/contact/page.tsx` — Server Component, metadata, split asimetris 5/7, resolve `?car=[slug]` → `car_id`
- `lib/validators.ts` — `inquirySchema` + field `car_id` (uuid nullish)

**Section statis (44-47 AGENTS):**

- `components/sections/process-section.tsx` — "How It Works" 4 langkah, baris `divide-y` (anti 3-kolom), stagger
- `components/sections/cta-section.tsx` — panel `bg-zinc-900` + inner border `border-white/10`, tombol emas
- `app/club/page.tsx` — Digimuda Club, tier asimetris 7/5, benefit `divide-y`, angka organik (38/40, 6.4 days)
- `app/events/page.tsx` — listing event, tanggal `font-mono`, status pill (emerald/amber/zinc)
- `app/page.tsx` — Home dirangkai: Hero → FeaturedStock → ProcessSection → CtaSection

**Verifikasi Batch D + section statis:** `tsc --noEmit` exit 0 · `eslint` exit 0 · `next build` exit 0
Route: `/` static (revalidate 1m) · `/club` static · `/events` static · `/contact` dynamic (searchParams)

---

**Batch B (30-34):**

- `app/cars/page.tsx` — Katalog (Server), filter via `searchParams`, metadata, grid 2 kolom + stagger
- `app/cars/loading.tsx` — Skeleton grid katalog
- `app/cars/error.tsx` — Error boundary (Client) + tombol retry
- `components/ui/car-filter.tsx` — Filter status (Client, layoutId pill, tactile)
- `components/ui/empty-state.tsx` — Empty state reusable
- `components/sections/featured-stock.tsx` — refactor pakai `EmptyState`

**Enhancement sebelumnya:**

- `components/ui/button.tsx` — Button + ButtonLink (magnetic + tactile, dari struktur AGENTS)
- `components/ui/stagger-grid.tsx` — Stagger WAJIB (parent+child satu client tree)
- `lib/queries/cars.ts` — ubah ke `{ data, error }` + `getAvailableCount()`
- `components/sections/hero-section.tsx` — ButtonLink, angka organik (count DB + 142)
- `components/sections/featured-stock.tsx` — StaggerGrid + error state, tanpa priority
- `components/layout/navbar.tsx` — liquid glass, aria-current, layoutId pill, ButtonLink
- `components/ui/badge.tsx` — variant solid/overlay (liquid glass di overlay)
- `components/ui/car-card.tsx` — variant overlay, p-8, h-full
- `components/layout/footer.tsx` — amber-800 di cream, tactile
- `app/globals.css` — prefers-reduced-motion guard
- `components/ui/skeleton.tsx` — Skeleton **shimmer** (transform-based, 60fps)
- `components/ui/badge.tsx` — Badge status + **liquid glass** (inner border + inner highlight)
- `components/ui/input.tsx` — Input + label/helper/error, focus ring emas
- `components/layout/footer.tsx` — Footer minimalis + tactile, dipasang di root layout
- `app/globals.css` — utility `shadow-diffusion` + `shimmer`
- (sebelumnya) `components/sections/featured-stock.tsx` — Bento Grid asimetris 12 kolom (7/5, 5/7)
- (sebelumnya) `app/page.tsx` — Home (Hero + FeaturedStock), ISR 60 detik

**Commit terakhir:** (isi setelah commit berikutnya)

**Saran commit untuk langkah 24-25:**

---

## ⚠️ Catatan Penting

1. **`types/car.ts` masih manual.** Setelah `types/database.ts` di-generate via `npx supabase gen types typescript --local > types/database.ts`, refactor jadi turunan dari `Database`. Jangan lupa.

2. **Navbar link hilang di mobile** (< md). Perlu solusi hamburger atau bottom nav. Masukkan ke Batch F.

3. **Supabase lokal** jalan di `http://127.0.0.1:54321`. Cek `npx supabase status` kalau lupa anon key.

4. **Turbopack + Geist font** sudah teratasi. Build exit 0. Jangan install ulang Geist via npm.

5. **`framer-motion@13.4.4`** valid. Jangan migrasi kecuali ada masalah.

6. **`.env.local` tidak boleh ter-commit.** Cek `git ls-files | grep env` kalau ragu.

7. **Bug format tool call** (menghasilkan `.ts` tanpa `x`, atau file tanpa ekstensi) **sudah terjadi 5x** — termasuk `app/club` tersimpan sebagai _file_, bukan folder. Penyebab: editor VS Code tertutup saat `write_to_file`. **Solusi:** `mv` ke nama benar, atau tulis via heredoc `cat > path << 'EOF'`. Setelah setiap batch, SELALU cek `git status` untuk ekstensi rusak.

8. **Pixel Canary sempat error** (`stealth model could not complete the request`). Solusi: ganti model ke DeepSeek V4 Flash / Pro di dropdown Cline, lalu lanjutkan dari sesi yang sama.

---

## 🐛 Blocker / Bug Terbuka

- (kosong)

---

## 🔄 Cara Lanjut di Chat Baru

Kirim ke model (Cline / DeepSeek):

> Baca AGENTS.md dan PROGRESS.md.
> Lanjut dari "Next Step" di PROGRESS.md.
> Kerjakan HANYA 1 batch, jangan lompat.

---

## 📅 Riwayat Batch

| Tanggal    | Batch         | Commit  | Catatan                                              |
| ---------- | ------------- | ------- | ---------------------------------------------------- |
| 2026-09-29 | Setup 1-10    | —       | env, supabase clients, utils, validators             |
| 2026-09-29 | Setup 11-16   | —       | migrations 0001-0004 + seed                          |
| 2026-09-29 | Setup 17-20   | —       | layout, globals, navbar                              |
| 2026-09-29 | Setup 21-23   | —       | hero, car-card, queries/cars                         |
| 2026-09-29 | Setup 24-25   | (belum) | featured-stock + app/page.tsx                        |
| 2026-09-29 | Batch A       | (belum) | skeleton, badge, input, footer + dipasang            |
| 2026-09-29 | Batch D       | (belum) | contact form + Server Action + inquiries             |
| 2026-09-29 | Section 44-47 | (belum) | process, cta, club, events + home dirangkai          |
| 2026-09-30 | Batch E       | (belum) | social-dock + concierge-button + dipasang di layout  |
| 2026-09-30 | Batch G       | (belum) | auth admin: login form + callback + proxy guard      |
| 2026-10-01 | Batch H       | (belum) | admin dashboard + CRUD cars/brands/inquiries + roles |
| 2026-10-02 | Hero variants | (belum) | 3 varian hero (split/image/video) + switcher         |
