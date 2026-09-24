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
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      <X size={16} />
      Filter zurücksetzen
    </button>
  );
}
