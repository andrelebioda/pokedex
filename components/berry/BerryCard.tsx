import { Timer } from "lucide-react";

import ItemImage from "@/components/item/ItemImage";
import { getPokemonTypeClass } from "@/config/pokemonTypes";
import { MappedBerry } from "@/server/berry/berry.service";

interface BerryCardProps {
  berry: MappedBerry;
}

export default function BerryCard({ berry }: BerryCardProps) {
  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700 sm:pb-16">
      <div className="grid grid-cols-[auto_1fr] gap-4 sm:pb-2">
        <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-800/50">
          <ItemImage src={berry.image} alt={berry.name} size={56} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-white text-lg">{berry.name}</h3>
          {berry.description && <p className="mt-1 text-[14px] text-slate-400">{berry.description}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-700 sm:absolute sm:right-4 sm:bottom-4 sm:left-4">
        {berry.naturalGiftPower != null && berry.naturalGiftType && (
          <span
            title="Beerenkräfte"
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${getPokemonTypeClass(berry.naturalGiftType)}`}
          >
            {berry.naturalGiftPower} ({berry.naturalGiftTypeName})
          </span>
        )}

        <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300" title="Wachstum">
          <Timer size={12} className="mr-1" />
          {berry.growthTime != null ? `${berry.growthTime} Std.` : "-"}
        </span>
      </div>
    </div>
  );
}
