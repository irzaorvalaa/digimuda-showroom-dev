import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — semua project id (staging & production),
      // hanya objek public (RLS tidak berlaku untuk path public).
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Placeholder gambar (sementara) — dipakai hero-image & kartu dummy.
      // Ganti dengan aset final di Supabase Storage bila sudah siap.
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Placeholder berlabel teks (why-digimuda & section statis).
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
