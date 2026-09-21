import Link from "next/link";

import ItemImage from "@/components/item/ItemImage";
import { LearnerState } from "@/components/move/MoveGrid";
import { getLearnMethodBadge } from "@/config/moveLearnMethods";
import { getPokemonTypeClass } from "@/config/pokemonTypes";

interface MovePokemonListProps {
  state: LearnerState;
}

export default function MovePokemonList({ state }: MovePokemonListProps) {
  if (state.status === "loading") {
    return <p className="py-4 text-center text-slate-400">Lade Pokémon…</p>;
  }

  if (state.status === "error") {
    return <p className="py-4 text-center text-red-400">Fehler beim Laden der Pokémon.</p>;
  }

  if (state.learners.length === 0) {
    return <p className="py-4 text-center text-slate-500">Keine Pokémon gefunden.</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {state.learners.map((learner) => {
        const methodBadge = getLearnMethodBadge(learner.learnMethod, learner.level);

        return (
          <Link
            key={learner.id}
            href={`/pokemon/${learner.id}`}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-2.5 transition hover:border-slate-700"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800/50">
              <ItemImage src={learner.image} alt={learner.name} size={36} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{learner.name}</p>

              {/* <div className="mt-0.5 flex flex-wrap items-center gap-1">
                {learner.types.map((type) => (
                  <span
                    key={type.slug}
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white ${getPokemonTypeClass(type.slug)}`}
                  >
                    {type.name}
                  </span>
                ))}

                {methodBadge && (
                  <>
                    <span className="text-slate-600">|</span>

                    <span className="flex items-center gap-0.5 rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                      <methodBadge.Icon size={10} />
                      {methodBadge.label}
                    </span>
                  </>
                )}
              </div> */}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
