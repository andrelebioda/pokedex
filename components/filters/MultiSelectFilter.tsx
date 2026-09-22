"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { pillTrigger } from "@/components/filters/filterStyles";

export interface MultiSelectOption {
  value: string;
  label: string;
  indicator?: ReactNode;
}

interface MultiSelectFilterProps {
  label: string;
  allLabel: string;
  options: MultiSelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: 1 | 2 | 3;
  contentClassName?: string;
  triggerClassName?: string;
}

export default function MultiSelectFilter({
  label,
  allLabel,
  options,
  selected,
  onToggle,
  columns = 3,
  contentClassName = "w-80",
  triggerClassName = "",
}: MultiSelectFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={`${pillTrigger} ${triggerClassName}`}>
          {selected.length === 0 ? allLabel : `${selected.length} ${label}`}
          <ChevronDown size={16} className="absolute right-3 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className={`mt-2 border-slate-800 bg-slate-900 text-slate-200 ${contentClassName}`}>
        <div className={`grid gap-x-2 gap-y-1 ${columns === 2 ? "grid-cols-2" : columns === 1 ? "grid-cols-1" : "grid-cols-3"} p-2`}>
          {options.map((option) => {
            1;
            const active = selected.includes(option.value);

            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={(event) => event.preventDefault()}
                onClick={() => onToggle(option.value)}
                className="gap-2 text-slate-300 focus:bg-slate-800 focus:text-white"
              >
                <Checkbox
                  checked={active}
                  className="pointer-events-none border-slate-600 bg-transparent data-checked:border-red-500 data-checked:bg-red-500 data-checked:text-white dark:border-slate-600 dark:bg-transparent dark:data-checked:border-red-500 dark:data-checked:bg-red-500 dark:data-checked:text-white"
                />
                {option.indicator}
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
