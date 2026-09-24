"use client";

import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { glassPopover, pillTrigger } from "@/components/filters/filterStyles";
import { useSectionThemeStyle } from "@/components/layout/SectionTheme";

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortSelectProps<T extends string> {
  value: T;
  groups: SortOption<T>[][];
  onChange: (value: T) => void;
}

export default function SortSelect<T extends string>({ value, groups, onChange }: SortSelectProps<T>) {
  const themeStyle = useSectionThemeStyle();
  const activeLabel = groups.flat().find((option) => option.value === value)?.label ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={`${pillTrigger} whitespace-nowrap pr-8 max-md:w-22.5`}>
          <span className="truncate">{activeLabel}</span>
          <ChevronDown size={16} className="absolute right-3 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" style={themeStyle} className={`mt-2 w-56 ${glassPopover}`}>
        <DropdownMenuLabel className="text-slate-500">Sortieren nach</DropdownMenuLabel>

        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <DropdownMenuSeparator className="bg-white/10" />}

            {group.map((option) => {
              const active = option.value === value;

              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onChange(option.value)}
                  className="gap-2.5 py-1.5 text-slate-300 focus:bg-white/10 focus:text-white text-sm md:text-[16px] data-[state=open]:bg-white/10 data-[state=open]:text-white"
                >
                  <span className="flex size-3.5 shrink-0 items-center justify-center">
                    {active && <span className="size-2 rounded-full bg-(--accent,#ef4444) shadow-[0_0_8px_var(--accent,#ef4444)]" />}
                  </span>
                  {option.label}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
