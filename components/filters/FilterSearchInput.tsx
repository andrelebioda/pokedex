"use client";

import { Search, X } from "lucide-react";

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export default function FilterSearchInput({ value, onChange, placeholder, className = "" }: FilterSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/50" size={16} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-full
          border
          border-white/10
          bg-white/5
          py-2.5
          pr-10
          pl-10
          text-[16px]
          text-white
          placeholder:text-white/40
          shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]
          backdrop-blur-md
          transition
          hover:border-white/20
          focus:border-[color-mix(in_oklab,var(--accent,#ef4444)_70%,transparent)]
          focus:bg-white/10
          focus:ring-4
          focus:ring-[color-mix(in_oklab,var(--accent,#ef4444)_20%,transparent)]
          focus:outline-none
          h-10
          md:h-11
        "
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Suche löschen"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 transition hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
