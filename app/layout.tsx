import type { Metadata } from "next";
// Font Geist dari paket lokal (geist) — bukan next/font/google, karena
// next/font/google mengunduh dari fonts.gstatic.com saat dev/build dan
// gagal di jaringan tanpa akses ke CDN tersebut.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import ConciergeButton from "@/components/floating/concierge-button";
import SocialDock from "@/components/floating/social-dock";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col bg-[#f6f3ed] font-sans text-zinc-900">
        <Navbar />
        {children}
        <Footer />
        {/* Elemen mengambang kanan bawah: social dock di atas, concierge di bawah */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-6">
          <SocialDock />
          <ConciergeButton />
        </div>
      </body>
    </html>
  );
}
