import type { CSSProperties } from "react";
import { Users } from "lucide-react";

import { accentCard, accentGradient, statChip } from "@/components/layout/cardStyles";
import { MoveGridItem } from "@/components/move/MoveGrid";
import { damageClassLabels, damageClassTooltips } from "@/config/damageClass";
import { getLearnMethodBadge } from "@/config/moveLearnMethods";
import { getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";

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
    <div style={{ "--accent": getPokemonTypeColorVar(move.typeSlug) } as CSSProperties} className={`${accentCard} flex flex-col`}>
      <div className={`${accentGradient} flex items-center gap-3 px-4 pt-4 pb-3`}>
        <img src={getPokemonTypeIconPath(move.typeSlug)} alt="" className="size-9 shrink-0 rounded-full ring-2 ring-white/20" />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">{move.nameDe}</h3>

          <p className="text-xs font-medium text-slate-400">
            <span className="text-(--accent)">{move.type}</span>
            {move.damageClass && (
              <span title={damageClassTooltips[move.damageClass]}> · {damageClassLabels[move.damageClass] ?? move.damageClass}</span>
            )}
          </p>
        </div>

        {methodBadge && (
          <span className={`${statChip} shrink-0`} title="Lernmethode">
            <methodBadge.Icon size={12} />
            {methodBadge.label}
          </span>
        )}
      </div>

      {move.description && <p className="px-4 pt-1 text-[14px] text-slate-400 md:text-[15px]">{move.description}</p>}

      <div className="mt-auto flex items-center gap-2 px-4 pt-4 pb-4">
        <div className="grid flex-1 grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} title={stat.label} className="rounded-xl bg-slate-800/60 px-2 py-1.5 text-center">
              <p className="truncate text-[11px] font-medium text-slate-500">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {showPokemonInfo && (
          <button
            type="button"
            onClick={() => onShowPokemon?.(move)}
            title="Pokémon anzeigen, die diese Attacke lernen können"
            aria-label="Pokémon anzeigen, die diese Attacke lernen können"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 transition hover:bg-(--accent) hover:text-white"
          >
            <Users size={18} />
          </button>
        )}
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-(--accent) opacity-70" />
    </div>
  );
}
