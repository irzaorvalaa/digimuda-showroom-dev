"use client";

import { useActionState, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/ui/input";
import RippleButton from "@/components/motion/ripple-button";
import {
  createCarAction,
  updateCarAction,
  type CarFormState,
} from "@/app/admin/cars/actions";
import {
  EXTERIOR_COLOR_PRESETS,
  INTERIOR_COLOR_PRESETS,
} from "@/lib/admin/color-presets";
import type { AdminCarDetail } from "@/lib/queries/admin";
import type { Tables } from "@/types/database";
import type { CarStatus } from "@/types/car";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";

interface CarFormProps {
  /** Mode edit: detail mobil (row + warna). Mode create = undefined. */
  car?: AdminCarDetail;
  brands: Tables<"brands">[];
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

const initialState: CarFormState = { ok: false };

const statusOptions: { value: CarStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

const MAX_COLOURS = 12;
const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

// State satu baris warna di form (id opsional: ada saat edit).
interface ColourRow {
  key: string;
  id?: string;
  name: string;
  hex: string;
  gallery: string;
  isDefault: boolean;
}

// Slug dari name: lowercase, spasi → hyphen, buang non-alfanumerik.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Buat key unik sederhana untuk React list (tanpa id DB saat baris baru).
let colourKeyCounter = 0;
function nextColourKey(): string {
  colourKeyCounter += 1;
  return `colour-${colourKeyCounter}`;
}

// Form create/edit mobil. Dipakai di /admin/cars/new dan /admin/cars/[id]/edit.
// Field dibagi kelompok (identitas / spesifikasi / warna / presentasi) supaya
// tidak jadi satu dinding input panjang (VISUAL_DENSITY 4 — lega).
export default function CarForm({ car, brands }: CarFormProps) {
  const isEdit = Boolean(car);
  // Row mobil (kolom tabel cars); colors terpisah di car.colors.
  const row = car?.car;

  const [state, formAction, pending] = useActionState(
    async (prevState: CarFormState, formData: FormData) => {
      if (isEdit && row) return updateCarAction(row.id, prevState, formData);
      return createCarAction(prevState, formData);
    },
    initialState
  );

  const buttonStatus = useMemo(() => {
    if (pending) return "loading" as const;
    if (state.ok) return "success" as const;
    if (state.error) return "error" as const;
    return "idle" as const;
  }, [pending, state.ok, state.error]);

  // Slug read-only, diturunkan otomatis dari name (edit = ubah URL publik).
  const [name, setName] = useState(row?.name ?? "");
  const slug = slugify(name);

  // Interior: nama material + hex swatch.
  const [interiorColor, setInteriorColor] = useState(row?.interior_color ?? "");
  const [interiorHex, setInteriorHex] = useState(
    row?.interior_hex ?? "#5C3A21"
  );

  // Daftar warna (car_colors). Edit memuat warna existing (urut sort_order).
  const [colours, setColours] = useState<ColourRow[]>(() =>
    (car?.colors ?? []).map((colour) => ({
      key: nextColourKey(),
      id: colour.id,
      name: colour.name,
      hex: colour.hex,
      gallery: colour.gallery_urls.join("\n"),
      isDefault: colour.is_default,
    }))
  );

  // Indeks warna default (radio). Fallback ke baris pertama.
  const [defaultIndex, setDefaultIndex] = useState(() => {
    const index = (car?.colors ?? []).findIndex((colour) => colour.is_default);
    return index >= 0 ? index : 0;
  });

  function updateColour(index: number, patch: Partial<ColourRow>) {
    setColours((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function addColour() {
    setColours((prev) =>
      prev.length >= MAX_COLOURS
        ? prev
        : [
            ...prev,
            {
              key: nextColourKey(),
              name: "",
              hex: "#0A0A0A",
              gallery: "",
              isDefault: prev.length === 0,
            },
          ]
    );
  }

  function removeColour(index: number) {
    setColours((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setDefaultIndex((current) => {
        if (current === index) return 0;
        if (current > index) return current - 1;
        return current;
      });
      return next;
    });
  }

  // gallery_urls disimpan sebagai array di DB; textarea pakai satu URL/baris.
  const galleryValue = row?.gallery_urls?.join("\n") ?? "";

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className="flex flex-col gap-10 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-10"
    >
      {/* ============ KELOMPOK 1: IDENTITAS ============ */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-sm font-medium tracking-tight text-zinc-100">
            Identity
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            What the listing is called and where it lives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Name"
            name="name"
            tone="dark"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Bentley Continental GT Speed"
            error={state.fieldErrors?.name}
            required
          />
          {/* Slug read-only: mengikuti name. Hidden field dikirim ke action. */}
          <Input
            label="Slug"
            name="slug"
            tone="dark"
            value={slug}
            readOnly
            tabIndex={-1}
            placeholder="bentley-continental-gt-speed"
            helperText="Auto-generated from the name. Editing the name changes the public URL."
            error={state.fieldErrors?.slug}
            className="cursor-not-allowed text-zinc-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="brand_id"
              className="text-sm font-medium tracking-tight text-zinc-200"
            >
              Brand
            </label>
            <select
              id="brand_id"
              name="brand_id"
              defaultValue={row?.brand_id ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="" className="bg-zinc-900">
                Unassigned
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id} className="bg-zinc-900">
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Year"
            name="year"
            type="number"
            tone="dark"
            defaultValue={row?.year ?? new Date().getFullYear()}
            min={1900}
            max={2100}
            error={state.fieldErrors?.year}
            required
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="text-sm font-medium tracking-tight text-zinc-200"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={row?.status ?? "available"}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-zinc-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Price (IDR)"
          name="price_idr"
          type="number"
          tone="dark"
          defaultValue={row?.price_idr ?? ""}
          min={0}
          placeholder="8750000000"
          helperText="Leave empty to display “Ask Us” on the listing."
          error={state.fieldErrors?.price_idr}
        />
      </section>

      {/* ============ KELOMPOK 2: SPESIFIKASI ============ */}
      <section className="flex flex-col gap-5 border-t border-white/8 pt-10">
        <div>
          <h2 className="text-sm font-medium tracking-tight text-zinc-100">
            Specifications
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Performance and mechanical details. All fields optional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Engine"
            name="engine"
            tone="dark"
            defaultValue={row?.engine ?? ""}
            placeholder="6.0L W12 Twin-Turbo"
            error={state.fieldErrors?.engine}
          />
          <Input
            label="Transmission"
            name="transmission"
            tone="dark"
            defaultValue={row?.transmission ?? ""}
            placeholder="8-Speed Dual-Clutch"
            error={state.fieldErrors?.transmission}
          />
          <Input
            label="Drivetrain"
            name="drivetrain"
            tone="dark"
            defaultValue={row?.drivetrain ?? ""}
            placeholder="All-Wheel Drive"
            error={state.fieldErrors?.drivetrain}
          />
          <Input
            label="Mileage (km)"
            name="mileage_km"
            type="number"
            tone="dark"
            defaultValue={row?.mileage_km ?? ""}
            min={0}
            placeholder="7420"
            error={state.fieldErrors?.mileage_km}
          />
          <Input
            label="Power (hp)"
            name="power_hp"
            type="number"
            tone="dark"
            defaultValue={row?.power_hp ?? ""}
            min={0}
            placeholder="650"
            error={state.fieldErrors?.power_hp}
          />
          <Input
            label="Torque (Nm)"
            name="torque_nm"
            type="number"
            tone="dark"
            defaultValue={row?.torque_nm ?? ""}
            min={0}
            placeholder="900"
            error={state.fieldErrors?.torque_nm}
          />
          <Input
            label="0–100 km/h (seconds)"
            name="acceleration_0_100"
            type="number"
            step="0.1"
            tone="dark"
            defaultValue={row?.acceleration_0_100 ?? ""}
            min={0}
            placeholder="3.9"
            error={state.fieldErrors?.acceleration_0_100}
          />
          <Input
            label="Top speed (km/h)"
            name="top_speed_kmh"
            type="number"
            tone="dark"
            defaultValue={row?.top_speed_kmh ?? ""}
            min={0}
            placeholder="335"
            error={state.fieldErrors?.top_speed_kmh}
          />
        </div>

        {/* Interior: nama material + swatch hex. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Interior colour"
            name="interior_color"
            tone="dark"
            value={interiorColor}
            onChange={(event) => setInteriorColor(event.target.value)}
            placeholder="Kulit Coklat"
            error={state.fieldErrors?.interior_color}
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="interior_hex"
              className="text-sm font-medium tracking-tight text-zinc-200"
            >
              Interior swatch
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                aria-label="Interior colour picker"
                value={HEX_PATTERN.test(interiorHex) ? interiorHex : "#5C3A21"}
                onChange={(event) => setInteriorHex(event.target.value)}
                className="size-11 shrink-0 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03]"
              />
              <input
                id="interior_hex"
                name="interior_hex"
                value={interiorHex}
                onChange={(event) => setInteriorHex(event.target.value)}
                placeholder="#5C3A21"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERIOR_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setInteriorColor(preset.name);
                    setInteriorHex(preset.hex);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-amber-500/60 hover:text-amber-400"
                >
                  <span
                    className="size-3 rounded-full border border-white/20"
                    style={{ backgroundColor: preset.hex }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-medium tracking-tight text-zinc-200"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={row?.description ?? ""}
            placeholder="Provenance, service history, notable options…"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </section>

      {/* ============ KELOMPOK 3: COLOURS (car_colors) ============ */}
      <section className="flex flex-col gap-5 border-t border-white/8 pt-10">
        <div>
          <h2 className="text-sm font-medium tracking-tight text-zinc-100">
            Colours
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Each colour has its own gallery. One colour is the default.
          </p>
        </div>

        {/* Radio default (satu untuk seluruh grup). */}
        <input type="hidden" name="color_default" value={defaultIndex} />

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {colours.map((colour, index) => (
              <motion.div
                key={colour.key}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5"
              >
                {/* id lama (edit) dikirim tersembunyi. */}
                {colour.id ? (
                  <input type="hidden" name="color_id" value={colour.id} />
                ) : null}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                  <Input
                    label="Colour name"
                    name="color_name"
                    tone="dark"
                    value={colour.name}
                    onChange={(event) =>
                      updateColour(index, { name: event.target.value })
                    }
                    placeholder="Hijau Botol"
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium tracking-tight text-zinc-200">
                      Swatch
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        aria-label={`Colour picker ${index + 1}`}
                        value={
                          HEX_PATTERN.test(colour.hex) ? colour.hex : "#0A0A0A"
                        }
                        onChange={(event) =>
                          updateColour(index, { hex: event.target.value })
                        }
                        className="size-11 shrink-0 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03]"
                      />
                      <input
                        name="color_hex"
                        value={colour.hex}
                        onChange={(event) =>
                          updateColour(index, { hex: event.target.value })
                        }
                        placeholder="#0A0A0A"
                        className="w-32 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset warna eksterior (klik → nama + hex terisi). */}
                <div className="flex flex-wrap gap-2">
                  {EXTERIOR_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        updateColour(index, {
                          name: preset.name,
                          hex: preset.hex,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-amber-500/60 hover:text-amber-400"
                    >
                      <span
                        className="size-3 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.hex }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`color_gallery-${colour.key}`}
                    className="text-sm font-medium tracking-tight text-zinc-200"
                  >
                    Gallery for this colour
                  </label>
                  <textarea
                    id={`color_gallery-${colour.key}`}
                    name="color_gallery"
                    rows={3}
                    value={colour.gallery}
                    onChange={(event) =>
                      updateColour(index, { gallery: event.target.value })
                    }
                    placeholder="/images/cars/bentley-continental-gt-speed.jpg"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-xs text-zinc-500">One URL per line.</p>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="color_default_radio"
                      checked={defaultIndex === index}
                      onChange={() => setDefaultIndex(index)}
                      className="size-4 accent-amber-500"
                    />
                    <span className="text-sm text-zinc-300">
                      Default colour
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeColour(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400"
                  >
                    <Trash className="size-3.5" />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {colours.length < MAX_COLOURS ? (
          <button
            type="button"
            onClick={addColour}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-amber-500/60 hover:text-amber-400"
          >
            <Plus className="size-3.5" />
            Add colour
          </button>
        ) : (
          <p className="text-xs text-zinc-500">
            Maximum of {MAX_COLOURS} colours reached.
          </p>
        )}
      </section>

      {/* ============ KELOMPOK 4: PRESENTASI ============ */}
      <section className="flex flex-col gap-5 border-t border-white/8 pt-10">
        <div>
          <h2 className="text-sm font-medium tracking-tight text-zinc-100">
            Presentation
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            How the car appears in the showroom.
          </p>
        </div>

        <Input
          label="Cover image URL"
          name="cover_image_url"
          tone="dark"
          defaultValue={row?.cover_image_url}
          placeholder="/images/cars/bentley-continental-gt-speed.jpg"
          helperText="Shown as the main thumbnail across the site."
          error={state.fieldErrors?.cover_image_url}
          required
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="gallery_urls"
            className="text-sm font-medium tracking-tight text-zinc-200"
          >
            Gallery image URLs
          </label>
          <textarea
            id="gallery_urls"
            name="gallery_urls"
            rows={4}
            defaultValue={galleryValue}
            placeholder="/images/cars/bentley-continental-gt-speed.jpg&#10;/images/cars/bentley-flying-spur.jpg"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <p className="text-xs text-zinc-500">One URL per line.</p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={row?.is_featured ?? false}
            className="size-4 rounded border-white/20 bg-white/[0.03] accent-amber-500"
          />
          <span className="text-sm text-zinc-300">
            Feature on the homepage (max 4 shown)
          </span>
        </label>
      </section>

      {/* Feedback error morph tanpa lompatan layout. */}
      <AnimatePresence mode="wait" initial={false}>
        {state.error ? (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {state.error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <RippleButton
        type="submit"
        variant="gold"
        status={buttonStatus}
        successLabel="Saved"
        errorLabel="Try again"
        disabled={pending}
        className="w-full md:w-auto md:self-start"
      >
        {isEdit ? "Save changes" : "Add to collection"}
      </RippleButton>
    </motion.form>
  );
}
