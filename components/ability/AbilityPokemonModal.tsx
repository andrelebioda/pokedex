"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import AbilityPokemonList from "@/components/ability/AbilityPokemonList";
import { AbilityGridItem, AbilityLearnerState } from "@/components/ability/AbilityGrid";

interface AbilityPokemonModalProps {
  ability: AbilityGridItem;
  state: AbilityLearnerState;
  onClose: () => void;
}

export default function AbilityPokemonModal({ ability, state, onClose }: AbilityPokemonModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{ability.nameDe}</h2>
            <p className="text-sm text-slate-400">Pokémon, die diese Fähigkeit haben können</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="scrollbar-red overflow-y-auto p-4">
          <AbilityPokemonList state={state} />
        </div>
      </div>
    </div>
  );
}
