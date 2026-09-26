"use client";

// Next.js: aktuelle Route lesen und URL-Query beim Filtern aktualisieren
import { usePathname, useRouter } from "next/navigation";
// React: Filter-State, Debounce-Effekt, stabile Callback-Referenz
import { useCallback, useEffect, useState } from "react";

// Aufklappbare Filter-Gruppe im Modal (Sichtbarkeit)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// Checkbox-Raster für die Sichtbarkeits-Optionen
import FilterCheckboxGroup from "@/components/filters/FilterCheckboxGroup";
// Modal-Hülle (Trigger-Button, Anwenden/Zurücksetzen) für alle Filter zusammen
import FilterModal from "@/components/filters/FilterModal";
// Freitext-Suchfeld mit Lösch-Icon
import FilterSearchInput from "@/components/filters/FilterSearchInput";
// Sortier-Dropdown (Radio-Gruppen mit Trennlinien)
import SortSelect from "@/components/filters/SortSelect";
// Ausgelagerte Sortier-/Sichtbarkeits-Optionen und Props-Typ dieser Komponente
import { AbilityFiltersProps, HIDDEN_OPTIONS, SORT_GROUPS } from "@/components/ability/AbilityFilters.constants";
import { AbilityHiddenFilter } from "@/server/ability/ability.service";

export default function AbilityFilters({ search, selectedHidden, sort }: AbilityFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(search);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingHidden, setPendingHidden] = useState(selectedHidden);

  const updateFilters = useCallback(
    (next: { search?: string; hidden?: AbilityHiddenFilter[]; sort?: AbilityFiltersProps["sort"] }) => {
      const nextSearch = next.search ?? search;
      const nextHidden = next.hidden ?? selectedHidden;
      const nextSort = next.sort ?? sort;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextHidden.length > 0) params.set("hidden", nextHidden.join(","));
      if (nextSort !== "name-asc") params.set("sort", nextSort);

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

  function handleModalOpenChange(open: boolean) {
    if (open) {
      setPendingHidden(selectedHidden);
    }

    setModalOpen(open);
  }

  function togglePendingHidden(value: string) {
    const option = value as AbilityHiddenFilter;
    setPendingHidden((prev) => (prev.includes(option) ? prev.filter((entry) => entry !== option) : [...prev, option]));
  }

  return (
    <div className="flex gap-3 flex-row items-center justify-between">
      <div className="flex items-center gap-2.5">
        <FilterModal
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          activeCount={selectedHidden.length}
          onApply={() => updateFilters({ hidden: pendingHidden })}
          onReset={() => {
            setPendingHidden([]);
            updateFilters({ hidden: [] });
          }}
        >
          <Accordion type="multiple" defaultValue={["hidden"]}>
            <AccordionItem value="hidden">
              <AccordionTrigger className="text-white">
                Sichtbarkeit
                {pendingHidden.length > 0 && <span className="ml-2 text-xs text-slate-500">({pendingHidden.length})</span>}
              </AccordionTrigger>

              <AccordionContent>
                <FilterCheckboxGroup options={HIDDEN_OPTIONS} selected={pendingHidden} onToggle={togglePendingHidden} columns={1} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FilterModal>

        <SortSelect value={sort} groups={SORT_GROUPS} onChange={(value) => updateFilters({ sort: value })} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Fähigkeit suchen…" className="lg:w-64" />
      </div>
    </div>
  );
}
