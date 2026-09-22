"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import FilterSearchInput from "@/components/filters/FilterSearchInput";
import MultiSelectFilter from "@/components/filters/MultiSelectFilter";
import ResetFiltersButton from "@/components/filters/ResetFiltersButton";
import SortSelect from "@/components/filters/SortSelect";
import { AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

const SORT_OPTIONS: { value: AbilitySort; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "count", label: "Anzahl Pokémon" },
];

const HIDDEN_OPTIONS: { value: AbilityHiddenFilter; label: string }[] = [
  { value: "hidden", label: "Versteckt möglich" },
  { value: "visible", label: "Nicht versteckt" },
];

interface AbilityFiltersProps {
  search: string;
  selectedHidden: AbilityHiddenFilter[];
  sort: AbilitySort;
}

export default function AbilityFilters({ search, selectedHidden, sort }: AbilityFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = useCallback(
    (next: { search?: string; hidden?: AbilityHiddenFilter[]; sort?: AbilitySort }) => {
      const nextSearch = next.search ?? search;
      const nextHidden = next.hidden ?? selectedHidden;
      const nextSort = next.sort ?? sort;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextHidden.length > 0) params.set("hidden", nextHidden.join(","));
      if (nextSort !== "name") params.set("sort", nextSort);

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedHidden, sort, pathname, router],
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeout = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function toggleHidden(value: string) {
    const option = value as AbilityHiddenFilter;
    const nextHidden = selectedHidden.includes(option) ? selectedHidden.filter((entry) => entry !== option) : [...selectedHidden, option];

    updateFilters({ hidden: nextHidden });
  }

  const hasActiveFilters = search.length > 0 || selectedHidden.length > 0 || sort !== "name";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2.5">
        <MultiSelectFilter
          label="ausgewählt"
          allLabel="Versteckt & sichtbar"
          options={HIDDEN_OPTIONS}
          selected={selectedHidden}
          onToggle={toggleHidden}
          columns={1}
          contentClassName="w-60"
          triggerClassName="w-48"
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

        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Fähigkeit suchen…" className="lg:w-64" />
      </div>
    </div>
  );
}
