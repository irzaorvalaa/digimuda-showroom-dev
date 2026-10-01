import { createClient } from "@/lib/supabase/server";
import type { InquiryRow } from "@/lib/queries/admin-types";
import { ERR } from "@/lib/queries/admin-types";

export { ERR as INQUIRY_ERR };

export interface InquiriesResult {
  rows: InquiryRow[];
  failure: string | null;
}

export interface InquiryMutation {
  error: string | null;
}

// Ambil semua inquiry terbaru untuk halaman admin.
export async function getAllInquiries(): Promise<InquiriesResult> {
  const supabase = await createClient();
  const response = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (response.error || !response.data) {
    return { rows: [], failure: ERR.allInquiries };
  }
  return { rows: response.data, failure: null };
}

// Inquiry terbaru untuk widget dashboard.
export async function getRecentInquiries(limit = 5): Promise<InquiriesResult> {
  const supabase = await createClient();
  const response = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (response.error || !response.data) {
    return { rows: [], failure: ERR.recent };
  }
  return { rows: response.data, failure: null };
}

// Ubah status inquiry (new / contacted / closed).
export async function updateInquiryStatus(
  id: string,
  status: InquiryRow["status"]
): Promise<InquiryMutation> {
  const supabase = await createClient();
  const response = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  if (response.error) return { error: ERR.updateInquiry };
  return { error: null };
}

// Hitung inquiry berstatus "new".
export async function countNewInquiries(): Promise<number> {
  const supabase = await createClient();
  const response = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (response.error) return 0;
  return response.count ?? 0;
}
