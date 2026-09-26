// Next.js: Typ für die Seiten-<head>-Metadaten
import type { Metadata } from "next";

// Vollbreiter Gradient-Header mit Icon der aktuellen Sektion
import PageHeader from "@/components/layout/PageHeader";
// setzt --accent/--accent-2 (Farbverlauf) für diese Seite und ihre Portale (Filter-Modal, Dropdowns)
import SectionTheme from "@/components/layout/SectionTheme";
// Sticky Filterleiste unter dem Header
import StickyBar from "@/components/layout/StickyBar";
// Infinite-Scroll-Grid der Attacken-Karten
import MoveExplorer from "@/components/move/MoveExplorer";
// Filter-Leiste (Typen/Stärke-Modal, Sortierung, Suche)
import MoveFilters from "@/components/move/MoveFilters";
// Ausgelagerte Seitengröße, Sortier-Whitelist und Props-Typ dieser Seite
import { LIMIT, MovesPageProps, VALID_SORTS } from "@/app/moves/page.constants";
// Name/Icon/Farben dieser Sektion für Header und Theme
import { sections } from "@/config/sections";
// Lädt die erste Seite Attacken serverseitig (für MoveExplorer als initialMoves)
import { getMoveList, MoveSort } from "@/server/move/move.service";
// Typenliste für den Typ-Filter
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Attacken",
  description: "Durchsuche alle Attacken mit Stärke, Genauigkeit, AP und den Pokémon, die sie erlernen können.",
  alternates: { canonical: "/moves" },
};

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const { search = "", types: typesParam = "", sort: sortParam, minPower: minPowerParam, maxPower: maxPowerParam } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const sort = VALID_SORTS.includes(sortParam as MoveSort) ? (sortParam as MoveSort) : "name-asc";

  const minPower = Number.isFinite(Number(minPowerParam)) && minPowerParam ? Number(minPowerParam) : undefined;
  const maxPower = Number.isFinite(Number(maxPowerParam)) && maxPowerParam ? Number(maxPowerParam) : undefined;

  const [{ moves, hasMore }, types] = await Promise.all([
    getMoveList(1, LIMIT, { search, types: selectedTypes, sort, minPower, maxPower }),
    getAllTypes(),
  ]);

  return (
    <SectionTheme accent={sections.moves.accent} accent2={sections.moves.accent2}>
      <PageHeader section={sections.moves} />

      <StickyBar>
        <MoveFilters types={types} search={search} selectedTypes={selectedTypes} sort={sort} minPower={minPower} maxPower={maxPower} />
      </StickyBar>

      <section>
        <MoveExplorer
          initialMoves={moves}
          initialHasMore={hasMore}
          search={search}
          types={selectedTypes}
          sort={sort}
          minPower={minPower}
          maxPower={maxPower}
        />
      </section>
    </SectionTheme>
  );
}
