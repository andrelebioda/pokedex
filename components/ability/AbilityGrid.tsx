"use client";

import { useState } from "react";

import AbilityCard from "@/components/ability/AbilityCard";
import AbilityPokemonModal from "@/components/ability/AbilityPokemonModal";
import { getPokemonForAbilityAction } from "@/server/ability/ability.actions";
import { AbilityPokemon } from "@/server/ability/ability.service";

export interface AbilityGridItem {
  id: number;
  nameDe: string;
  description?: string | null;
  pokemonCount?: number;
  hasHidden?: boolean;
  isHidden?: boolean;
}

export type AbilityLearnerState = { status: "loading" } | { status: "error" } | { status: "ready"; pokemon: AbilityPokemon[] };

interface AbilityGridProps {
  abilities: AbilityGridItem[];
  showPokemonInfo?: boolean;
}

export default function AbilityGrid({ abilities, showPokemonInfo = true }: AbilityGridProps) {
  const [openAbility, setOpenAbility] = useState<AbilityGridItem | null>(null);
  const [cache, setCache] = useState<Record<number, AbilityLearnerState>>({});

  async function handleShowPokemon(ability: AbilityGridItem) {
    setOpenAbility(ability);

    if (cache[ability.id]) return;

    setCache((prev) => ({ ...prev, [ability.id]: { status: "loading" } }));

    try {
      const pokemon = await getPokemonForAbilityAction(ability.id);

      setCache((prev) => ({ ...prev, [ability.id]: { status: "ready", pokemon } }));
    } catch {
      setCache((prev) => ({ ...prev, [ability.id]: { status: "error" } }));
    }
  }

  if (abilities.length === 0) {
    return <p className="text-center text-slate-500">Keine Fähigkeiten gefunden.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3 px-4 py-6">
        {abilities.map((ability) => (
          <AbilityCard key={ability.id} ability={ability} showPokemonInfo={showPokemonInfo} onShowPokemon={handleShowPokemon} />
        ))}
      </div>

      {openAbility && showPokemonInfo && (
        <AbilityPokemonModal ability={openAbility} state={cache[openAbility.id] ?? { status: "loading" }} onClose={() => setOpenAbility(null)} />
      )}
    </>
  );
}
