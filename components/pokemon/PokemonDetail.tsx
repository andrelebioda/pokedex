"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import AbilityGrid from "@/components/ability/AbilityGrid";
import FilterSearchInput from "@/components/filters/FilterSearchInput";
import MoveGrid from "@/components/move/MoveGrid";
import PokemonImage from "@/components/pokemon/PokemonImage";
import PokemonStatsRadar from "@/components/pokemon/PokemonStatsRadar";
import { getPokemonTypeClass } from "@/config/pokemonTypes";
import { mapPokemon, MappedPokemonMove } from "@/server/pokemon/pokemon.mapper";

type PokemonDetailData = NonNullable<ReturnType<typeof mapPokemon>>;
type PokemonStats = NonNullable<PokemonDetailData["stats"]>;

interface PokemonDetailProps {
  pokemon: PokemonDetailData;
  initialMoves: MappedPokemonMove[];
  initialMovesHasMore: boolean;
}

const TABS = [
  { id: "stats", label: "Stats" },
  { id: "moves", label: "Attacken" },
  { id: "abilities", label: "Fähigkeiten" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STAT_LABELS: Record<keyof PokemonStats, string> = {
  hp: "KP",
  attack: "Angriff",
  defense: "Verteidigung",
  specialAttack: "Sp. Angriff",
  specialDefense: "Sp. Verteidigung",
  speed: "Initiative",
};

const STAT_CHART: Record<keyof PokemonStats, string> = {
  hp: "KP",
  attack: "Angriff",
  defense: "Verteidigung",
  speed: "Initiative",
  specialDefense: "Sp. Vert",
  specialAttack: "Sp. Ang",
};

const STAT_MAX = 255;
const MOVES_LIMIT = 30;

const STAT_KEYS = Object.keys(STAT_LABELS) as (keyof PokemonStats)[];
const STAT_KEYS_CHART = Object.keys(STAT_CHART) as (keyof PokemonStats)[];

export default function PokemonDetail({ pokemon, initialMoves, initialMovesHasMore }: PokemonDetailProps) {
  const [tab, setTab] = useState<TabId>("stats");

  const [movesSearchInput, setMovesSearchInput] = useState("");
  const [movesSearch, setMovesSearch] = useState("");
  const [moves, setMoves] = useState<MappedPokemonMove[]>(initialMoves);
  const [movesPage, setMovesPage] = useState(1);
  const [movesHasMore, setMovesHasMore] = useState(initialMovesHasMore);
  const [movesLoading, setMovesLoading] = useState(false);
  const [movesError, setMovesError] = useState(false);

  const movesLoadingRef = useRef(movesLoading);
  const movesHasMoreRef = useRef(movesHasMore);

  useEffect(() => {
    movesLoadingRef.current = movesLoading;
    movesHasMoreRef.current = movesHasMore;
  }, [movesLoading, movesHasMore]);

  useEffect(() => {
    const timeout = setTimeout(() => setMovesSearch(movesSearchInput), 300);
    return () => clearTimeout(timeout);
  }, [movesSearchInput]);

  const fetchMoves = useCallback(
    async (pageToLoad: number, search: string, append: boolean) => {
      setMovesLoading(true);
      setMovesError(false);

      try {
        const params = new URLSearchParams({ page: String(pageToLoad), limit: String(MOVES_LIMIT) });
        if (search) params.set("search", search);

        const response = await fetch(`/api/pokemon/${pokemon.id}/moves?${params.toString()}`);
        if (!response.ok) throw new Error("Fehler beim Laden");

        const data = await response.json();

        setMovesPage(pageToLoad);
        setMovesHasMore(data.hasMore);
        setMoves((prev) => {
          if (!append) return data.moves;

          const existingIds = new Set(prev.map((move) => move.id));
          const newItems = (data.moves as MappedPokemonMove[]).filter((move) => !existingIds.has(move.id));
          return [...prev, ...newItems];
        });
      } catch {
        setMovesError(true);
      } finally {
        setMovesLoading(false);
      }
    },
    [pokemon.id],
  );

  const movesMountedRef = useRef(false);

  useEffect(() => {
    if (!movesMountedRef.current) {
      movesMountedRef.current = true;
      return;
    }

    fetchMoves(1, movesSearch, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movesSearch]);

  const loadMoreMoves = useCallback(() => {
    if (movesLoadingRef.current || !movesHasMoreRef.current) return;

    fetchMoves(movesPage + 1, movesSearch, true);
  }, [fetchMoves, movesPage, movesSearch]);

  const movesSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = movesSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreMoves();
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMoreMoves, tab]);

  const statsTotal = pokemon.stats ? Object.values(pokemon.stats).reduce((sum: number, value: number) => sum + value, 0) : null;

  const moveTableItems = moves.map((move) => ({
    id: move.id,
    nameDe: move.name,
    type: move.type,
    typeSlug: move.typeSlug,
    damageClass: move.damageClass,
    priority: move.priority,
    power: move.power,
    accuracy: move.accuracy,
    pp: move.pp,
    description: move.description,
    learnMethod: move.learnMethod,
    level: move.level,
  }));

  const abilityGridItems = (pokemon.abilities ?? []).map((ability) => ({
    id: ability.id,
    nameDe: ability.name,
    description: ability.description,
    isHidden: ability.isHidden,
  }));

  return (
    <div className="pt-6">
      <Link
        href="/pokemon"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-slate-400
          transition
          hover:text-white
          ml-4
          mb-6
        "
      >
        <ArrowLeft size={16} />
        Zurück zur Übersicht
      </Link>

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          shadow-lg
          mx-4
          mb-4
        "
      >
        <div className="grid gap-8 p-8 lg:grid-cols-[360px_1fr] lg:items-center">
          <div>
            <strong className="text-lg text-slate-500">#{String(pokemon.id).padStart(3, "0")}</strong>

            <h1 className="mt-1 text-5xl font-bold text-white">{pokemon.name}</h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.slug}
                  className={`
                    rounded-full
                    px-4
                    py-1.5
                    text-sm
                    font-semibold
                    text-white
                    ${getPokemonTypeClass(type.slug)}
                  `}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PokemonImage src={pokemon.image} alt={pokemon.name} size={340} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-800 bg-slate-950/40 px-8 py-6 sm:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500">Größe</p>
            <p className="text-lg font-semibold text-white">{pokemon.height ? `${pokemon.height} m` : "–"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Gewicht</p>
            <p className="text-lg font-semibold text-white">{pokemon.weight ? `${pokemon.weight} kg` : "–"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Kategorie</p>
            <p className="text-lg font-semibold text-white">{pokemon.genus ?? "–"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Fähigkeiten</p>
            {pokemon.abilities && pokemon.abilities.length > 0 ? (
              pokemon.abilities.map((ability) => (
                <p key={ability.id} className="text-lg font-semibold text-white">
                  {ability.name}
                </p>
              ))
            ) : (
              <p className="text-lg font-semibold text-white">–</p>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-20 flex justify-center gap-2 overflow-x-auto border-b border-slate-800 bg-slate-950 mb-6 xl:top-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`
              shrink-0
              px-4
              py-3
              text-sm
              font-semibold
              transition

              ${tab === t.id ? "border-b-2 border-red-500 text-white" : "text-slate-400 hover:text-white"}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stats" &&
        (pokemon.stats ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] mx-4">
            <div className="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <PokemonStatsRadar stats={pokemon.stats} labels={STAT_CHART} order={STAT_KEYS_CHART} max={STAT_MAX} />
            </div>

            <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              {STAT_KEYS.map((key) => {
                const value = pokemon.stats![key];

                return (
                  <div key={key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-slate-400">{STAT_LABELS[key]}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(100, (value / STAT_MAX) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between border-t border-slate-800 pt-4 text-sm">
                <span className="text-slate-400">Gesamt</span>
                <span className="font-bold text-white">{statsTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">Keine Statistiken verfügbar.</p>
        ))}

      {tab === "moves" && (
        <div>
          <div className="flex items-center justify-between gap-4 px-4">
            <FilterSearchInput value={movesSearchInput} onChange={setMovesSearchInput} placeholder="Attacke suchen…" className="sm:w-72" />
          </div>

          {moveTableItems.length > 0 ? (
            <MoveGrid moves={moveTableItems} showLearnMethod showPokemonInfo={false} />
          ) : !movesLoading ? (
            <p className="text-slate-500">Keine Attacken gefunden.</p>
          ) : null}

          {movesHasMore && (
            <div ref={movesSentinelRef} className="flex justify-center">
              {movesLoading && <p className="text-slate-400">Lade weitere Attacken…</p>}

              {movesError && (
                <button
                  onClick={() => fetchMoves(movesPage + 1, movesSearch, true)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  Erneut versuchen
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "abilities" &&
        (abilityGridItems.length > 0 ? (
          <AbilityGrid abilities={abilityGridItems} showPokemonInfo={false} />
        ) : (
          <p className="text-slate-500">Keine Fähigkeiten verfügbar.</p>
        ))}
    </div>
  );
}
