import { z } from "zod";

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
