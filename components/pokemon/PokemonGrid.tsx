"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import PokemonCard, { PokemonListItem } from "@/components/pokemon/PokemonCard";
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
  sort = "number",
}: PokemonGridProps) {
  const filterKey = `${search}::${types.join(",")}::${generations.join(",")}::${sort}`;

  const [pokemon, setPokemon] = useState(initialPokemon);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Reset pagination when the active filters change, without remounting the
  // grid — pokémon already rendered for both the old and new result set keep
  // their component instance (matched by id), so their images don't reload.
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPokemon(initialPokemon);
    setPage(1);
    setHasMore(initialHasMore);
    setLoading(false);
    setError(false);
  }

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    setError(false);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: String(nextPage), limit: String(LIMIT) });
      if (search) params.set("search", search);
      if (types.length > 0) params.set("types", types.join(","));
      if (generations.length > 0) params.set("generations", generations.join(","));
      if (sort !== "number") params.set("sort", sort);

      const response = await fetch(`/api/pokemon?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Pokémon konnten nicht geladen werden");
      }

      const data = await response.json();

      setPage(nextPage);
      setHasMore(data.hasMore);

      setPokemon((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = (data.pokemon as PokemonListItem[]).filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, types, generations, sort]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadNextPage]);

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
              onClick={loadNextPage}
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
