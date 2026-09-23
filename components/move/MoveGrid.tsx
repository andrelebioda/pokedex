"use client";

import { useState } from "react";

import MoveCard from "@/components/move/MoveCard";
import MovePokemonModal from "@/components/move/MovePokemonModal";
import { MoveLearner } from "@/server/move/move.service";

export interface MoveGridItem {
  id: number;
  nameDe: string;
  type: string;
  typeSlug: string;
  damageClass: string | null;
  priority: number | null;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  description?: string | null;
  learnMethod?: string | null;
  level?: number | null;
}

export type LearnerState = { status: "loading" } | { status: "error" } | { status: "ready"; learners: MoveLearner[] };

interface MoveGridProps {
  moves: MoveGridItem[];
  showLearnMethod?: boolean;
  showPokemonInfo?: boolean;
}

export default function MoveGrid({ moves, showLearnMethod = false, showPokemonInfo = true }: MoveGridProps) {
  const [openMove, setOpenMove] = useState<MoveGridItem | null>(null);
  const [learnerCache, setLearnerCache] = useState<Record<number, LearnerState>>({});

  async function handleShowPokemon(move: MoveGridItem) {
    setOpenMove(move);

    if (learnerCache[move.id]) return;

    setLearnerCache((prev) => ({ ...prev, [move.id]: { status: "loading" } }));

    try {
      const response = await fetch(`/api/moves/${move.id}/pokemon`);
      if (!response.ok) throw new Error("Fehler beim Laden");

      const data = await response.json();

      setLearnerCache((prev) => ({ ...prev, [move.id]: { status: "ready", learners: data.pokemon } }));
    } catch {
      setLearnerCache((prev) => ({ ...prev, [move.id]: { status: "error" } }));
    }
  }

  if (moves.length === 0) {
    return <p className="text-center text-slate-500">Keine Attacken gefunden.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3 px-4 pt-6">
        {moves.map((move) => (
          <MoveCard key={move.id} move={move} showLearnMethod={showLearnMethod} showPokemonInfo={showPokemonInfo} onShowPokemon={handleShowPokemon} />
        ))}
      </div>

      {openMove && showPokemonInfo && (
        <MovePokemonModal move={openMove} state={learnerCache[openMove.id] ?? { status: "loading" }} onClose={() => setOpenMove(null)} />
      )}
    </>
  );
}
