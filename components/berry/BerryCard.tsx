import { Timer } from "lucide-react";

import ItemImage from "@/components/item/ItemImage";
import { glassCard, glassChip, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import { getPokemonTypeClass, getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";
import { accentStyle, sections } from "@/config/sections";
import { MappedBerry } from "@/server/berry/berry.service";

interface BerryCardProps {
  berry: MappedBerry;
}

export default function BerryCard({ berry }: BerryCardProps) {
  const accent = berry.naturalGiftType ? getPokemonTypeColorVar(berry.naturalGiftType) : sections.berries.accent;

  return (
    <div style={accentStyle(accent, sections.berries.accent)} className={`${glassCard} flex flex-col gap-3 p-3`}>
      <GlassBlobs />

      <div className="flex items-center gap-3 px-1 pt-1">
        <div className="relative flex size-14 shrink-0 items-center justify-center">
          <div aria-hidden className="absolute inset-1 rounded-full bg-white opacity-20 blur-lg" />
          <div className="relative drop-shadow-[0_4px_6px_rgb(0_0_0/0.4)]">
            <ItemImage src={berry.image} alt={berry.name} size={56} />
          </div>
        </div>

        <h3 className="min-w-0 flex-1 text-lg font-bold text-white">{berry.name}</h3>
      </div>

      <div className={`${glassPanel} flex flex-1 flex-col gap-4 p-3 sm:p-4`}>
        {berry.description && <p className="text-[14px] text-white/85 md:text-[15px]">{berry.description}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {berry.naturalGiftPower != null && berry.naturalGiftType && (
            <span
              title="Beerenkräfte"
              className={`inline-flex h-7 items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-xs font-semibold text-white ring-1 ring-white/20 ${getPokemonTypeClass(berry.naturalGiftType)}`}
            >
              <img src={getPokemonTypeIconPath(berry.naturalGiftType)} alt="" className="size-5 rounded-full ring-2 ring-white/40" />
              {berry.naturalGiftTypeName} · {berry.naturalGiftPower}
            </span>
          )}

          <span className={glassChip} title="Wachstum">
            <Timer size={12} />
            {berry.growthTime != null ? `${berry.growthTime} Std.` : "–"}
          </span>
        </div>
      </div>
    </div>
  );
}
