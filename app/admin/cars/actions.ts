"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { carSchema } from "@/lib/validators";
import {
  createCar,
  deleteCar,
  saveCarColors,
  syncCarColors,
  updateCar,
  requireAdmin,
  requireSuperAdmin,
  type CarInput,
} from "@/lib/queries/admin";

export interface CarFormState {
  ok: boolean;
  error?: string;
  // Pesan error per-field untuk ditampilkan di bawah input (SKILL.md Rule 6).
  fieldErrors?: Record<string, string>;
}

// Textarea galeri (satu URL per baris) → array bersih, sinkron dengan carSchema.
function parseGallery(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }
  return value
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

// Rakit array warna dari field dinamis (color_name[i], color_hex[i], dst).
// Radio "color_default" menyimpan indeks warna default; bila kosong, warna
// pertama yang dijadikan default (validator + query ikut menormalkan).
function parseColors(formData: FormData): {
  id?: string;
  name: string;
  hex: string;
  gallery_urls: string[];
  is_default: boolean;
}[] {
  const names = formData.getAll("color_name");
  const hexes = formData.getAll("color_hex");
  const ids = formData.getAll("color_id");
  const galleries = formData.getAll("color_gallery");
  const defaultRaw = formData.get("color_default");
  const defaultIndex = typeof defaultRaw === "string" ? Number(defaultRaw) : -1;

  const colors: {
    id?: string;
    name: string;
    hex: string;
    gallery_urls: string[];
    is_default: boolean;
  }[] = [];

  names.forEach((nameValue, index) => {
    // Lewati baris kosong (user menambah lalu mengosongkan nama).
    if (typeof nameValue !== "string" || nameValue.trim() === "") {
      return;
    }

    const idValue = ids[index];
    const hexValue = hexes[index];

    colors.push({
      id: typeof idValue === "string" && idValue !== "" ? idValue : undefined,
      name: nameValue,
      hex: typeof hexValue === "string" ? hexValue : "",
      gallery_urls: parseGallery(galleries[index] ?? null),
      is_default: defaultIndex < 0 ? index === 0 : index === defaultIndex,
    });
  });

  return colors;
}

// FormData → record mentah siap divalidasi zod. Checkbox is_featured
// dikirim sebagai "on" saat dicentang.
function toFormRecord(formData: FormData) {
  return {
    slug: formData.get("slug"),
    name: formData.get("name"),
    brand_id: formData.get("brand_id") || undefined,
    year: formData.get("year"),
    price_idr: formData.get("price_idr"),
    status: formData.get("status"),
    engine: formData.get("engine"),
    power_hp: formData.get("power_hp"),
    torque_nm: formData.get("torque_nm"),
    acceleration_0_100: formData.get("acceleration_0_100"),
    top_speed_kmh: formData.get("top_speed_kmh"),
    transmission: formData.get("transmission"),
    drivetrain: formData.get("drivetrain"),
    exterior_color: formData.get("exterior_color"),
    interior_color: formData.get("interior_color"),
    interior_hex: formData.get("interior_hex"),
    mileage_km: formData.get("mileage_km"),
    description: formData.get("description"),
    is_featured: formData.get("is_featured") === "on",
    cover_image_url: formData.get("cover_image_url"),
    gallery_urls: formData.get("gallery_urls"),
    colors: parseColors(formData),
  };
}

// Ambil pesan error per-field dari zod (key = nama field form).
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

// CREATE — semua role admin boleh menambah mobil (RLS: is_admin()).
export async function createCarAction(
  _prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const parsed = carSchema.safeParse(toFormRecord(formData));

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  // CREATE boleh dilakukan semua role admin (RLS: is_admin()). Edit/hapus
  // tetap super_admin saja (aturan Batch H).
  await requireAdmin();

  // colors + sort_order dipisah dari kolom tabel cars (createCar mengabaikan
  // colors; warna disimpan terpisah lewat saveCarColors).
  const { colors, ...carPayload } = parsed.data;

  const created = await createCar(carPayload as CarInput);

  if (created.error || !created.data) {
    return { ok: false, error: created.error ?? "Failed to create car." };
  }

  if (colors.length > 0) {
    // sort_order mengikuti urutan form.
    const colorInputs = colors.map((color, index) => ({
      ...color,
      sort_order: index,
    }));
    const colorResult = await saveCarColors(created.data.id, colorInputs);

    if (colorResult.error) {
      return { ok: false, error: colorResult.error };
    }
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars", "page");
  revalidatePath("/", "page");
  redirect("/admin/cars");
}

// UPDATE — hanya super_admin (RLS: is_super_admin()).
export async function updateCarAction(
  id: string,
  _prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const parsed = carSchema.safeParse(toFormRecord(formData));

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  await requireSuperAdmin();

  const { colors, ...carPayload } = parsed.data;

  const updated = await updateCar(id, carPayload as CarInput);

  if (updated.error) {
    return { ok: false, error: updated.error };
  }

  // Diff warna by id: insert baru / update berubah / delete dihapus.
  const colorInputs = colors.map((color, index) => ({
    ...color,
    sort_order: index,
  }));
  const colorResult = await syncCarColors(id, colorInputs);

  if (colorResult.error) {
    return { ok: false, error: colorResult.error };
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars", "page");
  revalidatePath("/", "page");
  redirect("/admin/cars");
}

// DELETE — hanya super_admin. Dipanggil dari tombol di list mobil.
export async function deleteCarAction(id: string): Promise<void> {
  await requireSuperAdmin();
  await deleteCar(id);
  revalidatePath("/admin/cars");
  revalidatePath("/cars", "page");
  revalidatePath("/", "page");
  redirect("/admin/cars");
}
