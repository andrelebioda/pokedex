"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import AbilityGrid from "@/components/ability/AbilityGrid";
import MoveGrid from "@/components/move/MoveGrid";
import PokemonImage from "@/components/pokemon/PokemonImage";
import PokemonStatsRadar from "@/components/pokemon/PokemonStatsRadar";
import { getPokemonTypeClass } from "@/config/pokemonTypes";
import { mapPokemon } from "@/server/pokemon/pokemon.mapper";

type PokemonDetailData = NonNullable<ReturnType<typeof mapPokemon>>;
type PokemonStats = NonNullable<PokemonDetailData["stats"]>;

interface PokemonDetailProps {
  pokemon: PokemonDetailData;
}

const TABS = [
  // { id: "overview", label: "Übersicht" },
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

const STAT_KEYS = Object.keys(STAT_LABELS) as (keyof PokemonStats)[];
const STAT_KEYS_CHART = Object.keys(STAT_CHART) as (keyof PokemonStats)[];

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const [tab, setTab] = useState<TabId>("stats");

  const statsTotal = pokemon.stats ? Object.values(pokemon.stats).reduce((sum: number, value: number) => sum + value, 0) : null;

  const moveTableItems = (pokemon.moves ?? []).map((move) => ({
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
    <div className="space-y-8">
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

      <div className="flex gap-2 overflow-x-auto border-b border-slate-800">
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
            {t.id === "moves" && pokemon.moves ? ` (${pokemon.moves.length})` : ""}
            {t.id === "abilities" && pokemon.abilities ? ` (${pokemon.abilities.length})` : ""}
          </button>
        ))}
      </div>

      {/* {tab === "overview" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          {pokemon.description ? (
            <p className="leading-relaxed text-slate-300">{pokemon.description}</p>
          ) : (
            <p className="text-slate-500">Keine Beschreibung verfügbar.</p>
          )}
        </div>
      )} */}

      {tab === "stats" &&
        (pokemon.stats ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
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

      {tab === "moves" &&
        (moveTableItems.length > 0 ? (
          <MoveGrid moves={moveTableItems} showLearnMethod showPokemonInfo={false} />
        ) : (
          <p className="text-slate-500">Keine Attacken verfügbar.</p>
        ))}

      {tab === "abilities" &&
        (abilityGridItems.length > 0 ? (
          <AbilityGrid abilities={abilityGridItems} showPokemonInfo={false} />
        ) : (
          <p className="text-slate-500">Keine Fähigkeiten verfügbar.</p>
        ))}
    </div>
  );
}
