"use client";

interface FilterRangeInputProps {
  min: number | undefined;
  max: number | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export default function FilterRangeInput({ min, max, onChange, minPlaceholder = "Min", maxPlaceholder = "Max" }: FilterRangeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={min ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value), max)}
        placeholder={minPlaceholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:border-(--accent,#ef4444) focus:outline-none"
      />

      <span className="shrink-0 text-slate-600">–</span>

      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={max ?? ""}
        onChange={(event) => onChange(min, event.target.value === "" ? undefined : Number(event.target.value))}
        placeholder={maxPlaceholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:border-(--accent,#ef4444) focus:outline-none"
      />
    </div>
  );
}
