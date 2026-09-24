import type { Metadata } from "next";

import PageHeader from "@/components/layout/PageHeader";
import StickyBar from "@/components/layout/StickyBar";
import { sections } from "@/config/sections";
import PokemonFilters from "@/components/pokemon/PokemonFilters";
import PokemonGrid from "@/components/pokemon/PokemonGrid";
import { getPokemonList, PokemonSort } from "@/server/pokemon/pokemon.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pokémon",
  description: "Durchsuche alle Pokémon nach Name oder Typ und finde Details zu Werten, Attacken und Fähigkeiten.",
  alternates: { canonical: "/pokemon" },
};

const VALID_SORTS: PokemonSort[] = ["number-asc", "number-desc", "name-asc", "name-desc", "type-asc", "type-desc"];

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

  const sort = VALID_SORTS.includes(sortParam as PokemonSort) ? (sortParam as PokemonSort) : "number-asc";

  const [{ pokemon, hasMore }, types] = await Promise.all([
    getPokemonList(1, 50, { search, types: selectedTypes, generations: selectedGenerations, sort }),
    getAllTypes(),
  ]);

  return (
    <div>
      <PageHeader section={sections.pokemon} />

      <StickyBar>
        <PokemonFilters types={types} search={search} selectedTypes={selectedTypes} selectedGenerations={selectedGenerations} sort={sort} />
      </StickyBar>

      <section>
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
