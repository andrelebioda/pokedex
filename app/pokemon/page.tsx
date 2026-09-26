// Next.js: Typ für die Seiten-<head>-Metadaten
import type { Metadata } from "next";

// Vollbreiter Gradient-Header mit Icon der aktuellen Sektion
import PageHeader from "@/components/layout/PageHeader";
// setzt --accent/--accent-2 (Farbverlauf) für diese Seite und ihre Portale (Filter-Modal, Dropdowns)
import SectionTheme from "@/components/layout/SectionTheme";
// Sticky Filterleiste unter dem Header
import StickyBar from "@/components/layout/StickyBar";
// Filter-Leiste (Typen/Generationen-Modal, Sortierung, Suche)
import PokemonFilters from "@/components/pokemon/PokemonFilters";
// Ausgelagerte Sortier-Whitelist und Props-Typ dieser Seite
import { PokemonPageProps, VALID_SORTS } from "@/app/pokemon/page.constants";
// Infinite-Scroll-Grid der Pokémon-Karten
import PokemonGrid from "@/components/pokemon/PokemonGrid";
// Name/Icon/Farben dieser Sektion für Header und Theme
import { sections } from "@/config/sections";
// Lädt die erste Seite Pokémon serverseitig (für PokemonGrid als initialPokemon)
import { getPokemonList, PokemonSort } from "@/server/pokemon/pokemon.service";
// Typenliste für den Typ-Filter
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pokémon",
  description: "Durchsuche alle Pokémon nach Name oder Typ und finde Details zu Werten, Attacken und Fähigkeiten.",
  alternates: { canonical: "/pokemon" },
};

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
    <SectionTheme accent={sections.pokemon.accent} accent2={sections.pokemon.accent2}>
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
    </SectionTheme>
  );
}
