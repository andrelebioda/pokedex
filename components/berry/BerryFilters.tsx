"use client";

// Next.js: aktuelle Route lesen und URL-Query beim Filtern aktualisieren
import { usePathname, useRouter } from "next/navigation";
// React: Filter-State, Debounce-Effekt, stabile Callback-Referenz
import { useCallback, useEffect, useState } from "react";

// Aufklappbare Filter-Gruppe im Modal (Typen; Stärke aktuell pausiert, siehe unten)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// Checkbox-Raster für die Typ-Optionen
import FilterCheckboxGroup from "@/components/filters/FilterCheckboxGroup";
// Modal-Hülle (Trigger-Button, Anwenden/Zurücksetzen) für alle Filter zusammen
import FilterModal from "@/components/filters/FilterModal";
// Freitext-Suchfeld mit Lösch-Icon
import FilterSearchInput from "@/components/filters/FilterSearchInput";
// Sortier-Dropdown (Radio-Gruppen mit Trennlinien)
import SortSelect from "@/components/filters/SortSelect";
// Ausgelagerte Sortier-Optionen und Props-Typ dieser Komponente
import { BerryFiltersProps, SORT_GROUPS } from "@/components/berry/BerryFilters.constants";

export default function BerryFilters({ types, search, selectedTypes, sort, minPower, maxPower }: BerryFiltersProps) {
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
  const [pendingMinPower, setPendingMinPower] = useState(minPower);
  const [pendingMaxPower, setPendingMaxPower] = useState(maxPower);

  const updateFilters = useCallback(
    (next: {
      search?: string;
      types?: string[];
      sort?: BerryFiltersProps["sort"];
      minPower?: number | null;
      maxPower?: number | null;
    }) => {
      const nextSearch = next.search ?? search;
      const nextTypes = next.types ?? selectedTypes;
      const nextSort = next.sort ?? sort;
      const nextMinPower = "minPower" in next ? (next.minPower ?? undefined) : minPower;
      const nextMaxPower = "maxPower" in next ? (next.maxPower ?? undefined) : maxPower;

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextTypes.length > 0) params.set("types", nextTypes.join(","));
      if (nextSort !== "name-asc") params.set("sort", nextSort);
      if (nextMinPower != null) params.set("minPower", String(nextMinPower));
      if (nextMaxPower != null) params.set("maxPower", String(nextMaxPower));

      router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    },
    [search, selectedTypes, sort, minPower, maxPower, pathname, router],
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
      setPendingTypes(selectedTypes);
      setPendingMinPower(minPower);
      setPendingMaxPower(maxPower);
    }

    setModalOpen(open);
  }

  function togglePendingType(slug: string) {
    setPendingTypes((prev) => (prev.includes(slug) ? prev.filter((value) => value !== slug) : [...prev, slug]));
  }

  const activeFilterCount = selectedTypes.length + (minPower != null || maxPower != null ? 1 : 0);

  const sortedTypes = types.filter((option) => option.name !== "???").sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex gap-3 flex-row items-center justify-between">
      <div className="flex items-center gap-2.5">
        <FilterModal
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          activeCount={activeFilterCount}
          onApply={() => updateFilters({ types: pendingTypes, minPower: pendingMinPower ?? null, maxPower: pendingMaxPower ?? null })}
          onReset={() => {
            setPendingTypes([]);
            setPendingMinPower(undefined);
            setPendingMaxPower(undefined);
            updateFilters({ types: [], minPower: null, maxPower: null });
          }}
        >
          <Accordion type="multiple" defaultValue={["types", "power"]}>
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

            {/* <AccordionItem value="power">
              <AccordionTrigger className="text-white">Stärke (Kraftnatur)</AccordionTrigger>

              <AccordionContent>
                <FilterRangeInput
                  min={pendingMinPower}
                  max={pendingMaxPower}
                  onChange={(min, max) => {
                    setPendingMinPower(min);
                    setPendingMaxPower(max);
                  }}
                />
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </FilterModal>

        <SortSelect value={sort} groups={SORT_GROUPS} onChange={(value) => updateFilters({ sort: value })} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <FilterSearchInput value={searchInput} onChange={setSearchInput} placeholder="Beere suchen…" className="lg:w-64" />
      </div>
    </div>
  );
}
