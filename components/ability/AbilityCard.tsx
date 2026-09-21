import { Dna, EyeOff, Info, Users } from "lucide-react";

import { AbilityGridItem } from "@/components/ability/AbilityGrid";

interface AbilityCardProps {
  ability: AbilityGridItem;
  showPokemonInfo?: boolean;
  onShowPokemon?: (ability: AbilityGridItem) => void;
}

export default function AbilityCard({ ability, showPokemonInfo = true, onShowPokemon }: AbilityCardProps) {
  const hasStatsRow = ability.isHidden || ability.pokemonCount != null;

  return (
    <div className={`relative rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700 ${hasStatsRow ? "sm:pb-16" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/50 text-red-400">
            <Dna size={18} />
          </div>

          <h3 className="text-lg font-semibold text-white">{ability.nameDe}</h3>
        </div>

        {showPokemonInfo && (
          <button
            type="button"
            onClick={() => onShowPokemon?.(ability)}
            title="Pokémon anzeigen, die diese Fähigkeit haben können"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white hover:cursor-pointer"
          >
            <Info size={22} />
          </button>
        )}
      </div>

      {ability.description && <p className="mt-2 text-[14px] text-slate-400 pb-2">{ability.description}</p>}

      {hasStatsRow && (
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-700 sm:absolute sm:right-4 sm:bottom-4 sm:left-4">
          {ability.isHidden && (
            <span
              className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
              title="Diese Fähigkeit ist bei diesem Pokémon versteckt"
            >
              <EyeOff size={12} className="mr-1" />
              Versteckt
            </span>
          )}

          {ability.pokemonCount != null && (
            <span
              className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
              title="Anzahl Pokémon mit dieser Fähigkeit"
            >
              <Users size={12} className="mr-1" />
              {ability.pokemonCount}
            </span>
          )}

          {ability.hasHidden && (
            <span
              className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
              title="Kann als versteckte Fähigkeit vorkommen"
            >
              <EyeOff size={12} className="mr-1" />
              Versteckt möglich
            </span>
          )}
        </div>
      )}
    </div>
  );
}
