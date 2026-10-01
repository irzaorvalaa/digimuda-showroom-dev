// Konstanta & tipe area admin yang AMAN diimpor dari Client Component.
// DIPISAH dari lib/queries/admin.ts karena file itu memuat createClient()
// (next/headers) yang tidak boleh terbawa ke client bundle (build error
// Turbopack: "This API is only available in Server Components").

export type AdminRole = "super_admin" | "admin";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/cars", label: "Cars" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/brands", label: "Brands" },
] as const;
