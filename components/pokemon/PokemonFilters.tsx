"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getPokemonTypeClass } from "@/config/pokemonTypes";

export interface TypeOption {
  slug: string;
  name: string;
}

interface PokemonFiltersProps {
  types: TypeOption[];
  search: string;
  selectedTypes: string[];
}

export default function PokemonFilters({ types, search, selectedTypes }: PokemonFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = useCallback(
    (next: { search?: string; types?: string[] }) => {
      const nextSearch = next.search ?? search;
      const nextTypes = next.types ?? selectedTypes;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextTypes.length > 0) params.set("types", nextTypes.join(","));

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedTypes, pathname, router],
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

  const hasActiveFilters = search.length > 0 || selectedTypes.length > 0;

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
            placeholder="Pokémon suchen…"
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

      <div className="flex flex-wrap gap-2">
        {types
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((option) => {
            return option.name != "???";
          })
          .map((option) => {
            const active = selectedTypes.includes(option.slug);

            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => toggleType(option.slug)}
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
                    ? `border-transparent text-white shadow-lg ${getPokemonTypeClass(option.slug)}`
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
