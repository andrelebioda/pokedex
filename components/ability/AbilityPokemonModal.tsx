"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import AbilityPokemonList from "@/components/ability/AbilityPokemonList";
import { AbilityGridItem, AbilityLearnerState } from "@/components/ability/AbilityGrid";
import { accentStyle, sections } from "@/config/sections";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        style={accentStyle(sections.abilities.accent, sections.abilities.accent2)}
        className="relative isolate flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 bg-[linear-gradient(150deg,color-mix(in_oklab,var(--accent)_45%,transparent),color-mix(in_oklab,var(--accent-2,var(--accent))_20%,transparent))] shadow-2xl backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{ability.nameDe}</h2>
            <p className="text-sm text-white/70">Pokémon, die diese Fähigkeit haben können</p>
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
          <AbilityPokemonList state={state} />
        </div>
      </div>
    </div>
  );
}
