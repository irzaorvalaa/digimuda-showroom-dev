import type { Metadata } from "next";
// Font Geist dari paket lokal (geist) — bukan next/font/google, karena
// next/font/google mengunduh dari fonts.gstatic.com saat dev/build dan
// gagal di jaringan tanpa akses ke CDN tersebut.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase wajib agar URL Open Graph/Twitter absolut saat di-share.
  metadataBase: new URL("https://digimuda-showroom.com"),
  title: {
    default: "Digimuda ShowRoom — Curated Luxury Cars",
    template: "%s | Digimuda ShowRoom",
  },
  description:
    "A private showroom of curated luxury and performance cars in Jakarta. Every car inspected, documented, and presented like a gallery piece.",
};

// Root layout minimalis: hanya font + background. Chrome publik (navbar,
// footer, floating buttons) dipasang di app/(public)/layout.tsx supaya
// rute /admin dan /admin tetap bersih tanpa elemen publik.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col bg-[var(--surface-base)] font-sans text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
