import { createClient } from "@/lib/supabase/server";
import type { CarColorInsert } from "@/lib/queries/admin-types";
import { ERR } from "@/lib/queries/admin-types";
import type { CarColorInput } from "@/lib/queries/admin-cars";

export interface ColorsMutation {
  error: string | null;
}

// Normalisasi: tepat satu is_default (fallback ke warna pertama),
// dan sort_order mengikuti urutan pada form.
function normalize(colors: CarColorInput[]): Omit<CarColorInsert, "car_id">[] {
  const hasDefault = colors.some((c) => c.is_default);
  return colors.map((c, index) => ({
    name: c.name,
    hex: c.hex,
    gallery_urls: c.gallery_urls,
    is_default: hasDefault ? c.is_default : index === 0,
    sort_order: index,
  }));
}

// Insert batch warna untuk mobil yang baru dibuat.
export async function saveCarColors(
  carId: string,
  colors: CarColorInput[]
): Promise<ColorsMutation> {
  if (colors.length === 0) return { error: null };
  const supabase = await createClient();
  const rows = normalize(colors).map((c) => ({ ...c, car_id: carId }));
  const response = await supabase.from("car_colors").insert(rows);

  if (response.error) return { error: ERR.saveColours };
  return { error: null };
}

// Sinkronkan warna saat edit: insert baru, update berubah, delete dihapus.
export async function syncCarColors(
  carId: string,
  colors: CarColorInput[]
): Promise<ColorsMutation> {
  const supabase = await createClient();
  const existingResponse = await supabase
    .from("car_colors")
    .select("id")
    .eq("car_id", carId);

  if (existingResponse.error) {
    return { error: ERR.loadExisting };
  }
  const existing: { id: string }[] = existingResponse.data ?? [];

  const incomingIds = new Set(
    colors.map((c) => c.id).filter((id): id is string => Boolean(id))
  );
  const toDelete = existing
    .filter((row) => !incomingIds.has(row.id))
    .map((row) => row.id);

  if (toDelete.length > 0) {
    const deleteResponse = await supabase
      .from("car_colors")
      .delete()
      .in("id", toDelete);
    if (deleteResponse.error) return { error: ERR.deleteColours };
  }

  const rows = normalize(colors);
  for (let index = 0; index < rows.length; index += 1) {
    const source = colors[index];
    if (source.id) {
      const updateResponse = await supabase
        .from("car_colors")
        .update(rows[index])
        .eq("id", source.id);
      if (updateResponse.error) return { error: ERR.updateColours };
    } else {
      const insertResponse = await supabase
        .from("car_colors")
        .insert({ ...rows[index], car_id: carId });
      if (insertResponse.error) return { error: ERR.insertColours };
    }
  }

  return { error: null };
}
