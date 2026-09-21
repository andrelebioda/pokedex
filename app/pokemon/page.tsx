import PokemonFilters from "@/components/pokemon/PokemonFilters";
import PokemonGrid from "@/components/pokemon/PokemonGrid";
import { getPokemonList } from "@/server/pokemon/pokemon.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

interface PokemonPageProps {
  searchParams: Promise<{ search?: string; types?: string }>;
}

export default async function PokemonPage({ searchParams }: PokemonPageProps) {
  const { search = "", types: typesParam = "" } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const [{ pokemon, hasMore }, types] = await Promise.all([getPokemonList(1, 50, { search, types: selectedTypes }), getAllTypes()]);

  return (
    <div>
      <div
        className="
          sticky
          top-0
          z-10
          -mx-8
          -mt-8
          border-b
          border-slate-800
          bg-slate-950/95
          px-8
          py-4
          backdrop-blur
        "
      >
        <PokemonFilters types={types} search={search} selectedTypes={selectedTypes} />
      </div>

      <section className="mt-8">
        <PokemonGrid initialPokemon={pokemon} initialHasMore={hasMore} search={search} types={selectedTypes} />
      </section>
    </div>
  );
}
