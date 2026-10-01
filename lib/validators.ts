import { z } from "zod";
import { slugify } from "@/lib/utils";

// Schema form contact (inquiry). Cermin dari check constraint tabel
// inquiries (0001_init.sql): full_name 2-100, whatsapp 8-20, message <= 1000.
export const inquirySchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  whatsapp: z
    .string()
    .trim()
    .min(8, "WhatsApp number must be at least 8 characters")
    .max(20, "WhatsApp number must be at most 20 characters"),
  // Dari FormData, message bisa null/kosong — DB mengizinkan NULL.
  message: z
    .string()
    .trim()
    .max(1000, "Message must be at most 1000 characters")
    .nullish(),
  // UUID mobil yang sedang ditanyakan (opsional, dari halaman detail mobil).
  car_id: z.string().uuid().nullish(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// ============ ADMIN: CARS ============
// Cermin constraint tabel cars (0001_init.sql): year 1900-2100, price >= 0
// (null = "Ask Us"), acceleration numeric(3,1). Field teks opsional dipetakan
// ke null saat kosong supaya DB konsisten (bukan string "").
const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null);

const optionalNumber = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  });

// Warna eksterior (tabel car_colors). Dikirim sebagai array dari form; hex
// wajib format 6 digit. gallery_urls = array URL hasil split textarea.
// Didefinisikan sebelum carSchema karena dipakai di dalamnya.
export const carColorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Colour name must be at least 2 characters")
    .max(60, "Colour name must be at most 60 characters"),
  hex: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a 6-digit hex like #0a3d2c"),
  gallery_urls: z.array(z.string()).default([]),
  is_default: z.boolean().default(false),
});

export type CarColorInput = z.infer<typeof carColorSchema>;

export const carSchema = z
  .object({
    // Slug auto-generate di client (field hidden). Di server tetap opsional:
    // bila kosong/tampered, diturunkan dari name (lihat .transform di bawah).
    slug: z
      .string()
      .trim()
      .max(120, "Slug must be at most 120 characters")
      .optional()
      .transform((value) => value || ""),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(120, "Name must be at most 120 characters"),
    brand_id: z.string().uuid().nullish(),
    year: z.coerce
      .number({ message: "Enter the model year" })
      .int()
      .min(1900, "Year must be 1900 or later")
      .max(2100, "Year must be 2100 or earlier"),
    price_idr: optionalNumber.nullish(),
    status: z.enum(["available", "sold", "reserved"]),
    engine: optionalString.nullish(),
    power_hp: optionalNumber.nullish(),
    torque_nm: optionalNumber.nullish(),
    acceleration_0_100: optionalNumber.nullish(),
    top_speed_kmh: optionalNumber.nullish(),
    transmission: optionalString.nullish(),
    drivetrain: optionalString.nullish(),
    exterior_color: optionalString.nullish(),
    interior_color: optionalString.nullish(),
    interior_hex: z
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Use a 6-digit hex like #6b4a2f")
      .optional()
      .or(z.literal(""))
      .transform((value) => value || null),
    mileage_km: optionalNumber.nullish(),
    description: z
      .string()
      .trim()
      .max(2000, "Description must be at most 2000 characters")
      .optional()
      .transform((value) => value || null),
    is_featured: z.coerce.boolean(),
    cover_image_url: z
      .string()
      .trim()
      .min(1, "Cover image is required")
      .max(500, "Cover image URL is too long"),
    // Satu URL per baris (textarea) — dipisah jadi array untuk gallery_urls.
    gallery_urls: z
      .string()
      .trim()
      .optional()
      .transform((value) =>
        value
          ? value
              .split(/\n|,/)
              .map((url) => url.trim())
              .filter(Boolean)
          : []
      ),
    // Daftar warna (car_colors) dikirim sebagai array tervalidasi, maks 12.
    colors: carColorSchema.array().max(12, "Maksimal 12 warna per mobil"),
  })
  // Slug final: pakai slug dari form bila valid, jika tidak turunkan dari
  // name (fallback server — form mengirim hidden field, tapi bisa kosong).
  .transform((data) => ({
    ...data,
    slug: slugify(data.slug || data.name),
  }))
  .refine((data) => data.slug.length >= 2, {
    message: "Slug must be at least 2 characters",
    path: ["slug"],
  });

export type CarFormInput = z.infer<typeof carSchema>;

// ============ ADMIN: BRANDS ============
export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters")
    .max(80, "Brand name must be at most 80 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug must be at most 80 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only"
    ),
  logo_url: z
    .string()
    .trim()
    .max(500, "Logo URL is too long")
    .optional()
    .transform((value) => value || null),
});

export type BrandFormInput = z.infer<typeof brandSchema>;

// ============ ADMIN: INQUIRY STATUS ============
export const inquiryStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "closed"]),
});

export type InquiryStatusInput = z.infer<typeof inquiryStatusSchema>;
