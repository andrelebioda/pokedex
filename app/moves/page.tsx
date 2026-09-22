import type { Metadata } from "next";

import StickyBar from "@/components/layout/StickyBar";
import MoveFilters from "@/components/move/MoveFilters";
import MoveGrid from "@/components/move/MoveGrid";
import { getMoveList, MoveSort } from "@/server/move/move.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Attacken",
  description: "Durchsuche alle Attacken mit Stärke, Genauigkeit, AP und den Pokémon, die sie erlernen können.",
};

const VALID_SORTS: MoveSort[] = ["name", "type"];

interface MovesPageProps {
  searchParams: Promise<{ search?: string; types?: string; sort?: string }>;
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const { search = "", types: typesParam = "", sort: sortParam } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const sort = VALID_SORTS.includes(sortParam as MoveSort) ? (sortParam as MoveSort) : "name";

  const [moves, types] = await Promise.all([getMoveList({ search, types: selectedTypes, sort }), getAllTypes()]);

  return (
    <div>
      <StickyBar className="-mt-8 mb-8">
        <MoveFilters types={types} search={search} selectedTypes={selectedTypes} sort={sort} />
      </StickyBar>

      <section>
        <MoveGrid moves={moves} />
      </section>
    </div>
  );
}
