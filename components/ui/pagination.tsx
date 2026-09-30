import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Status filter aktif; undefined = semua. Dipakai untuk menyusun query string. */
  status?: string;
}

// Helper: bangun URL katalog dengan status + halaman yang benar.
function buildHref(status: string | undefined, page: number): string {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/cars?${query}` : "/cars";
}

// Paginasi server component. Tanpa interaktivitas, cukup Link untuk
// navigasi antar halaman (client-side routing tetap aktif).
export default function Pagination({
  currentPage,
  totalPages,
  status,
}: PaginationProps) {
  // Total 1 halaman: tidak perlu tampil paginasi.
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <Link
        href={
          hasPrev
            ? buildHref(status, currentPage - 1)
            : buildHref(status, currentPage)
        }
        aria-disabled={!hasPrev}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200/60 text-zinc-600 transition-colors",
          hasPrev
            ? "hover:border-stone-300 hover:bg-stone-100 hover:text-zinc-900"
            : "pointer-events-none opacity-40"
        )}
      >
        <ArrowLeft size={18} />
      </Link>

      {pageNumbers.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={buildHref(status, page)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-mono tabular-nums transition-colors",
              isActive
                ? "bg-zinc-900 text-white"
                : "border border-stone-200/60 text-zinc-600 hover:border-stone-300 hover:bg-stone-100 hover:text-zinc-900"
            )}
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={
          hasNext
            ? buildHref(status, currentPage + 1)
            : buildHref(status, currentPage)
        }
        aria-disabled={!hasNext}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200/60 text-zinc-600 transition-colors",
          hasNext
            ? "hover:border-stone-300 hover:bg-stone-100 hover:text-zinc-900"
            : "pointer-events-none opacity-40"
        )}
      >
        <ArrowRight size={18} />
      </Link>
    </nav>
  );
}
