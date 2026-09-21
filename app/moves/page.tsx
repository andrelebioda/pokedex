import StickyBar from "@/components/layout/StickyBar";
import MoveFilters from "@/components/move/MoveFilters";
import MoveGrid from "@/components/move/MoveGrid";
import { getMoveList } from "@/server/move/move.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

interface MovesPageProps {
  searchParams: Promise<{ search?: string; types?: string }>;
}

export default async function MovesPage({ searchParams }: MovesPageProps) {
  const { search = "", types: typesParam = "" } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const [moves, types] = await Promise.all([getMoveList({ search, types: selectedTypes }), getAllTypes()]);

  return (
    <div>
      <StickyBar className="-mt-8 mb-8">
        <MoveFilters types={types} search={search} selectedTypes={selectedTypes} />
      </StickyBar>

      <section>
        <MoveGrid moves={moves} />
      </section>
    </div>
  );
}
