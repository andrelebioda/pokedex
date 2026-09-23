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
import { pillTrigger } from "@/components/filters/filterStyles";

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
  const activeLabel = groups.flat().find((option) => option.value === value)?.label ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={`${pillTrigger} whitespace-nowrap pr-8`}>
          {activeLabel}
          <ChevronDown size={16} className="absolute right-3 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="mt-2 w-56 border-slate-800 bg-slate-900 text-slate-200">
        <DropdownMenuLabel className="text-slate-500">Sortieren nach</DropdownMenuLabel>

        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <DropdownMenuSeparator className="bg-slate-800" />}

            {group.map((option) => {
              const active = option.value === value;

              return (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={(event) => event.preventDefault()}
                  onClick={() => onChange(option.value)}
                  className="gap-2.5 py-1.5 text-slate-300 focus:bg-slate-800 focus:text-white"
                >
                  <span className="flex size-3.5 shrink-0 items-center justify-center">
                    {active && <span className="size-1.5 rounded-full bg-white" />}
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
