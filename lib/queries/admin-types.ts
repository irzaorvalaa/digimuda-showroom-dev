import type { Database } from "@/types/database";

// Tipe kolom tabel yang dipakai di seluruh query admin.
export type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];
export type CarRow = Database["public"]["Tables"]["cars"]["Row"];
export type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
export type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
export type BrandInsert = Database["public"]["Tables"]["brands"]["Insert"];
export type CarColorRow = Database["public"]["Tables"]["car_colors"]["Row"];
export type CarColorInsert =
  Database["public"]["Tables"]["car_colors"]["Insert"];

// Hasil query seragam: baris data + pesan error.
export type QueryOutcome<T> = {
  rows: T[];
  failure: string | null;
};

// Hasil operasi tulis.
export type WriteOutcome = {
  error: string | null;
};

// Pesan error terpusat (hindari string inline berulang).
export const ERR = {
  stats: "Failed to load inventory stats.",
  inquiryCount: "Failed to load inquiry count.",
  recent: "Failed to load recent inquiries.",
  cars: "Failed to load cars.",
  oneCar: "Failed to load car.",
  colours: "Failed to load colours.",
  saveColours: "Failed to save colours.",
  loadExisting: "Failed to load existing colours.",
  deleteColours: "Failed to delete removed colours.",
  updateColours: "Failed to update colours.",
  insertColours: "Failed to insert colours.",
  createCar: "Failed to create car.",
  updateCar: "Failed to update car.",
  deleteCar: "Failed to delete car.",
  allInquiries: "Failed to load inquiries.",
  updateInquiry: "Failed to update inquiry.",
  brands: "Failed to load brands.",
  oneBrand: "Failed to load brand.",
  createBrand: "Failed to create brand.",
  updateBrand: "Failed to update brand.",
  deleteBrand: "Failed to delete brand.",
} as const;
