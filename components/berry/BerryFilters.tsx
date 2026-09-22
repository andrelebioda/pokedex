"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import FilterSearchInput from "@/components/filters/FilterSearchInput";
import MultiSelectFilter from "@/components/filters/MultiSelectFilter";
import ResetFiltersButton from "@/components/filters/ResetFiltersButton";
import SortSelect from "@/components/filters/SortSelect";
import { TypeOption } from "@/components/pokemon/PokemonFilters";
import { BerrySort } from "@/server/berry/berry.service";

const SORT_OPTIONS: { value: BerrySort; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "growth", label: "Wachstum" },
];

interface BerryFiltersProps {
  types: TypeOption[];
  search: string;
  selectedTypes: string[];
  sort: BerrySort;
}

export default function BerryFilters({ types, search, selectedTypes, sort }: BerryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = useCallback(
    (next: { search?: string; types?: string[]; sort?: BerrySort }) => {
      const nextSearch = next.search ?? search;
      const nextTypes = next.types ?? selectedTypes;
      const nextSort = next.sort ?? sort;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextTypes.length > 0) params.set("types", nextTypes.join(","));
      if (nextSort !== "name") params.set("sort", nextSort);

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedTypes, sort, pathname, router],
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeout = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function toggleType(slug: string) {
    const nextTypes = selectedTypes.includes(slug) ? selectedTypes.filter((value) => value !== slug) : [...selectedTypes, slug];

    updateFilters({ types: nextTypes });
  }

  const hasActiveFilters = search.length > 0 || selectedTypes.length > 0 || sort !== "name";

  const sortedTypes = types.filter((option) => option.name !== "???").sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2.5">
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

        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Beere suchen…" className="lg:w-64" />
      </div>
    </div>
  );
}
