import { Users } from "lucide-react";
import Image from "next/image";

import { glassButton, glassCard, glassChip, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import { MoveGridItem } from "@/components/move/MoveGrid";
import { damageClassLabels, damageClassTooltips } from "@/config/damageClass";
import { getLearnMethodBadge } from "@/config/moveLearnMethods";
import { getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";
import { accentStyle } from "@/config/sections";

interface MoveCardProps {
  move: MoveGridItem;
  showLearnMethod?: boolean;
  showPokemonInfo?: boolean;
  onShowPokemon?: (move: MoveGridItem) => void;
}

export default function MoveCard({ move, showLearnMethod = false, showPokemonInfo = true, onShowPokemon }: MoveCardProps) {
  const methodBadge = showLearnMethod ? getLearnMethodBadge(move.learnMethod, move.level) : null;

  const stats = [
    { label: "Stärke", value: move.power ?? "–" },
    { label: "Genauigkeit", value: move.accuracy != null ? `${move.accuracy}%` : "–" },
    { label: "AP", value: move.pp ?? "–" },
  ];

  return (
    <div style={accentStyle(getPokemonTypeColorVar(move.typeSlug))} className={`${glassCard} flex flex-col gap-3 p-3`}>
      <GlassBlobs />

      <div className="flex items-center gap-3 px-1 pt-1">
        <Image
          src={getPokemonTypeIconPath(move.typeSlug)}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full shadow-lg ring-2 ring-white/40"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-white">{move.nameDe}</h3>

          <p className="text-xs font-medium text-white/70">
            {move.type}
            {move.damageClass && (
              <span title={damageClassTooltips[move.damageClass]}> · {damageClassLabels[move.damageClass] ?? move.damageClass}</span>
            )}
          </p>
        </div>

        {methodBadge && (
          <span className={`${glassChip} shrink-0`} title="Lernmethode">
            <methodBadge.Icon size={12} />
            {methodBadge.label}
          </span>
        )}

        {showPokemonInfo && (
          <button
            type="button"
            onClick={() => onShowPokemon?.(move)}
            title="Pokémon anzeigen, die diese Attacke lernen können"
            aria-label="Pokémon anzeigen, die diese Attacke lernen können"
            className={`${glassButton} size-10 shrink-0 cursor-pointer`}
          >
            <Users size={18} />
          </button>
        )}
      </div>

      <div className={`${glassPanel} flex flex-1 flex-col gap-4 p-3 sm:p-4`}>
        {move.description && <p className="text-[14px] text-white/85 md:text-[15px]">{move.description}</p>}

        <div className="mt-auto grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} title={stat.label} className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-1 py-1.5 text-center">
              <p className="truncate text-[11px] font-medium text-white/60">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
