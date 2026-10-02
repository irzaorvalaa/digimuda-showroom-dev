import type { Metadata } from "next";
import { ChatsCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import DeleteButton from "@/components/ui/delete-button";
import EmptyState from "@/components/ui/empty-state";
import InquiryStatusForm from "@/components/sections/inquiry-status-form";
import { deleteInquiryAction } from "@/app/admin/inquiries/actions";
import {
  getInquiries,
  requireAdmin,
  type AdminInquiry,
} from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inquiries",
  description: "Client messages from the contact form.",
  robots: { index: false, follow: false },
};

export default async function AdminInquiriesPage() {
  const user = await requireAdmin();
  const { data: inquiries, error } = await getInquiries();

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div>
          <p className="text-sm font-medium text-amber-500">Messages</p>
          <h1 className="mt-2 text-h1 font-semibold text-zinc-100">
            Inquiries
          </h1>
          <p className="mt-3 font-mono text-sm text-zinc-500">
            {inquiries.length} {inquiries.length === 1 ? "message" : "messages"}{" "}
            · {user.role === "super_admin" ? "full access" : "read only"}
          </p>
        </div>

        {error ? (
          <EmptyState
            icon={<WarningCircle size={22} />}
            title="Couldn't load inquiries"
            description={error}
            className="mt-8 border-white/10 bg-white/[0.03]"
          />
        ) : inquiries.length === 0 ? (
          <EmptyState
            icon={<ChatsCircle size={22} />}
            title="No messages yet"
            description="When a client sends the contact form, their message lands here."
            className="mt-8 border-white/10 bg-white/[0.03]"
          />
        ) : (
          <div className="mt-12 divide-y divide-white/8 border-t border-white/8">
            {inquiries.map((inquiry: AdminInquiry) => (
              <div
                key={inquiry.id}
                className="flex flex-col gap-5 py-6 md:flex-row md:items-start md:justify-between md:gap-10"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-100">
                    {inquiry.full_name}
                  </p>
                  <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-zinc-400">
                    {inquiry.message ?? "No message attached."}
                  </p>
                  <p className="mt-2 font-mono text-xs text-zinc-600">
                    {inquiry.car_name
                      ? `Re: ${inquiry.car_name}`
                      : "General inquiry"}{" "}
                    · {formatDate(inquiry.created_at)}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-600">
                    {inquiry.whatsapp}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3">
                  {user.role === "super_admin" ? (
                    <>
                      <InquiryStatusForm
                        id={inquiry.id}
                        status={
                          (inquiry.status as "new" | "contacted" | "closed") ??
                          "new"
                        }
                      />
                      <DeleteButton
                        action={deleteInquiryAction}
                        id={inquiry.id}
                        label={`inquiry from ${inquiry.full_name}`}
                      />
                    </>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                      {inquiry.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
