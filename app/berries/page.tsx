// Next.js: Typ für die Seiten-<head>-Metadaten
import type { Metadata } from "next";

// Beeren-Karte mit Beerenkraft-Icon und Wachstumszeit
import BerryCard from "@/components/berry/BerryCard";
// Filter-Leiste (Typen/Stärke-Modal, Sortierung, Suche)
import BerryFilters from "@/components/berry/BerryFilters";
// Vollbreiter Gradient-Header mit Icon der aktuellen Sektion
import PageHeader from "@/components/layout/PageHeader";
// setzt --accent/--accent-2 (Farbverlauf) für diese Seite und ihre Portale (Filter-Modal, Dropdowns)
import SectionTheme from "@/components/layout/SectionTheme";
// Sticky Filterleiste unter dem Header
import StickyBar from "@/components/layout/StickyBar";
// Ausgelagerte Sortier-Whitelist und Props-Typ dieser Seite
import { BerriesPageProps, VALID_SORTS } from "@/app/berries/page.constants";
// Name/Icon/Farben dieser Sektion für Header und Theme
import { sections } from "@/config/sections";
// Lädt alle Beeren serverseitig (diese Seite paginiert noch nicht per Infinite Scroll)
import { getAllBerries, BerrySort } from "@/server/berry/berry.service";
// Typenliste für den Typ-Filter
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beeren",
  description: "Alle Beeren mit ihren Beerenkräften, Wachstumszeit und weiteren Eigenschaften.",
  alternates: { canonical: "/berries" },
};

export default async function BerriesPage({ searchParams }: BerriesPageProps) {
  const { search = "", types: typesParam = "", sort: sortParam, minPower: minPowerParam, maxPower: maxPowerParam } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const sort = VALID_SORTS.includes(sortParam as BerrySort) ? (sortParam as BerrySort) : "name-asc";

  const minPower = minPowerParam && Number.isFinite(Number(minPowerParam)) ? Number(minPowerParam) : undefined;
  const maxPower = maxPowerParam && Number.isFinite(Number(maxPowerParam)) ? Number(maxPowerParam) : undefined;

  const [berries, types] = await Promise.all([
    getAllBerries({ search, types: selectedTypes, sort, minPower, maxPower }),
    getAllTypes(),
  ]);

  return (
    <SectionTheme accent={sections.berries.accent} accent2={sections.berries.accent2}>
      <PageHeader section={sections.berries} count={berries.length} />

      <StickyBar>
        <BerryFilters types={types} search={search} selectedTypes={selectedTypes} sort={sort} minPower={minPower} maxPower={maxPower} />
      </StickyBar>

      <section>
        {berries.length === 0 ? (
          <p className="text-center text-slate-500">Keine Beeren gefunden.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 py-6">
            {berries.map((berry) => (
              <BerryCard key={berry.id} berry={berry} />
            ))}
          </div>
        )}
      </section>
    </SectionTheme>
  );
}
