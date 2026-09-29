# Progress — Digimuda ShowRoom

**Terakhir update:** 2026-09-29
**Repo:** https://github.com/irzaorvalaa/demo-digimuda-showroom
**Next.js:** 16.3.6 · **Tailwind:** v4 · **Package manager:** npm

---

## 📊 Status Keseluruhan

| Fase                                                           | Status                   |
| -------------------------------------------------------------- | ------------------------ |
| **SETUP INTI (Langkah 1-25)**                                  | ✅ **RAMPUNG**           |
| Langkah 1-10 (env, supabase clients, utils, validators, types) | ✅ Selesai               |
| Langkah 11-16 (config, migrations, seed)                       | ✅ Selesai               |
| Langkah 17-19 (next.config, layout, globals.css)               | ✅ Selesai               |
| Langkah 20 (navbar)                                            | ✅ Selesai               |
| Langkah 21 (hero-section)                                      | ✅ Selesai               |
| Langkah 22 (car-card)                                          | ✅ Selesai               |
| Langkah 23 (lib/queries/cars.ts)                               | ✅ Selesai               |
| Langkah 24 (featured-stock)                                    | ✅ Selesai               |
| Langkah 25 (app/page.tsx — Home)                               | ✅ Selesai               |
| **Batch A (26-29: skeleton, badge, input, footer)**            | ⏳ **SEDANG DIKERJAKAN** |
| Batch B (halaman katalog /cars)                                | ⬜ Belum                 |
| Batch C (halaman detail /cars/[slug])                          | ⬜ Belum                 |
| Batch D (contact + form + inquiries)                           | ⬜ Belum                 |
| Batch E (halaman statis: club, events)                         | ⬜ Belum                 |
| Batch F (floating: social-dock, concierge-button)              | ⬜ Belum                 |
| Batch G (auth admin, opsional)                                 | ⬜ Belum                 |
| Batch H (finalisasi + deploy)                                  | ⬜ Belum                 |

---

## 🎯 Next Step

**Kerjakan sekarang:** Batch A (item 26-29).

1. `components/ui/skeleton.tsx` — Loading skeleton reusable
2. `components/ui/badge.tsx` — Status badge (Available/Sold/Reserved)
3. `components/ui/input.tsx` — Input dengan focus ring emas
4. `components/layout/footer.tsx` — Footer minimalis light mode

**Konteks untuk Pixel Canary / model:**

- `car-card.tsx` sudah punya badge inline — cek apakah perlu diekstrak ke `badge.tsx` atau tetap inline
- `input.tsx` akan dipakai di `contact-form.tsx` (Batch D)
- `skeleton.tsx` akan dipakai di `loading.tsx` (Batch B & C)
- `footer.tsx` belum dipasang di `layout.tsx` — tambahkan setelah selesai
- Palet: cream `#f6f3ed`, white card, zinc-900, amber untuk aksen
- Font mono untuk angka

---

## 📝 File Terakhir Selesai

- `components/sections/featured-stock.tsx` — Bento Grid asimetris 12 kolom (7/5, 5/7)
- `app/page.tsx` — Home (Hero + FeaturedStock), ISR 60 detik

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

7. **Bug format tool call** (kadang menghasilkan `.ts` tanpa `x`) sudah terjadi 3x. Setelah setiap batch, cek `git status` untuk file dengan ekstensi rusak.

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

| Tanggal    | Batch       | Commit  | Catatan                                  |
| ---------- | ----------- | ------- | ---------------------------------------- |
| 2026-09-29 | Setup 1-10  | —       | env, supabase clients, utils, validators |
| 2026-09-29 | Setup 11-16 | —       | migrations 0001-0004 + seed              |
| 2026-09-29 | Setup 17-20 | —       | layout, globals, navbar                  |
| 2026-09-29 | Setup 21-23 | —       | hero, car-card, queries/cars             |
| 2026-09-29 | Setup 24-25 | (belum) | featured-stock + app/page.tsx            |
| 2026-09-29 | Batch A     | (belum) | skeleton, badge, input, footer           |
