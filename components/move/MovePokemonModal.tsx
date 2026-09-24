"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import MovePokemonList from "@/components/move/MovePokemonList";
import { LearnerState, MoveGridItem } from "@/components/move/MoveGrid";
import { getPokemonTypeColorVar } from "@/config/pokemonTypes";
import { accentStyle } from "@/config/sections";

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
        style={accentStyle(getPokemonTypeColorVar(move.typeSlug))}
        className="relative isolate flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 bg-[linear-gradient(150deg,color-mix(in_oklab,var(--accent)_45%,transparent),color-mix(in_oklab,var(--accent-2,var(--accent))_20%,transparent))] shadow-2xl backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{move.nameDe}</h2>
            <p className="text-sm text-white/70">Pokémon, die diese Attacke lernen können</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="rounded-xl border border-white/10 bg-white/10 p-2 text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
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
