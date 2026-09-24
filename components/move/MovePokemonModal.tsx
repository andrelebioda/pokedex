"use client";

import { X } from "lucide-react";
import { CSSProperties, useEffect } from "react";

import MovePokemonList from "@/components/move/MovePokemonList";
import { LearnerState, MoveGridItem } from "@/components/move/MoveGrid";
import { getPokemonTypeColorVar } from "@/config/pokemonTypes";

interface MovePokemonModalProps {
  move: MoveGridItem;
  state: LearnerState;
  onClose: () => void;
}

export default function MovePokemonModal({ move, state, onClose }: MovePokemonModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        style={{ "--accent": getPokemonTypeColorVar(move.typeSlug) } as CSSProperties}
        className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_25%,transparent),transparent_70%)] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{move.nameDe}</h2>
            <p className="text-sm text-slate-400">Pokémon, die diese Attacke lernen können</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="scrollbar-red overflow-y-auto p-4">
          <MovePokemonList state={state} />
        </div>
      </div>
    </div>
  );
}
