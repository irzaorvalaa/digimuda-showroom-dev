// PLACEHOLDER — file ini akan DITIMPA oleh hasil generate Supabase:
//   lokal : npx supabase gen types typescript --local > types/database.ts
//   cloud : npx supabase gen types typescript --project-id [ID] > types/database.ts
// Jangan edit manual setelah di-generate. Struktur minimal ini hanya agar
// import `Database` tidak error sebelum migrasi dijalankan.

export type Database = {
  public: {
    Tables: {
      brands: { Row: Record<string, unknown> };
      cars: { Row: Record<string, unknown> };
      inquiries: { Row: Record<string, unknown> };
      admins: { Row: Record<string, unknown> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
