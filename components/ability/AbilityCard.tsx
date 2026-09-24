import { Dna, EyeOff, Users } from "lucide-react";

import { AbilityGridItem } from "@/components/ability/AbilityGrid";
import { glassButton, glassCard, glassChip, glassIconBox, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import { accentStyle, sections } from "@/config/sections";

interface AbilityCardProps {
  ability: AbilityGridItem;
  showPokemonInfo?: boolean;
  onShowPokemon?: (ability: AbilityGridItem) => void;
}

export default function AbilityCard({ ability, showPokemonInfo = true, onShowPokemon }: AbilityCardProps) {
  const hasStatsRow = ability.isHidden || ability.pokemonCount != null || ability.hasHidden;

  return (
    <div style={accentStyle(sections.abilities.accent, sections.abilities.accent2)} className={`${glassCard} flex flex-col gap-3 p-3`}>
      <GlassBlobs />

      <div className="flex items-center gap-3 px-1 pt-1">
        <div className={`${glassIconBox} flex size-10 shrink-0 items-center justify-center`}>
          <Dna size={20} />
        </div>

        <h3 className="min-w-0 flex-1 truncate text-lg font-bold text-white">{ability.nameDe}</h3>
      </div>

      <div className={`${glassPanel} flex flex-1 flex-col gap-4 p-3 sm:p-4`}>
        {ability.description && <p className="text-[14px] text-white/85 md:text-[15px]">{ability.description}</p>}

        {(hasStatsRow || showPokemonInfo) && (
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {ability.isHidden && (
                <span className={glassChip} title="Diese Fähigkeit ist bei diesem Pokémon versteckt">
                  <EyeOff size={12} />
                  Versteckt
                </span>
              )}

              {ability.pokemonCount != null && (
                <span className={glassChip} title="Anzahl Pokémon mit dieser Fähigkeit">
                  <Users size={12} />
                  {ability.pokemonCount} Pokémon
                </span>
              )}

              {ability.hasHidden && (
                <span className={glassChip} title="Kann als versteckte Fähigkeit vorkommen">
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
                className={`${glassButton} size-11 shrink-0 cursor-pointer`}
              >
                <Users size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
