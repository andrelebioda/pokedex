"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { accentCheckbox, glassPopover, pillTrigger } from "@/components/filters/filterStyles";
import { useSectionThemeStyle } from "@/components/layout/SectionTheme";

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
  const themeStyle = useSectionThemeStyle();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={`${pillTrigger} ${triggerClassName}`}>
          {selected.length === 0 ? allLabel : `${selected.length} ${label}`}
          <ChevronDown size={16} className="absolute right-3 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" style={themeStyle} className={`mt-2 ${glassPopover} ${contentClassName}`}>
        <div className={`grid gap-x-2 gap-y-1 ${columns === 2 ? "grid-cols-2" : columns === 1 ? "grid-cols-1" : "grid-cols-3"} p-2`}>
          {options.map((option) => {
            const active = selected.includes(option.value);

            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={(event) => event.preventDefault()}
                onClick={() => onToggle(option.value)}
                className="gap-2 text-slate-300 focus:bg-white/10 focus:text-white"
              >
                <Checkbox
                  checked={active}
                  className={`pointer-events-none ${accentCheckbox}`}
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
