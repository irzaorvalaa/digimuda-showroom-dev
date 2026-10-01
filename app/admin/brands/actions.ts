"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { brandSchema } from "@/lib/validators";
import {
  createBrand,
  deleteBrand,
  requireAdmin,
  requireSuperAdmin,
  updateBrand,
} from "@/lib/queries/admin";

export interface BrandFormState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function collectFieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[]
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

// CREATE brand — semua role admin (RLS: is_admin()).
export async function createBrandAction(
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logo_url: formData.get("logo_url") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  // CREATE boleh dilakukan semua role admin (RLS: is_admin()).
  await requireAdmin();

  const { error } = await createBrand(parsed.data);

  if (error) {
    return { ok: false, error };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/admin/cars", "page");
  redirect("/admin/brands");
}

// UPDATE brand — hanya super_admin.
export async function updateBrandAction(
  id: string,
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logo_url: formData.get("logo_url") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  await requireSuperAdmin();

  const { error } = await updateBrand(id, parsed.data);

  if (error) {
    return { ok: false, error };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/admin/cars", "page");
  redirect("/admin/brands");
}

// DELETE brand — hanya super_admin. cars.brand_id di-set NULL otomatis
// (on delete set null, lihat 0001_init.sql).
export async function deleteBrandAction(id: string): Promise<void> {
  await requireSuperAdmin();
  await deleteBrand(id);
  revalidatePath("/admin/brands");
  revalidatePath("/admin/cars", "page");
  redirect("/admin/brands");
}
