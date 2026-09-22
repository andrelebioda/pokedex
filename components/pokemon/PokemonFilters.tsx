"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import FilterSearchInput from "@/components/filters/FilterSearchInput";
import MultiSelectFilter from "@/components/filters/MultiSelectFilter";
import ResetFiltersButton from "@/components/filters/ResetFiltersButton";
import SortSelect from "@/components/filters/SortSelect";
import { PokemonSort } from "@/server/pokemon/pokemon.service";

export interface TypeOption {
  slug: string;
  name: string;
}

const SORT_OPTIONS: { value: PokemonSort; label: string }[] = [
  { value: "number", label: "Nummer" },
  { value: "name", label: "Name" },
  { value: "type", label: "Typ" },
];

const GENERATION_OPTIONS = [
  { value: "1", label: "Gen. 1" },
  { value: "2", label: "Gen. 2" },
  { value: "3", label: "Gen. 3" },
  { value: "4", label: "Gen. 4" },
  { value: "5", label: "Gen. 5" },
  { value: "6", label: "Gen. 6" },
  { value: "7", label: "Gen. 7" },
  { value: "8", label: "Gen. 8" },
  { value: "9", label: "Gen. 9" },
];

interface PokemonFiltersProps {
  types: TypeOption[];
  search: string;
  selectedTypes: string[];
  selectedGenerations: number[];
  sort: PokemonSort;
}

export default function PokemonFilters({ types, search, selectedTypes, selectedGenerations, sort }: PokemonFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = useCallback(
    (next: { search?: string; types?: string[]; generations?: number[]; sort?: PokemonSort }) => {
      const nextSearch = next.search ?? search;
      const nextTypes = next.types ?? selectedTypes;
      const nextGenerations = next.generations ?? selectedGenerations;
      const nextSort = next.sort ?? sort;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextTypes.length > 0) params.set("types", nextTypes.join(","));
      if (nextGenerations.length > 0) params.set("generations", nextGenerations.join(","));
      if (nextSort !== "number") params.set("sort", nextSort);

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedTypes, selectedGenerations, sort, pathname, router],
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeout = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, search, updateFilters]);

  function toggleType(slug: string) {
    const nextTypes = selectedTypes.includes(slug) ? selectedTypes.filter((value) => value !== slug) : [...selectedTypes, slug];

    updateFilters({ types: nextTypes });
  }

  function toggleGeneration(value: string) {
    const generation = Number(value);
    const nextGenerations = selectedGenerations.includes(generation)
      ? selectedGenerations.filter((entry) => entry !== generation)
      : [...selectedGenerations, generation];

    updateFilters({ generations: nextGenerations });
  }

  const hasActiveFilters = search.length > 0 || selectedTypes.length > 0 || selectedGenerations.length > 0 || sort !== "number";

  const sortedTypes = types.filter((option) => option.name !== "???").sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2.5">
        <MultiSelectFilter
          label="Generationen"
          allLabel="Alle Generationen"
          options={GENERATION_OPTIONS}
          selected={selectedGenerations.map(String)}
          onToggle={toggleGeneration}
          contentClassName="w-80"
          triggerClassName="w-42"
        />

        <MultiSelectFilter
          label="Typen"
          allLabel="Alle Typen"
          options={sortedTypes.map((option) => ({ value: option.slug, label: option.name }))}
          selected={selectedTypes}
          onToggle={toggleType}
          contentClassName="w-96"
          triggerClassName="w-32"
        />

        <SortSelect value={sort} options={SORT_OPTIONS} onChange={(value) => updateFilters({ sort: value })} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {hasActiveFilters && (
          <ResetFiltersButton
            onClick={() => {
              setSearchInput("");
              router.push(pathname);
            }}
          />
        )}

        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Suchen…" className="lg:w-84" />
      </div>
    </div>
  );
}
