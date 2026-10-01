import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import ConciergeButton from "@/components/floating/concierge-button";
import SocialDock from "@/components/floating/social-dock";

// Route group (public): halaman publik dengan chrome lengkap (navbar,
// footer, floating buttons). Rute /admin dan /auth hanya mewarisi root
// layout minimalis — tanpa chrome publik.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {/* Elemen mengambang kanan bawah: social dock di atas, concierge di bawah */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-6">
        <SocialDock />
        <ConciergeButton />
      </div>
    </>
  );
}
