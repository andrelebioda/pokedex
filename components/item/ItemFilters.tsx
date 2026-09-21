"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  }, [searchInput, search, updateFilters]);

  function toggleCategory(slug: string) {
    const nextCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((value) => value !== slug)
      : [...selectedCategories, slug];

    updateFilters({ categories: nextCategories });
  }

  const hasActiveFilters = search.length > 0 || selectedCategories.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="
              pointer-events-none
              absolute
              top-1/2
              left-4
              -translate-y-1/2
              text-slate-500
            "
            size={18}
          />

          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Item suchen…"
            className="
              w-full
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              py-3
              pr-4
              pl-11
              text-white
              placeholder:text-slate-500
              focus:border-red-500
              focus:outline-none
            "
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              router.push(pathname);
            }}
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              px-4
              py-3
              text-sm
              text-slate-300
              transition
              hover:border-slate-700
              hover:text-white
            "
          >
            <X size={16} />
            Filter zurücksetzen
          </button>
        )}
      </div>

      <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
        {categories.map((option) => {
          const active = selectedCategories.includes(option.slug);

          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => toggleCategory(option.slug)}
              aria-pressed={active}
              className={`
                flex
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-semibold
                transition-all
                ${
                  active
                    ? "border-transparent bg-red-500 text-white shadow-lg"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white"
                }
              `}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
