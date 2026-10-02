import type { Metadata } from "next";
import { MapPin, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";

export const metadata: Metadata = {
  title: "Events | Digimuda ShowRoom",
  description:
    "Cars and Coffee mornings, private viewing nights, and marque gatherings hosted by Digimuda ShowRoom in Jakarta.",
};

type EventItem = {
  date: string;
  month: string;
  day: string;
  title: string;
  body: string;
  venue: string;
  status: "open" | "waitlist" | "past";
  seats: string;
};

// Jadwal statis — belum ada tabel events di database, jadi data dipegang di sini.
const upcoming: EventItem[] = [
  {
    date: "2026-10-11",
    month: "Oct",
    day: "11",
    title: "Cars and Coffee: Air-Cooled Hour",
    body: "Bring the 911, the 250, the Countach. Coffee from a real bar, no PA system, no entry fee. Doors open 07:00.",
    venue: "Showroom lawn, Senopati",
    status: "open",
    seats: "40 cars",
  },
  {
    date: "2026-10-25",
    month: "Oct",
    day: "25",
    title: "Private Viewing: Continental GT Night",
    body: "Three Continental GTs on the floor after dark, each with its full inspection file open on the table.",
    venue: "Showroom floor, Senopati",
    status: "waitlist",
    seats: "18 guests",
  },
  {
    date: "2026-11-08",
    month: "Nov",
    day: "08",
    title: "Marque Talk: Reading a Service Book",
    body: "A 90-minute session on spotting a doctored history before you bid. Limited room, questions encouraged.",
    venue: "Upper lounge, Senopati",
    status: "open",
    seats: "24 seats",
  },
];

const past: EventItem[] = [
  {
    date: "2026-09-13",
    month: "Sep",
    day: "13",
    title: "Cars and Coffee: First Sunday",
    body: "Our opening gathering — 31 cars arrived, most stayed for a second coffee.",
    venue: "Showroom lawn, Senopati",
    status: "past",
    seats: "31 cars",
  },
];

// Status pill: emerald untuk open, amber untuk waitlist, zinc untuk past.
const statusStyles: Record<EventItem["status"], string> = {
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  waitlist: "border-amber-500/30 bg-amber-500/10 text-amber-800",
  past: "border-stone-200/60 bg-stone-100 text-zinc-600",
};

const statusLabels: Record<EventItem["status"], string> = {
  open: "Open",
  waitlist: "Waitlist",
  past: "Past",
};

export default function EventsPage() {
  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
              Events
            </p>
            <h1 className="mt-4 max-w-[18ch] text-display font-semibold leading-none text-zinc-900">
              We keep the doors open on weekends.
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-zinc-600 md:text-lg">
              Nothing staged, nothing filmed for a campaign. Coffee, good
              machines, and people who know the difference between a good story
              and a good car.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-6 lg:col-span-4">
            <div className="border-t border-stone-200/60 pt-6">
              <p className="font-mono text-3xl font-medium text-zinc-900">
                1 in 4
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                guests who return to buy within a year
              </p>
            </div>
            <div className="border-t border-stone-200/60 pt-6">
              <p className="text-sm text-zinc-600">
                Members get invitations first. Non-members can join if seats
                remain.
              </p>
            </div>
          </div>
        </div>

        {/* Daftar event — baris divide-y, tanggal font-mono di kiri */}
        <div className="mt-20">
          <h2 className="text-h3 font-semibold text-zinc-900">Upcoming</h2>

          <StaggerGrid className="mt-8 grid-cols-1 gap-0">
            {upcoming.map((event) => (
              <StaggerItem
                key={event.date}
                className="border-t border-stone-200/60 py-8 last:border-b"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-2">
                    <p className="font-mono text-3xl font-medium text-zinc-900">
                      {event.day}
                    </p>
                    <p className="font-mono text-sm text-zinc-600">
                      {event.month} 2026
                    </p>
                  </div>

                  <div className="md:col-span-7">
                    <h3 className="text-xl font-medium tracking-tight text-zinc-900 md:text-2xl">
                      {event.title}
                    </h3>
                    <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-zinc-600">
                      {event.body}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <span className="inline-flex items-center gap-2 text-sm text-zinc-600">
                        <MapPin size={16} weight="thin" />
                        {event.venue}
                      </span>
                      <span className="inline-flex items-center gap-2 font-mono text-sm text-zinc-600">
                        <CalendarBlank size={16} weight="thin" />
                        {event.seats}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start md:col-span-3 md:justify-end">
                    <span
                      className={
                        "rounded-full border px-3 py-1 text-xs font-medium " +
                        statusStyles[event.status]
                      }
                    >
                      {statusLabels[event.status]}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        <div className="mt-20">
          <h2 className="text-h3 font-semibold text-zinc-900">Recently</h2>

          <div className="mt-8 divide-y divide-stone-200/60 border-t border-b border-stone-200/60">
            {past.map((event) => (
              <div
                key={event.date}
                className="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-8"
              >
                <p className="font-mono text-sm text-zinc-600 md:w-32">
                  {event.day} {event.month} 2026
                </p>
                <p className="text-base font-medium tracking-tight text-zinc-900">
                  {event.title}
                </p>
                <p className="text-sm text-zinc-600 md:ml-auto">
                  {event.seats}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4">
          <ButtonLink href="/contact" variant="gold">
            Ask about the next gathering
          </ButtonLink>
          <ButtonLink href="/club" variant="ghost">
            Join Digimuda Club
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
