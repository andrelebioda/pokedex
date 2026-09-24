import type { CSSProperties } from "react";
import { Timer } from "lucide-react";

import ItemImage from "@/components/item/ItemImage";
import { accentCard, accentGradient, statChip } from "@/components/layout/cardStyles";
import { getPokemonTypeClass, getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";
import { sections } from "@/config/sections";
import { MappedBerry } from "@/server/berry/berry.service";

interface BerryCardProps {
  berry: MappedBerry;
}

export default function BerryCard({ berry }: BerryCardProps) {
  const accent = berry.naturalGiftType ? getPokemonTypeColorVar(berry.naturalGiftType) : sections.berries.accent;

  return (
    <div style={{ "--accent": accent } as CSSProperties} className={`${accentCard} flex flex-col`}>
      <div className={`${accentGradient} flex items-center gap-4 px-4 pt-4 pb-3`}>
        <div className="relative flex size-16 shrink-0 items-center justify-center">
          <div aria-hidden className="absolute inset-2 rounded-full bg-(--accent) opacity-30 blur-xl" />
          <div className="relative">
            <ItemImage src={berry.image} alt={berry.name} size={56} />
          </div>
        </div>

        <h3 className="min-w-0 flex-1 text-lg font-semibold text-white">{berry.name}</h3>
      </div>

      {berry.description && <p className="px-4 pt-1 text-[14px] text-slate-400 md:text-[15px]">{berry.description}</p>}

      <div className="mt-auto flex flex-wrap items-center gap-2 px-4 pt-4 pb-4">
        {berry.naturalGiftPower != null && berry.naturalGiftType && (
          <span
            title="Beerenkräfte"
            className={`inline-flex h-7 items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-xs font-semibold text-white ${getPokemonTypeClass(berry.naturalGiftType)}`}
          >
            <img src={getPokemonTypeIconPath(berry.naturalGiftType)} alt="" className="size-5 rounded-full ring-2 ring-white/40" />
            {berry.naturalGiftTypeName} · {berry.naturalGiftPower}
          </span>
        )}

        <span className={statChip} title="Wachstum">
          <Timer size={12} />
          {berry.growthTime != null ? `${berry.growthTime} Std.` : "–"}
        </span>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-(--accent) opacity-70" />
    </div>
  );
}
