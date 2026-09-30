import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type Row = Database["public"]["Tables"]["inquiries"]["Row"];

export type CreateInquiryInput = {
  full_name: string;
  whatsapp: string;
  message?: string | null;
  car_id?: string | null;
};

export type InquiryResult = {
  data: Row | null;
  error: string | null;
};

export async function createInquiry(
  input: CreateInquiryInput
): Promise<InquiryResult> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      full_name: input.full_name,
      whatsapp: input.whatsapp,
      message: input.message ?? null,
      car_id: input.car_id ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("createInquiry error:", error.message);
    return {
      data: null,
      error: "Failed to send your message. Please try again.",
    };
  }
  return { data, error: null };
}
