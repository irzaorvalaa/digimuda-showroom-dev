"use server";

import { inquirySchema } from "@/lib/validators";
import { createInquiry } from "@/lib/queries/inquiries";

export interface SubmitInquiryState {
  ok: boolean;
  error?: string;
}

export async function submitInquiry(
  _prevState: SubmitInquiryState,
  formData: FormData
): Promise<SubmitInquiryState> {
  // Honeypot: bot biasanya mengisi field tersembunyi ini
  if (formData.get("website")) {
    return { ok: true };
  }

  const parsed = inquirySchema.safeParse({
    full_name: formData.get("full_name"),
    whatsapp: formData.get("whatsapp"),
    message: formData.get("message"),
    car_id: formData.get("car_id") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const { error } = await createInquiry(parsed.data);

  if (error) {
    return {
      ok: false,
      error: "We couldn't send your message. Please try again.",
    };
  }

  return { ok: true };
}
