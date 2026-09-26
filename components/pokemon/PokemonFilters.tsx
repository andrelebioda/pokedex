"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FilterCheckboxGroup from "@/components/filters/FilterCheckboxGroup";
import FilterModal from "@/components/filters/FilterModal";
import FilterSearchInput from "@/components/filters/FilterSearchInput";
import SortSelect from "@/components/filters/SortSelect";
import { PokemonSort } from "@/server/pokemon/pokemon.service";

export interface TypeOption {
  slug: string;
  name: string;
}

const SORT_GROUPS: { value: PokemonSort; label: string }[][] = [
  [
    { value: "number-asc", label: "Nummer (↑)" },
    { value: "number-desc", label: "Nummer (↓)" },
  ],
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
  [
    { value: "type-asc", label: "Typ (A-Z)" },
    { value: "type-desc", label: "Typ (Z-A)" },
  ],
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

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTypes, setPendingTypes] = useState(selectedTypes);
  const [pendingGenerations, setPendingGenerations] = useState(selectedGenerations);

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
      if (nextSort !== "number-asc") params.set("sort", nextSort);

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

  function handleModalOpenChange(open: boolean) {
    if (open) {
      setPendingTypes(selectedTypes);
      setPendingGenerations(selectedGenerations);
    }

    setModalOpen(open);
  }

  function togglePendingType(slug: string) {
    setPendingTypes((prev) => (prev.includes(slug) ? prev.filter((value) => value !== slug) : [...prev, slug]));
  }

  function togglePendingGeneration(value: string) {
    const generation = Number(value);
    setPendingGenerations((prev) => (prev.includes(generation) ? prev.filter((entry) => entry !== generation) : [...prev, generation]));
  }

  const activeFilterCount = selectedTypes.length + selectedGenerations.length;

  const sortedTypes = types.filter((option) => option.name !== "???").sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-row gap-3 items-center justify-between">
      <div className="flex items-center gap-2.5">
        <FilterModal
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          activeCount={activeFilterCount}
          onApply={() => updateFilters({ types: pendingTypes, generations: pendingGenerations })}
          onReset={() => {
            setPendingTypes([]);
            setPendingGenerations([]);
            updateFilters({ types: [], generations: [] });
          }}
        >
          <Accordion type="multiple" defaultValue={["generations", "types"]}>
            <AccordionItem value="generations">
              <AccordionTrigger className="text-white">
                Generationen
                {pendingGenerations.length > 0 && <span className="ml-2 text-xs text-slate-500">({pendingGenerations.length})</span>}
              </AccordionTrigger>

              <AccordionContent>
                <FilterCheckboxGroup
                  options={GENERATION_OPTIONS}
                  selected={pendingGenerations.map(String)}
                  onToggle={togglePendingGeneration}
                  columns={3}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="types">
              <AccordionTrigger className="text-white">
                Typen
                {pendingTypes.length > 0 && <span className="ml-2 text-xs text-slate-500">({pendingTypes.length})</span>}
              </AccordionTrigger>

              <AccordionContent>
                <FilterCheckboxGroup
                  options={sortedTypes.map((option) => ({ value: option.slug, label: option.name }))}
                  selected={pendingTypes}
                  onToggle={togglePendingType}
                  columns={3}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FilterModal>

        <SortSelect value={sort} groups={SORT_GROUPS} onChange={(value) => updateFilters({ sort: value })} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Suchen…" className="lg:w-84" />
      </div>
    </div>
  );
}
