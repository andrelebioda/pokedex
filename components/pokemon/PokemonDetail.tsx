"use client";

import { ArrowLeft, Dna, Ruler, Tag, Weight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import AbilityGrid from "@/components/ability/AbilityGrid";
import { glassCard, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import HeaderBackdrop from "@/components/layout/HeaderBackdrop";
import MoveGrid from "@/components/move/MoveGrid";
import PokemonImage from "@/components/pokemon/PokemonImage";
import PokemonStatsRadar from "@/components/pokemon/PokemonStatsRadar";
import { getPokemonTypeClass, getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";
import { accentStyle } from "@/config/sections";
import { mapPokemon, MappedPokemonMove } from "@/server/pokemon/pokemon.mapper";
import { getMovesForPokemonAction } from "@/server/pokemon/pokemon.actions";

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
  attack: "Ang",
  defense: "Vert",
  speed: "Init",
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
        const data = await getMovesForPokemonAction(pokemon.id, pageToLoad, MOVES_LIMIT, { search: search || undefined });

        setMovesPage(pageToLoad);
        setMovesHasMore(data.hasMore);
        setMoves((prev) => {
          if (!append) return data.moves;

          const existingIds = new Set(prev.map((move) => move.id));
          const newItems = data.moves.filter((move) => !existingIds.has(move.id));
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

  const typeColors = accentStyle(getPokemonTypeColorVar(primaryType), getPokemonTypeColorVar(secondaryType));

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
    <div style={typeColors}>
      <header className="relative isolate mb-6 overflow-hidden -mt-15 pt-15 xl:mt-0 xl:pt-0 md:-mx-6">
        <HeaderBackdrop />

        {/* Nummer als Wasserzeichen */}
        <span
          aria-hidden
          className="
            pointer-events-none
            absolute
            top-31
            left-1/2
            -z-10
            -translate-x-1/2
            select-none
            text-[7rem]
            leading-none
            font-black
            tracking-tighter
            text-white/10
            md:top-27
            md:text-[16rem]
            xl:top-12
          "
        >
          {dexNumber}
        </span>

        <div className="px-4 pt-6 pb-8 md:px-10 md:pt-10">
          <Link
            href="/pokemon"
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/10
              bg-white/10
              px-3
              py-1.5
              text-sm
              text-white/80
              backdrop-blur-md
              transition
              hover:bg-white/20
              hover:text-white
            "
          >
            <ArrowLeft size={16} />
            Zurück zu allen Pokémon
          </Link>

          {/* Bild groß und mittig */}
          <div className="relative mx-auto w-full max-w-80 sm:max-w-96 md:max-w-112">
            <div aria-hidden className="absolute inset-[15%] rounded-full bg-white opacity-20 blur-3xl" />
            <div aria-hidden className="absolute inset-[25%] rounded-full bg-(--accent) opacity-60 blur-3xl" />

            <div className="relative drop-shadow-[0_25px_30px_rgb(0_0_0/0.45)]">
              <PokemonImage src={pokemon.image} alt={pokemon.name} size={440} fluid />
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            <span className="font-mono text-lg font-semibold text-white/60">{dexNumber}</span>

            <h1 className="mt-1 text-4xl font-bold text-white md:text-6xl">{pokemon.name}</h1>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
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
                    ring-1
                    ring-white/20
                    ${getPokemonTypeClass(type.slug)}
                  `}
                >
                  <Image
                    src={getPokemonTypeIconPath(type.slug)}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 rounded-full ring-2 ring-white/40"
                  />
                  {type.name}
                </span>
              ))}
            </div>

            {/* Beschreibung vorerst ausgeblendet
            {pokemon.description && (
              <p className={`${glassPanel} mt-6 max-w-2xl p-4 text-[16px] text-white/85 md:text-lg`}>{pokemon.description}</p>
            )} */}
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4">
            {infoTiles.map((tile) => (
              <div key={tile.label} className={`${glassPanel} p-4`}>
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/60 uppercase">
                  <tile.icon size={14} />
                  {tile.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{tile.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-20 mb-6 flex justify-center border-b border-white/5 bg-slate-950/60 px-4 py-3 backdrop-blur-xl md:-mx-6 xl:top-0">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md">
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

                ${
                  tab === t.id
                    ? "bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-white shadow-[0_6px_16px_-6px_var(--accent)]"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "stats" &&
        (pokemon.stats ? (
          <div className="mx-4 grid gap-6 lg:grid-cols-[1fr_1fr] pt-6">
            <div className={`${glassCard} flex items-center justify-center p-3`}>
              <GlassBlobs />
              <div className={`${glassPanel} w-full p-4`}>
                <PokemonStatsRadar stats={pokemon.stats} labels={STAT_CHART} order={STAT_KEYS_CHART} max={STAT_MAX} color="#ffffff" />
              </div>
            </div>

            <div className={`${glassCard} p-3`}>
              <GlassBlobs />
              <div className={`${glassPanel} h-full space-y-5 p-5`}>
                {STAT_KEYS.map((key) => {
                  const value = pokemon.stats![key];

                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-white/70">{STAT_LABELS[key]}</span>
                        <span className="font-semibold text-white">{value}</span>
                      </div>

                      <div className="h-2.5 w-full rounded-full bg-black/25">
                        <div
                          className="h-full rounded-full bg-white/85 shadow-[0_0_10px_rgb(255_255_255/0.4)]"
                          style={{ width: `${Math.min(100, (value / STAT_MAX) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between border-t border-white/15 pt-4">
                  <span className="text-sm text-white/70">Gesamt</span>
                  <span className="rounded-full border border-white/15 bg-white/15 px-3 py-1 text-sm font-bold text-white">{statsTotal}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500">Keine Statistiken verfügbar.</p>
        ))}

      {tab === "moves" && (
        <div>
          {/* <div className="flex items-center justify-between gap-4 px-4">
            <FilterSearchInput value={movesSearchInput} onChange={setMovesSearchInput} placeholder="Attacke suchen…" className="sm:w-72" />
          </div> */}

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
