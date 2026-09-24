import { EyeOff } from "lucide-react";
import Link from "next/link";

import { AbilityLearnerState } from "@/components/ability/AbilityGrid";
import ItemImage from "@/components/item/ItemImage";

interface AbilityPokemonListProps {
  state: AbilityLearnerState;
}

export default function AbilityPokemonList({ state }: AbilityPokemonListProps) {
  if (state.status === "loading") {
    return <p className="py-4 text-center text-slate-400">Lade Pokémon…</p>;
  }

  if (state.status === "error") {
    return <p className="py-4 text-center text-red-400">Fehler beim Laden der Pokémon.</p>;
  }

  if (state.pokemon.length === 0) {
    return <p className="py-4 text-center text-slate-500">Keine Pokémon gefunden.</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {state.pokemon.map((entry) => (
        <Link
          key={entry.id}
          href={`/pokemon/${entry.id}`}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] transition hover:border-white/25 hover:bg-white/20"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/20">
            <ItemImage src={entry.image} alt={entry.name} size={36} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{entry.name}</p>

            {entry.isHidden && (
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-white/70">
                <EyeOff size={10} />
                Versteckt
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
