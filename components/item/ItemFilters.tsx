"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import FilterSearchInput from "@/components/filters/FilterSearchInput";
import MultiSelectFilter from "@/components/filters/MultiSelectFilter";
import ResetFiltersButton from "@/components/filters/ResetFiltersButton";
import { ItemCategoryOption } from "@/server/item/item.service";

interface ItemFiltersProps {
  categories: ItemCategoryOption[];
  search: string;
  selectedCategories: string[];
}

export default function ItemFilters({ categories, search, selectedCategories }: ItemFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = useCallback(
    (next: { search?: string; categories?: string[] }) => {
      const nextSearch = next.search ?? search;
      const nextCategories = next.categories ?? selectedCategories;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextCategories.length > 0) params.set("categories", nextCategories.join(","));

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedCategories, pathname, router],
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeout = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function toggleCategory(slug: string) {
    const nextCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((value) => value !== slug)
      : [...selectedCategories, slug];

    updateFilters({ categories: nextCategories });
  }

  const hasActiveFilters = search.length > 0 || selectedCategories.length > 0;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2.5">
        <MultiSelectFilter
          label="Kategorien"
          allLabel="Alle Kategorien"
          options={categories.map((option) => ({ value: option.slug, label: option.name }))}
          selected={selectedCategories}
          onToggle={toggleCategory}
          columns={2}
          contentClassName="w-80"
          triggerClassName="w-40"
        />
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

        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Item suchen…" className="lg:w-64" />
      </div>
    </div>
  );
}
