import { Battery, Info, Target, Zap } from "lucide-react";

import { MoveGridItem } from "@/components/move/MoveGrid";
import { damageClassIconPaths, damageClassTooltips } from "@/config/damageClass";
import { getLearnMethodBadge } from "@/config/moveLearnMethods";
import { getPokemonTypeIconPath } from "@/config/pokemonTypes";

interface MoveCardProps {
  move: MoveGridItem;
  showLearnMethod?: boolean;
  showPokemonInfo?: boolean;
  onShowPokemon?: (move: MoveGridItem) => void;
}

export default function MoveCard({ move, showLearnMethod = false, showPokemonInfo = true, onShowPokemon }: MoveCardProps) {
  const methodBadge = showLearnMethod ? getLearnMethodBadge(move.learnMethod, move.level) : null;

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-4 pb-4 transition hover:border-slate-700 sm:pb-16">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <img src={getPokemonTypeIconPath(move.typeSlug)} alt="" title={move.type} className="h-5.5 w-5.5 shrink-0 mr-1" />
          <h3 className="text-lg font-semibold text-white">{move.nameDe}</h3>

          {/* {move.damageClass && (
            <img
              src={damageClassIconPaths[move.damageClass]}
              alt={move.damageClass}
              title={damageClassTooltips[move.damageClass]}
              style={{ imageRendering: "pixelated" }}
              className="h-4 w-8 shrink-0 object-contain"
            />
          )} */}
        </div>
      </div>

      {move.description && <p className="mt-2 text-[14px] md:text-[16px] text-slate-400 pb-2">{move.description}</p>}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-700 sm:absolute sm:right-4 sm:bottom-4 sm:left-4">
        <div className="flex items-center gap-2">
          <span className=" flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300" title="Stärke">
            <Zap size={12} className="mr-1" />
            {move.power ?? "-"}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300" title="Genauigkeit">
            <Target size={12} className="mr-1" />
            {move.accuracy != null ? `${move.accuracy}%` : "-"}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300" title="AP">
            <Battery size={12} className="mr-1" />
            {move.pp ?? "-"}
          </span>

          {methodBadge && (
            <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300" title="Lernmethode">
              <methodBadge.Icon size={12} />
              {methodBadge.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showPokemonInfo && (
            <button
              type="button"
              onClick={() => onShowPokemon?.(move)}
              title="Pokémon anzeigen, die diese Attacke lernen können"
              className="shrink-0 rounded-lg  text-slate-400 transition hover:bg-slate-800 hover:text-white hover:cursor-pointer"
            >
              <Info size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
