import type { Metadata } from "next";

import PageHeader from "@/components/layout/PageHeader";
import SectionTheme from "@/components/layout/SectionTheme";
import StickyBar from "@/components/layout/StickyBar";
import { sections } from "@/config/sections";
import MoveExplorer from "@/components/move/MoveExplorer";
import MoveFilters from "@/components/move/MoveFilters";
import { getMoveList, MoveSort } from "@/server/move/move.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Attacken",
  description: "Durchsuche alle Attacken mit Stärke, Genauigkeit, AP und den Pokémon, die sie erlernen können.",
  alternates: { canonical: "/moves" },
};

const LIMIT = 50;
const VALID_SORTS: MoveSort[] = ["name-asc", "name-desc", "type-asc", "type-desc", "power-asc", "power-desc"];

interface MovesPageProps {
  searchParams: Promise<{ search?: string; types?: string; sort?: string; minPower?: string; maxPower?: string }>;
}

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
