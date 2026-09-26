"use client";

import { useCallback } from "react";

import PokemonCard, { PokemonListItem } from "@/components/pokemon/PokemonCard";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { getPokemonListAction } from "@/server/pokemon/pokemon.actions";
import { PokemonSort } from "@/server/pokemon/pokemon.service";

const LIMIT = 50;

interface PokemonGridProps {
  initialPokemon: PokemonListItem[];
  initialHasMore: boolean;
  search?: string;
  types?: string[];
  generations?: number[];
  sort?: PokemonSort;
}

export default function PokemonGrid({
  initialPokemon,
  initialHasMore,
  search = "",
  types = [],
  generations = [],
  sort = "number-asc",
}: PokemonGridProps) {
  const fetchPage = useCallback(
    (page: number) => getPokemonListAction(page, LIMIT, { search, types, generations, sort }).then((data) => ({ items: data.pokemon, hasMore: data.hasMore })),
    [search, types, generations, sort],
  );

  const { items: pokemon, hasMore, loading, error, sentinelRef, retry } = useInfiniteList({
    initialItems: initialPokemon,
    initialHasMore,
    filterKey: `${search}::${types.join(",")}::${generations.join(",")}::${sort}`,
    getId: (item) => item.id,
    fetchPage,
  });

  if (pokemon.length === 0) {
    return <p className="text-center text-slate-500">Keine Pokémon gefunden.</p>;
  }

  return (
    <div className="px-4 py-6">
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 grid-cols-1">
        {pokemon.map((poke) => (
          <PokemonCard key={poke.id} pokemon={poke} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          {loading && <p className="text-slate-400">Lade weitere Pokémon…</p>}

          {error && (
            <button
              onClick={retry}
              className="
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                px-4
                py-2
                text-slate-300
                hover:border-slate-700
                hover:text-white
              "
            >
              Erneut versuchen
            </button>
          )}
        </div>
      )}

      {!hasMore && pokemon.length > 0 && <p className="mt-8 text-center text-slate-500">Alle Pokémon geladen ({pokemon.length})</p>}
    </div>
  );
}
