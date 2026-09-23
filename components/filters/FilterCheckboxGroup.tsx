"use client";

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
            className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
          >
            <Checkbox
              checked={active}
              onCheckedChange={() => onToggle(option.value)}
              className="border-slate-600 bg-transparent data-checked:border-red-500 data-checked:bg-red-500 data-checked:text-white dark:border-slate-600 dark:bg-transparent dark:data-checked:border-red-500 dark:data-checked:bg-red-500 dark:data-checked:text-white"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
