"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FilterCheckboxGroup from "@/components/filters/FilterCheckboxGroup";
import FilterModal from "@/components/filters/FilterModal";
import FilterSearchInput from "@/components/filters/FilterSearchInput";
import ResetFiltersButton from "@/components/filters/ResetFiltersButton";
import SortSelect from "@/components/filters/SortSelect";
import { ItemCategoryOption, ItemSort } from "@/server/item/item.service";

const SORT_GROUPS: { value: ItemSort; label: string }[][] = [
  [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
];

interface ItemFiltersProps {
  categories: ItemCategoryOption[];
  search: string;
  selectedCategories: string[];
  sort: ItemSort;
}

export default function ItemFilters({ categories, search, selectedCategories, sort }: ItemFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCategories, setPendingCategories] = useState(selectedCategories);

  const updateFilters = useCallback(
    (next: { search?: string; categories?: string[]; sort?: ItemSort }) => {
      const nextSearch = next.search ?? search;
      const nextCategories = next.categories ?? selectedCategories;
      const nextSort = next.sort ?? sort;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextCategories.length > 0) params.set("categories", nextCategories.join(","));
      if (nextSort !== "name-asc") params.set("sort", nextSort);

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedCategories, sort, pathname, router],
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeout = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function handleModalOpenChange(open: boolean) {
    if (open) {
      setPendingCategories(selectedCategories);
    }

    setModalOpen(open);
  }

  function togglePendingCategory(slug: string) {
    setPendingCategories((prev) => (prev.includes(slug) ? prev.filter((value) => value !== slug) : [...prev, slug]));
  }

  const hasActiveFilters = search.length > 0 || selectedCategories.length > 0 || sort !== "name-asc";

  return (
    <div className="flex gap-3 flex-row items-center justify-between">
      <div className="flex items-center gap-2.5">
        <FilterModal
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          activeCount={selectedCategories.length}
          onApply={() => updateFilters({ categories: pendingCategories })}
          onReset={() => {
            setPendingCategories([]);
            updateFilters({ categories: [] });
          }}
        >
          <Accordion type="multiple" defaultValue={["categories"]}>
            <AccordionItem value="categories">
              <AccordionTrigger className="text-white">
                Kategorien
                {pendingCategories.length > 0 && <span className="ml-2 text-xs text-slate-500">({pendingCategories.length})</span>}
              </AccordionTrigger>

              <AccordionContent>
                <FilterCheckboxGroup
                  options={categories.map((option) => ({ value: option.slug, label: option.name }))}
                  selected={pendingCategories}
                  onToggle={togglePendingCategory}
                  columns={2}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FilterModal>

        <SortSelect value={sort} groups={SORT_GROUPS} onChange={(value) => updateFilters({ sort: value })} />
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
