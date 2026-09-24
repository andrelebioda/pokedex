"use client";

import { ArrowLeft, Dna, Ruler, Tag, Weight } from "lucide-react";
import Link from "next/link";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import AbilityGrid from "@/components/ability/AbilityGrid";
import FilterSearchInput from "@/components/filters/FilterSearchInput";
import MoveGrid from "@/components/move/MoveGrid";
import PokemonImage from "@/components/pokemon/PokemonImage";
import PokemonStatsRadar from "@/components/pokemon/PokemonStatsRadar";
import { getPokemonTypeClass, getPokemonTypeColorVar, getPokemonTypeHexColor, getPokemonTypeIconPath } from "@/config/pokemonTypes";
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

  const primaryType = pokemon.types[0]?.slug;
  const secondaryType = pokemon.types[1]?.slug ?? primaryType;
  const dexNumber = `#${String(pokemon.id).padStart(3, "0")}`;

  const typeColors = {
    "--type-a": getPokemonTypeColorVar(primaryType),
    "--type-b": getPokemonTypeColorVar(secondaryType),
  } as CSSProperties;

  const infoTiles = [
    { label: "Größe", icon: Ruler, value: pokemon.height ? `${pokemon.height} m` : "–" },
    { label: "Gewicht", icon: Weight, value: pokemon.weight ? `${pokemon.weight} kg` : "–" },
    { label: "Kategorie", icon: Tag, value: pokemon.genus ?? "–" },
    {
      label: "Fähigkeiten",
      icon: Dna,
      value: pokemon.abilities && pokemon.abilities.length > 0 ? pokemon.abilities.map((ability) => ability.name).join(", ") : "–",
    },
  ];

  return (
    <div style={typeColors} className="pt-6">
      <Link
        href="/pokemon"
        className="
          mb-4
          ml-4
          inline-flex
          items-center
          gap-2
          text-sm
          text-slate-400
          transition
          hover:text-white
        "
      >
        <ArrowLeft size={16} />
        Zurück zu allen Pokémon
      </Link>

      <section
        className="
          relative
          isolate
          mx-4
          mb-6
          overflow-hidden
          rounded-3xl
          border
          border-white/5
          bg-slate-900
          shadow-lg
        "
      >
        <div
          className="
            relative
            grid
            gap-6
            bg-[linear-gradient(135deg,color-mix(in_oklab,var(--type-a)_35%,transparent),color-mix(in_oklab,var(--type-b)_12%,transparent)_70%)]
            p-6
            md:p-10
            lg:grid-cols-[1fr_380px]
            lg:items-center
          "
        >
          {/* Nummer als Wasserzeichen */}
          <span
            aria-hidden
            className="
              pointer-events-none
              absolute
              top-2
              right-4
              -z-10
              select-none
              text-7xl
              font-black
              tracking-tighter
              text-white/5
              md:text-[10rem]
              md:leading-none
            "
          >
            {dexNumber}
          </span>

          <div className="order-2 lg:order-1">
            <span className="font-mono text-lg font-semibold text-slate-400">{dexNumber}</span>

            <h1 className="mt-1 text-4xl font-bold text-white md:text-6xl">{pokemon.name}</h1>

            {pokemon.genus && <p className="mt-2 text-slate-300">{pokemon.genus}-Pokémon</p>}

            <div className="mt-5 flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.slug}
                  className={`
                    flex
                    h-9
                    items-center
                    gap-2
                    rounded-full
                    py-1
                    pr-4
                    pl-1
                    text-sm
                    font-semibold
                    text-white
                    shadow-md
                    ${getPokemonTypeClass(type.slug)}
                  `}
                >
                  <img src={getPokemonTypeIconPath(type.slug)} alt="" className="size-7 rounded-full ring-2 ring-white/40" />
                  {type.name}
                </span>
              ))}
            </div>

            {pokemon.description && <p className="mt-6 max-w-2xl text-[16px] text-slate-300 md:text-lg">{pokemon.description}</p>}
          </div>

          <div className="relative order-1 flex justify-center lg:order-2">
            <div aria-hidden className="absolute top-1/2 left-1/2 size-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--type-a) opacity-35 blur-3xl" />

            <div className="relative w-full max-w-90">
              <PokemonImage src={pokemon.image} alt={pokemon.name} size={340} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 md:p-6 lg:grid-cols-4">
          {infoTiles.map((tile) => (
            <div key={tile.label} className="rounded-2xl border border-white/5 bg-slate-800/40 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <tile.icon size={14} className="text-(--type-a)" />
                {tile.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{tile.value}</p>
            </div>
          ))}
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-[linear-gradient(90deg,var(--type-a),var(--type-b))] opacity-70" />
      </section>

      <div className="sticky top-16 z-20 mb-6 flex justify-center bg-slate-950/90 px-4 py-3 backdrop-blur xl:top-0">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-white/5 bg-slate-900 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`
                shrink-0
                rounded-full
                px-5
                py-2
                text-sm
                font-semibold
                transition

                ${tab === t.id ? "bg-(--type-a) text-white shadow-md" : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "stats" &&
        (pokemon.stats ? (
          <div className="mx-4 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="flex items-center justify-center rounded-3xl border border-white/5 bg-slate-900 p-6">
              <PokemonStatsRadar
                stats={pokemon.stats}
                labels={STAT_CHART}
                order={STAT_KEYS_CHART}
                max={STAT_MAX}
                color={getPokemonTypeHexColor(primaryType)}
              />
            </div>

            <div className="space-y-5 rounded-3xl border border-white/5 bg-slate-900 p-6">
              {STAT_KEYS.map((key) => {
                const value = pokemon.stats![key];

                return (
                  <div key={key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-slate-400">{STAT_LABELS[key]}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--type-a),var(--type-b))]"
                        style={{ width: `${Math.min(100, (value / STAT_MAX) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-sm text-slate-400">Gesamt</span>
                <span className="rounded-full bg-[color-mix(in_oklab,var(--type-a)_20%,transparent)] px-3 py-1 text-sm font-bold text-white">
                  {statsTotal}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500">Keine Statistiken verfügbar.</p>
        ))}

      {tab === "moves" && (
        <div>
          <div className="flex items-center justify-between gap-4 px-4">
            <FilterSearchInput value={movesSearchInput} onChange={setMovesSearchInput} placeholder="Attacke suchen…" className="sm:w-72" />
          </div>

          {moveTableItems.length > 0 ? (
            <MoveGrid moves={moveTableItems} showLearnMethod showPokemonInfo={false} />
          ) : !movesLoading ? (
            <p className="pt-6 text-center text-slate-500">Keine Attacken gefunden.</p>
          ) : null}

          {movesHasMore && (
            <div ref={movesSentinelRef} className="flex justify-center py-6">
              {movesLoading && <p className="text-slate-400">Lade weitere Attacken…</p>}

              {movesError && (
                <button
                  onClick={() => fetchMoves(movesPage + 1, movesSearch, true)}
                  className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-slate-300 transition hover:border-white/20 hover:text-white"
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
          <p className="text-center text-slate-500">Keine Fähigkeiten verfügbar.</p>
        ))}
    </div>
  );
}
