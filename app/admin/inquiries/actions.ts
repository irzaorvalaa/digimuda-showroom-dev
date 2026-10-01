"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { inquiryStatusSchema } from "@/lib/validators";
import {
  deleteInquiry,
  requireSuperAdmin,
  updateInquiryStatus,
} from "@/lib/queries/admin";

export interface InquiryState {
  ok: boolean;
  error?: string;
}

// Update status inquiry (new → contacted → closed). Hanya super_admin —
// RLS yang menolak bila admin biasa mencoba (aturan Batch H).
export async function updateInquiryStatusAction(
  _prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const parsed = inquiryStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid inquiry update." };
  }

  await requireSuperAdmin();

  const { error } = await updateInquiryStatus(
    parsed.data.id,
    parsed.data.status
  );

  if (error) {
    return { ok: false, error };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin", "page");
  return { ok: true };
}

// Hapus inquiry. Hanya super_admin.
export async function deleteInquiryAction(id: string): Promise<void> {
  await requireSuperAdmin();
  await deleteInquiry(id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin", "page");
  redirect("/admin/inquiries");
}
