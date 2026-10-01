"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface SignInState {
  ok: boolean;
  error?: string;
}

// Login email+password. Public sign-up dimatikan di config Supabase
// (enable_signup = false), jadi hanya akun yang dibuat manual di dashboard
// yang bisa masuk. Validasi admin (tabel admins) dilakukan saat halaman
// admin di-load lewat requireAdmin().
export async function signIn(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Pesan generik agar tidak membocorkan email mana yang terdaftar.
    return { ok: false, error: "Invalid email or password." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

// Logout: hapus session lalu kembali ke halaman utama.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
