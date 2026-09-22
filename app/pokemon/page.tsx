import type { Metadata } from "next";

import PokemonFilters from "@/components/pokemon/PokemonFilters";
import PokemonGrid from "@/components/pokemon/PokemonGrid";
import { getPokemonList, PokemonSort } from "@/server/pokemon/pokemon.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pokémon",
  description: "Durchsuche alle Pokémon nach Name oder Typ und finde Details zu Werten, Attacken und Fähigkeiten.",
};

const VALID_SORTS: PokemonSort[] = ["number", "name", "type"];

interface PokemonPageProps {
  searchParams: Promise<{ search?: string; types?: string; generations?: string; sort?: string }>;
}

export default async function PokemonPage({ searchParams }: PokemonPageProps) {
  const { search = "", types: typesParam = "", generations: generationsParam = "", sort: sortParam } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const selectedGenerations = generationsParam
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  const sort = VALID_SORTS.includes(sortParam as PokemonSort) ? (sortParam as PokemonSort) : "number";

  const [{ pokemon, hasMore }, types] = await Promise.all([
    getPokemonList(1, 50, { search, types: selectedTypes, generations: selectedGenerations, sort }),
    getAllTypes(),
  ]);

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
          py-6
          backdrop-blur
        "
      >
        <PokemonFilters types={types} search={search} selectedTypes={selectedTypes} selectedGenerations={selectedGenerations} sort={sort} />
      </div>

      <section className="mt-8">
        <PokemonGrid
          initialPokemon={pokemon}
          initialHasMore={hasMore}
          search={search}
          types={selectedTypes}
          generations={selectedGenerations}
          sort={sort}
        />
      </section>
    </div>
  );
}
