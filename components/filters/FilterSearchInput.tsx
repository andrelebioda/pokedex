"use client";

import { Search } from "lucide-react";

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export default function FilterSearchInput({ value, onChange, placeholder, className = "" }: FilterSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" size={16} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-full
          border
          border-slate-800
          bg-slate-900
          py-2.5
          pr-4
          pl-10
          text-[16px]
          text-white
          placeholder:text-slate-500
          focus:border-red-500
          focus:outline-none
        "
      />
    </div>
  );
}
