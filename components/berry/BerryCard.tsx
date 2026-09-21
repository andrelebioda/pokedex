import { Timer } from "lucide-react";

import ItemImage from "@/components/item/ItemImage";
import { getPokemonTypeClass } from "@/config/pokemonTypes";
import { MappedBerry } from "@/server/berry/berry.service";

interface BerryCardProps {
  berry: MappedBerry;
}

export default function BerryCard({ berry }: BerryCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-800/50">
            <ItemImage src={berry.image} alt={berry.name} size={48} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{berry.name}</h3>
            {berry.description && <p className="mt-1 text-[14px] text-slate-400">{berry.description}</p>}
          </div>
        </div>

        {/* <div className="flex shrink-0 items-center gap-1.5">
          {berry.naturalGiftPower != null && berry.naturalGiftType && (
            <span
              title="Beerenkräfte"
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${getPokemonTypeClass(berry.naturalGiftType)}`}
            >
              {berry.naturalGiftPower} ({berry.naturalGiftTypeName})
            </span>
          )}

          {berry.growthTime != null && (
            <span title="Wachstum" className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
              <Timer size={12} />
              {berry.growthTime} Std.
            </span>
          )}
        </div> */}
      </div>
    </div>
  );
}
