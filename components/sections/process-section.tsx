import {
  MagnifyingGlass,
  CalendarBlank,
  ClipboardText,
  Key,
} from "@phosphor-icons/react/dist/ssr";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";

// Langkah "How It Works" — 4 langkah, bukan 3 (menghindari AI-tell feature row).
const steps = [
  {
    no: "01",
    title: "Tell us the model",
    body: "Send the name or a photo of what you have in mind. We reply with live availability and the full inspection file — not a brochure.",
    Icon: MagnifyingGlass,
  },
  {
    no: "02",
    title: "Private viewing",
    body: "Visit the showroom after hours, or have the car delivered to your address for a quiet look. One advisor, no crowd, no hard sell.",
    Icon: CalendarBlank,
  },
  {
    no: "03",
    title: "Read the record",
    body: "Every car ships with a 142-point report, service history, and paint-depth measurements. Where something is imperfect, we say so first.",
    Icon: ClipboardText,
  },
  {
    no: "04",
    title: "Take the keys",
    body: "We handle documents, transfer, and transport. Most handovers finish within three working days of agreement.",
    Icon: Key,
  },
];

// Layout asimetris 4/8 (DESIGN_VARIANCE 8): judul rata kiri menempel,
// langkah sebagai baris divide-y — tanpa kotak kartu (SKILL Rule 4).
export default function ProcessSection() {
  return (
    <section className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-800">
            The process
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-none tracking-tighter text-zinc-900 md:text-5xl">
            Four steps,
            <br />
            no theatre.
          </h2>
          <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-zinc-600">
            Buying from us should feel like borrowing a car from a friend —
            unhurried, transparent, and finished with paperwork already taken
            care of.
          </p>
        </div>

        <StaggerGrid className="lg:col-span-8 lg:gap-0">
          {steps.map((step) => (
            <StaggerItem
              key={step.no}
              className="border-t border-stone-200/60 py-8 last:border-b md:py-10"
            >
              <div className="flex items-start gap-6 md:gap-10">
                <span className="font-mono text-sm text-zinc-600">
                  {step.no}
                </span>
                <step.Icon
                  size={28}
                  weight="thin"
                  className="shrink-0 text-amber-700"
                />
                <div className="min-w-0">
                  <h3 className="text-xl font-medium tracking-tight text-zinc-900 md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[55ch] text-base leading-relaxed text-zinc-600">
                    {step.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
