import type { CSSProperties } from "react";
import { Dna, EyeOff, Users } from "lucide-react";

import { AbilityGridItem } from "@/components/ability/AbilityGrid";
import { accentCard, accentGradient, accentIconBox, statChip } from "@/components/layout/cardStyles";
import { sections } from "@/config/sections";

interface AbilityCardProps {
  ability: AbilityGridItem;
  showPokemonInfo?: boolean;
  onShowPokemon?: (ability: AbilityGridItem) => void;
}

export default function AbilityCard({ ability, showPokemonInfo = true, onShowPokemon }: AbilityCardProps) {
  const hasStatsRow = ability.isHidden || ability.pokemonCount != null || ability.hasHidden;

  return (
    <div style={{ "--accent": sections.abilities.accent } as CSSProperties} className={`${accentCard} flex flex-col`}>
      <div className={`${accentGradient} flex items-center gap-3 px-4 pt-4 pb-3`}>
        <div className={`${accentIconBox} flex size-9 shrink-0 items-center justify-center`}>
          <Dna size={18} />
        </div>

        <h3 className="min-w-0 flex-1 truncate text-lg font-semibold text-white">{ability.nameDe}</h3>
      </div>

      {ability.description && <p className="px-4 pt-1 text-[14px] text-slate-400 md:text-[15px]">{ability.description}</p>}

      {(hasStatsRow || showPokemonInfo) && (
        <div className="mt-auto flex items-center justify-between gap-2 px-4 pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {ability.isHidden && (
              <span className={statChip} title="Diese Fähigkeit ist bei diesem Pokémon versteckt">
                <EyeOff size={12} />
                Versteckt
              </span>
            )}

            {ability.pokemonCount != null && (
              <span className={statChip} title="Anzahl Pokémon mit dieser Fähigkeit">
                <Users size={12} />
                {ability.pokemonCount} Pokémon
              </span>
            )}

            {ability.hasHidden && (
              <span className={statChip} title="Kann als versteckte Fähigkeit vorkommen">
                <EyeOff size={12} />
                Versteckt möglich
              </span>
            )}
          </div>

          {showPokemonInfo && (
            <button
              type="button"
              onClick={() => onShowPokemon?.(ability)}
              title="Pokémon anzeigen, die diese Fähigkeit haben können"
              aria-label="Pokémon anzeigen, die diese Fähigkeit haben können"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 transition hover:bg-(--accent) hover:text-white"
            >
              <Users size={18} />
            </button>
          )}
        </div>
      )}

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-(--accent) opacity-70" />
    </div>
  );
}
