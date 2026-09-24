"use client";

import { accentCheckbox } from "@/components/filters/filterStyles";
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterCheckboxOption {
  value: string;
  label: string;
}

interface FilterCheckboxGroupProps {
  options: FilterCheckboxOption[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: 1 | 2 | 3;
}

export default function FilterCheckboxGroup({ options, selected, onToggle, columns = 2 }: FilterCheckboxGroupProps) {
  return (
    <div className={`grid gap-x-3 gap-y-1 ${columns === 3 ? "grid-cols-3" : columns === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {options.map((option) => {
        const active = selected.includes(option.value);

        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm md:text-[16px] text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Checkbox
              checked={active}
              onCheckedChange={() => onToggle(option.value)}
              className={accentCheckbox}
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
