"use client";

import { X } from "lucide-react";

interface ResetFiltersButtonProps {
  onClick: () => void;
}

export default function ResetFiltersButton({ onClick }: ResetFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
    >
      <X size={16} />
      Filter zurücksetzen
    </button>
  );
}
