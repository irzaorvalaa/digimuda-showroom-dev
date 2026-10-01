import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { AdminRole } from "@/lib/admin/constants";

type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];
type CarRow = Database["public"]["Tables"]["cars"]["Row"];
type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
type BrandInsert = Database["public"]["Tables"]["brands"]["Insert"];
type CarColorRow = Database["public"]["Tables"]["car_colors"]["Row"];
type CarColorInsert = Database["public"]["Tables"]["car_colors"]["Insert"];
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// Bentuk hasil query seragam: data + pesan error (null bila sukses).
export interface QueryResult<D> {
  data: D;
  error: string | null;
}

// Hasil operasi tulis (tanpa data).
export interface MutationResult {
  error: string | null;
}

// Helper pembentuk hasil sukses / gagal (tipe lewat alias, bukan inline).
type OkFn = <D>(data: D) => QueryResult<D>;
type FailFn = <D>(data: D, message: string) => QueryResult<D>;

const ok: OkFn = (data) => ({ data, error: null });
const fail: FailFn = (data, message) => ({ data, error: message });

// Pesan error konstanta agar tidak ditulis inline berulang.
const ERR_STATS = "Failed to load inventory stats.";
const ERR_INQUIRY_COUNT = "Failed to load inquiry count.";
const ERR_RECENT = "Failed to load recent inquiries.";
const ERR_CARS = "Failed to load cars.";
const ERR_ONE_CAR = "Failed to load car.";
const ERR_COLOURS = "Failed to load colours.";
const ERR_SAVE_COLOURS = "Failed to save colours.";
const ERR_LOAD_EXISTING = "Failed to load existing colours.";
const ERR_DELETE_COLOURS = "Failed to delete removed colours.";
const ERR_UPDATE_COLOURS = "Failed to update colours.";
const ERR_INSERT_COLOURS = "Failed to insert colours.";
const ERR_CREATE_CAR = "Failed to create car.";
const ERR_UPDATE_CAR = "Failed to update car.";
const ERR_DELETE_CAR = "Failed to delete car.";
const ERR_ALL_INQUIRIES = "Failed to load inquiries.";
const ERR_UPDATE_INQUIRY = "Failed to update inquiry.";
const ERR_DELETE_INQUIRY = "Failed to delete inquiry.";
const ERR_BRANDS = "Failed to load brands.";
const ERR_ONE_BRAND = "Failed to load brand.";
const ERR_CREATE_BRAND = "Failed to create brand.";
const ERR_UPDATE_BRAND = "Failed to update brand.";
const ERR_DELETE_BRAND = "Failed to delete brand.";

// Re-export dari lib/admin/constants.ts (client-safe, tanpa next/headers).
export { ADMIN_NAV_ITEMS } from "@/lib/admin/constants";
export type { AdminRole } from "@/lib/admin/constants";

export interface SessionUser {
  id: string;
  email: string | undefined;
  role: AdminRole;
}

// Ambil session + validasi admin lewat RPC is_admin().
export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const authResult = await supabase.auth.getUser();
  const user = authResult.data.user;

  if (!user) {
    return null;
  }

  const adminResult = await supabase.rpc("is_admin");
  const roleResult = await supabase.rpc("current_admin_role");

  if (adminResult.error) {
    console.error("getSession is_admin error:", adminResult.error.message);
    return null;
  }

  if (!adminResult.data) {
    return null;
  }

  let role: AdminRole = "admin";
  if (!roleResult.error && roleResult.data) {
    role = roleResult.data as AdminRole;
  }

  return {
    id: user.id,
    email: user.email,
    role,
  };
}

// Guard halaman admin: redirect ke login bila belum auth.
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

// Guard operasi tulis (edit/hapus). RLS tetap source of truth.
export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await requireAdmin();
  if (user.role !== "super_admin") {
    redirect("/admin");
  }
  return user;
}

export interface AdminStats {
  totalCars: number;
  available: number;
  reserved: number;
  sold: number;
  newInquiries: number;
  error: string | null;
}

// Ringkasan untuk dashboard admin.
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const carsResult = await supabase.from("cars").select("status");
  const inquiriesResult = await supabase
    .from("inquiries")
    .select("id")
    .eq("status", "new");

  if (carsResult.error) {
    console.error("getAdminStats cars error:", carsResult.error.message);
    return {
      totalCars: 0,
      available: 0,
      reserved: 0,
      sold: 0,
      newInquiries: 0,
      error: ERR_STATS,
    };
  }

  const rows = carsResult.data ?? [];
  let available = 0;
  let reserved = 0;
  let sold = 0;

  for (const row of rows) {
    if (row.status === "available") {
      available += 1;
    } else if (row.status === "reserved") {
      reserved += 1;
    } else if (row.status === "sold") {
      sold += 1;
    }
  }

  let inquiriesError: string | null = null;
  if (inquiriesResult.error) {
    console.error(
      "getAdminStats inquiries error:",
      inquiriesResult.error.message
    );
    inquiriesError = ERR_INQUIRY_COUNT;
  }

  const newInquiries = inquiriesResult.data ? inquiriesResult.data.length : 0;

  return {
    totalCars: rows.length,
    available,
    reserved,
    sold,
    newInquiries,
    error: inquiriesError,
  };
}

export interface AdminInquiry extends InquiryRow {
  car_name: string | null;
}

type InquirySummaryRow = Pick<
  InquiryRow,
  | "id"
  | "full_name"
  | "whatsapp"
  | "message"
  | "status"
  | "car_id"
  | "created_at"
>;

// Ambil nama mobil untuk daftar inquiry (hindari N+1 query).
async function attachCarNames(
  supabase: SupabaseClient,
  rows: InquirySummaryRow[]
): Promise<AdminInquiry[]> {
  const carIds: string[] = [];
  for (const row of rows) {
    if (row.car_id) {
      carIds.push(row.car_id);
    }
  }

  const carNames: Record<string, string> = {};

  if (carIds.length > 0) {
    const carsResult = await supabase
      .from("cars")
      .select("id, name")
      .in("id", carIds);

    if (!carsResult.error && carsResult.data) {
      for (const car of carsResult.data) {
        carNames[car.id] = car.name;
      }
    }
  }

  return rows.map((row) => ({
    ...row,
    car_name: row.car_id ? carNames[row.car_id] ?? null : null,
  }));
}

// 8 inquiry terbaru + nama mobil yang ditanyakan.
export async function getRecentInquiries(): Promise<
  QueryResult<AdminInquiry[]>
> {
  const supabase = await createClient();

  const result = await supabase
    .from("inquiries")
    .select("id, full_name, whatsapp, message, status, car_id, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  if (result.error) {
    console.error("getRecentInquiries error:", result.error.message);
    return fail<AdminInquiry[]>([], ERR_RECENT);
  }

  const rows = result.data ?? [];
  const data = await attachCarNames(supabase, rows);
  return ok(data);
}

// Baris mobil + nama brand untuk tabel admin (hindari N+1).
export interface AdminCarRow extends CarRow {
  brand_name: string | null;
}

type CarWithBrandName = CarRow & {
  brands: { name: string } | null;
};

// Daftar mobil untuk tabel admin.
export async function getAdminCars(): Promise<QueryResult<AdminCarRow[]>> {
  const supabase = await createClient();

  const result = await supabase
    .from("cars")
    .select("*, brands(name)")
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error("getAdminCars error:", result.error.message);
    return fail<AdminCarRow[]>([], ERR_CARS);
  }

  const rows: AdminCarRow[] = (result.data ?? []).map((row) => {
    const { brands, ...car } = row as unknown as CarWithBrandName;
    return { ...(car as CarRow), brand_name: brands ? brands.name : null };
  });

  return ok(rows);
}

// Alias tipe untuk konsumen halaman list admin.
export type AdminCar = AdminCarRow;

export interface AdminCarDetail {
  car: CarRow;
  brand_name: string | null;
  colors: CarColorRow[];
}

type CarWithRelations = CarRow & {
  brands: { name: string } | null;
  car_colors: CarColorRow[] | null;
};

// Detail satu mobil + brand + warna, untuk halaman edit.
export async function getAdminCarById(
  id: string
): Promise<QueryResult<AdminCarDetail | null>> {
  const supabase = await createClient();

  const result = await supabase
    .from("cars")
    .select("*, brands(name), car_colors(*)")
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    console.error("getAdminCarById error:", result.error.message);
    return fail<AdminCarDetail | null>(null, ERR_ONE_CAR);
  }

  if (!result.data) {
    return ok<AdminCarDetail | null>(null);
  }

  const row = result.data as unknown as CarWithRelations;
  const brandName = row.brands ? row.brands.name : null;
  const rawColors = row.car_colors ?? [];
  const colors = rawColors.slice().sort((a, b) => a.sort_order - b.sort_order);

  const car = { ...row } as CarRow;
  delete (car as Partial<CarWithRelations>).brands;
  delete (car as Partial<CarWithRelations>).car_colors;

  const detail: AdminCarDetail = {
    car,
    brand_name: brandName,
    colors,
  };
  return ok(detail);
}

// Daftar warna untuk satu mobil (urut sort_order).
export async function getCarColors(
  carId: string
): Promise<QueryResult<CarColorRow[]>> {
  const supabase = await createClient();

  const result = await supabase
    .from("car_colors")
    .select("*")
    .eq("car_id", carId)
    .order("sort_order", { ascending: true });

  if (result.error) {
    console.error("getCarColors error:", result.error.message);
    return fail<CarColorRow[]>([], ERR_COLOURS);
  }

  return ok(result.data ?? []);
}

export interface CarColorInput {
  id?: string;
  name: string;
  hex: string;
  gallery_urls: string[];
  is_default: boolean;
  sort_order: number;
}

// Input mobil untuk create/update (row + warna terkait).
export type CarInput = CarInsert & {
  colors?: CarColorInput[];
  interior_hex?: string | null;
};

// Bangun payload baris warna (default jatuh ke warna pertama bila tak ada).
function buildColorPayload(
  carId: string,
  color: CarColorInput,
  index: number,
  hasDefault: boolean
): CarColorInsert {
  return {
    car_id: carId,
    name: color.name,
    hex: color.hex,
    gallery_urls: color.gallery_urls,
    is_default: hasDefault ? color.is_default : index === 0,
    sort_order: color.sort_order,
  };
}

// Simpan warna saat create mobil (batch insert).
export async function saveCarColors(
  carId: string,
  colors: CarColorInput[]
): Promise<MutationResult> {
  if (colors.length === 0) {
    return { error: null };
  }

  const supabase = await createClient();
  const hasDefault = colors.some((color) => color.is_default);
  const rows: CarColorInsert[] = colors.map((color, index) =>
    buildColorPayload(carId, color, index, hasDefault)
  );

  const result = await supabase.from("car_colors").insert(rows);

  if (result.error) {
    console.error("saveCarColors error:", result.error.message);
    return { error: ERR_SAVE_COLOURS };
  }

  return { error: null };
}

// Sinkronkan warna saat update: insert baru, update berubah, hapus yang hilang.
export async function syncCarColors(
  carId: string,
  colors: CarColorInput[]
): Promise<MutationResult> {
  const supabase = await createClient();

  const existingResult = await supabase
    .from("car_colors")
    .select("id")
    .eq("car_id", carId);

  if (existingResult.error) {
    console.error("syncCarColors fetch error:", existingResult.error.message);
    return { error: ERR_LOAD_EXISTING };
  }

  const existingIds: string[] = [];
  for (const row of existingResult.data ?? []) {
    existingIds.push(row.id);
  }

  const incomingIds: string[] = [];
  for (const color of colors) {
    if (color.id) {
      incomingIds.push(color.id);
    }
  }

  const toDelete: string[] = [];
  for (const id of existingIds) {
    if (!incomingIds.includes(id)) {
      toDelete.push(id);
    }
  }

  const hasDefault = colors.some((color) => color.is_default);
  const toInsert: CarColorInsert[] = [];
  const toUpdate: { id: string; payload: CarColorInsert }[] = [];

  colors.forEach((color, index) => {
    const payload = buildColorPayload(carId, color, index, hasDefault);
    if (color.id && existingIds.includes(color.id)) {
      toUpdate.push({ id: color.id, payload });
    } else {
      toInsert.push(payload);
    }
  });

  if (toDelete.length > 0) {
    const deleteResult = await supabase
      .from("car_colors")
      .delete()
      .in("id", toDelete);

    if (deleteResult.error) {
      console.error("syncCarColors delete error:", deleteResult.error.message);
      return { error: ERR_DELETE_COLOURS };
    }
  }

  for (const item of toUpdate) {
    const updateResult = await supabase
      .from("car_colors")
      .update(item.payload)
      .eq("id", item.id);

    if (updateResult.error) {
      console.error("syncCarColors update error:", updateResult.error.message);
      return { error: ERR_UPDATE_COLOURS };
    }
  }

  if (toInsert.length > 0) {
    const insertResult = await supabase.from("car_colors").insert(toInsert);

    if (insertResult.error) {
      console.error("syncCarColors insert error:", insertResult.error.message);
      return { error: ERR_INSERT_COLOURS };
    }
  }

  return { error: null };
}

// Buat mobil baru, kembalikan row (untuk id) agar warna bisa disimpan.
export async function createCar(
  input: CarInput
): Promise<QueryResult<CarRow | null>> {
  const supabase = await createClient();

  // Pisahkan colors agar tidak ikut menjadi kolom tabel cars.
  const { colors, ...carFields } = input;
  // colors dikonsumsi terpisah lewat saveCarColors(); di sini cukup dibuang.
  void colors;

  const result = await supabase
    .from("cars")
    .insert(carFields)
    .select("*")
    .maybeSingle();

  if (result.error) {
    console.error("createCar error:", result.error.message);
    return fail<CarRow | null>(null, ERR_CREATE_CAR);
  }

  return ok(result.data ?? null);
}

// Update mobil by id.
export async function updateCar(
  id: string,
  input: CarInput | Partial<CarInsert>
): Promise<MutationResult> {
  const supabase = await createClient();

  // Pastikan colors tidak ikut menjadi kolom tabel cars.
  const { colors, ...carFields } = input as CarInput;
  // colors disinkronkan terpisah lewat syncCarColors(); di sini cukup dibuang.
  void colors;

  const result = await supabase.from("cars").update(carFields).eq("id", id);

  if (result.error) {
    console.error("updateCar error:", result.error.message);
    return { error: ERR_UPDATE_CAR };
  }

  return { error: null };
}

// Hapus mobil (car_colors ikut terhapus via on delete cascade).
export async function deleteCar(id: string): Promise<MutationResult> {
  const supabase = await createClient();

  const result = await supabase.from("cars").delete().eq("id", id);

  if (result.error) {
    console.error("deleteCar error:", result.error.message);
    return { error: ERR_DELETE_CAR };
  }

  return { error: null };
}

// Daftar semua inquiry (untuk halaman inquiries).
export async function getInquiries(): Promise<QueryResult<AdminInquiry[]>> {
  const supabase = await createClient();

  const result = await supabase
    .from("inquiries")
    .select("id, full_name, whatsapp, message, status, car_id, created_at")
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error("getInquiries error:", result.error.message);
    return fail<AdminInquiry[]>([], ERR_ALL_INQUIRIES);
  }

  const rows = result.data ?? [];
  const data = await attachCarNames(supabase, rows);
  return ok(data);
}

// Alias agar konsumen lama (getAllInquiries) tetap kompatibel.
export const getAllInquiries = getInquiries;

// Update status inquiry.
export async function updateInquiryStatus(
  id: string,
  status: InquiryRow["status"]
): Promise<MutationResult> {
  const supabase = await createClient();

  const result = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  if (result.error) {
    console.error("updateInquiryStatus error:", result.error.message);
    return { error: ERR_UPDATE_INQUIRY };
  }

  return { error: null };
}

// Hapus inquiry (super_admin; RLS sumber kebenaran).
export async function deleteInquiry(id: string): Promise<MutationResult> {
  const supabase = await createClient();

  const result = await supabase.from("inquiries").delete().eq("id", id);

  if (result.error) {
    console.error("deleteInquiry error:", result.error.message);
    return { error: ERR_DELETE_INQUIRY };
  }

  return { error: null };
}

export interface AdminBrand extends BrandRow {
  car_count: number;
}

// Daftar brand + jumlah mobil.
export async function getBrandsWithCounts(): Promise<
  QueryResult<AdminBrand[]>
> {
  const supabase = await createClient();

  const brandsResult = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (brandsResult.error) {
    console.error("getBrandsWithCounts error:", brandsResult.error.message);
    return fail<AdminBrand[]>([], ERR_BRANDS);
  }

  const countsResult = await supabase.from("cars").select("brand_id");
  const counts: Record<string, number> = {};

  if (!countsResult.error && countsResult.data) {
    for (const row of countsResult.data) {
      if (row.brand_id) {
        counts[row.brand_id] = (counts[row.brand_id] ?? 0) + 1;
      }
    }
  }

  const data = (brandsResult.data ?? []).map((brand) => ({
    ...brand,
    car_count: counts[brand.id] ?? 0,
  }));

  return ok(data);
}

// Alias agar konsumen lama (getAdminBrands) tetap kompatibel.
export const getAdminBrands = getBrandsWithCounts;

// Detail satu brand.
export async function getAdminBrandById(
  id: string
): Promise<QueryResult<BrandRow | null>> {
  const supabase = await createClient();

  const result = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    console.error("getAdminBrandById error:", result.error.message);
    return fail<BrandRow | null>(null, ERR_ONE_BRAND);
  }

  return ok(result.data ?? null);
}

// Daftar brand (row lengkap) untuk dropdown form mobil.
export async function getBrands(): Promise<QueryResult<BrandRow[]>> {
  const supabase = await createClient();

  const result = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (result.error) {
    console.error("getBrands error:", result.error.message);
    return fail<BrandRow[]>([], ERR_BRANDS);
  }

  return ok(result.data ?? []);
}

// Alias agar konsumen lama (getBrandOptions) tetap kompatibel.
export const getBrandOptions = getBrands;

// Buat brand baru.
export async function createBrand(input: BrandInsert): Promise<MutationResult> {
  const supabase = await createClient();

  const result = await supabase.from("brands").insert(input);

  if (result.error) {
    console.error("createBrand error:", result.error.message);
    return { error: ERR_CREATE_BRAND };
  }

  return { error: null };
}

// Update brand.
export async function updateBrand(
  id: string,
  input: Partial<BrandInsert>
): Promise<MutationResult> {
  const supabase = await createClient();

  const result = await supabase.from("brands").update(input).eq("id", id);

  if (result.error) {
    console.error("updateBrand error:", result.error.message);
    return { error: ERR_UPDATE_BRAND };
  }

  return { error: null };
}

// Hapus brand.
export async function deleteBrand(id: string): Promise<MutationResult> {
  const supabase = await createClient();

  const result = await supabase.from("brands").delete().eq("id", id);

  if (result.error) {
    console.error("deleteBrand error:", result.error.message);
    return { error: ERR_DELETE_BRAND };
  }

  return { error: null };
}
