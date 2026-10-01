// Preset nama warna otomotif mewah + kode hex-nya. Murni data statis —
// TANPA library, TANPA API/AI. Dipakai sebagai suggestion chips di form
// mobil: klik chip → nama DAN hex langsung terisi.
//
// exterior = warna cat bodi (tabel car_colors).
// interior = nama material kulit/kayu.

export interface ColorPreset {
  name: string;
  hex: string;
}

// Warna cat bodi — konteks pasar Indonesia (istilah yang umum di dealer:
// Silver, Dongker, Marun, Champagne). Nama brand-spesifik (Obsidian Black,
// Isle of Man Green) tetap boleh diinput manual, hanya tidak masuk preset.
export const EXTERIOR_COLOR_PRESETS: ColorPreset[] = [
  { name: "Hitam", hex: "#0A0A0A" },
  { name: "Hitam Metalik", hex: "#1C1C1C" },
  { name: "Putih", hex: "#F5F5F0" },
  { name: "Putih Mutiara", hex: "#EDE8DC" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Abu-abu", hex: "#6B6B6B" },
  { name: "Abu-abu Tua", hex: "#3F3F3F" },
  { name: "Merah", hex: "#B91C1C" },
  { name: "Merah Marun", hex: "#7F1D1D" },
  { name: "Biru", hex: "#1E3A8A" },
  { name: "Biru Dongker", hex: "#1E293B" },
  { name: "Hijau", hex: "#14532D" },
  { name: "Hijau Botol", hex: "#3F4A2F" },
  { name: "Coklat", hex: "#78350F" },
  { name: "Coklat Tua", hex: "#4A2E1E" },
  { name: "Emas Champagne", hex: "#C9A961" },
  { name: "Krem", hex: "#E8DFC8" },
];

// Nama material interior — kombinasi umum di pasar Indonesia (kulit & kayu).
export const INTERIOR_COLOR_PRESETS: ColorPreset[] = [
  { name: "Kulit Hitam", hex: "#0F0F0F" },
  { name: "Kulit Coklat", hex: "#5C3A21" },
  { name: "Kulit Krem", hex: "#D4C5A0" },
  { name: "Kulit Beige", hex: "#C8B693" },
  { name: "Kulit Merah Bordeaux", hex: "#6B1F2A" },
  { name: "Kulit Abu-abu", hex: "#4A4A4A" },
  { name: "Kulit Tan", hex: "#B8875C" },
  { name: "Kayu Jati", hex: "#4A2E1E" },
  { name: "Kayu Walnut", hex: "#3B2418" },
  { name: "Kulit-Kayu Kombinasi", hex: "#5C3D2E" },
  { name: "Suede Hitam", hex: "#1A1A1A" },
  { name: "Alcantara Abu", hex: "#555555" },
];

// Filter suggestion berdasarkan input user (case-insensitive). Kosong =
// tampilkan sebagian besar preset (dibatasi limit supaya UI tidak penuh).
export function filterPresets(
  presets: ColorPreset[],
  query: string,
  limit = 6
): ColorPreset[] {
  const q = query.trim().toLowerCase();
  const matched = q
    ? presets.filter((preset) => preset.name.toLowerCase().includes(q))
    : presets;
  return matched.slice(0, limit);
}
