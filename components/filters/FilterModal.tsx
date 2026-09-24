"use client";

import { SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { pillTrigger } from "@/components/filters/filterStyles";

interface FilterModalProps {
  title?: string;
  activeCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onReset: () => void;
  children: ReactNode;
}

export default function FilterModal({ title = "Filter", activeCount, open, onOpenChange, onApply, onReset, children }: FilterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button type="button" aria-label={title} className={pillTrigger}>
          <SlidersHorizontal size={16} />
          <span className="hidden md:block">Filter</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden border border-slate-800 bg-slate-900 p-0 text-slate-200 sm:max-w-md">
        <DialogHeader className="border-b border-slate-800 px-5 py-4">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-2">{children}</div>

        <DialogFooter className="flex-row justify-between gap-3 rounded-b-xl border-t border-slate-800 bg-slate-900 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              setTimeout(onReset, 0);
            }}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Zurücksetzen
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              setTimeout(onApply, 0);
            }}
            className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Anwenden
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
