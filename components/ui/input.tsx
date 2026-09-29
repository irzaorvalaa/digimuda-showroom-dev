import { useId } from "react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  helperText?: string;
  error?: string;
}

// Input form sesuai SKILL.md Rule 6: label di atas, helper opsional,
// error di bawah dengan gap-2. Focus ring emas agar senada aksen brand.
// ref diteruskan sebagai prop (React 19) untuk react-hook-form di Batch D.
export default function Input({
  label,
  helperText,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-sm font-medium tracking-tight text-zinc-900"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
            : "border-stone-200/60 focus:border-amber-500 focus:ring-amber-500/30",
          className
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-zinc-600">{helperText}</p>
      ) : null}
    </div>
  );
}
