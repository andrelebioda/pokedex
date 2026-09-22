"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pillTrigger } from "@/components/filters/filterStyles";

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortSelectProps<T extends string> {
  value: T;
  options: SortOption<T>[];
  onChange: (value: T) => void;
}

export default function SortSelect<T extends string>({ value, options, onChange }: SortSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger
        className={`${pillTrigger} py-5 focus-visible:ring-0 [&>svg]:text-slate-500 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-900`}
      >
        Sortieren: <SelectValue />
      </SelectTrigger>

      <SelectContent className="border-slate-800 bg-slate-900 text-slate-200">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-slate-300 focus:bg-slate-800 focus:text-white">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
