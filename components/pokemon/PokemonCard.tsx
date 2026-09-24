import type { CSSProperties } from "react";
import Link from "next/link";

import PokemonImage from "@/components/pokemon/PokemonImage";
import { getPokemonTypeClass, getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";

export interface PokemonListItem {
  id: number;
  name: string;
  image?: string | null;
  types: {
    slug: string;
    name: string;
  }[];
}

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.slug;
  const secondaryType = pokemon.types[1]?.slug ?? primaryType;
  const dexNumber = `#${String(pokemon.id).padStart(3, "0")}`;

  const typeColors = {
    "--type-a": getPokemonTypeColorVar(primaryType),
    "--type-b": getPokemonTypeColorVar(secondaryType),
  } as CSSProperties;

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      style={typeColors}
      className="
        group
        relative
        isolate
        flex
        items-center
        gap-3
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-slate-900
        bg-[linear-gradient(150deg,color-mix(in_oklab,var(--type-a)_55%,transparent),color-mix(in_oklab,var(--type-b)_35%,transparent))]
        p-3
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[color-mix(in_oklab,var(--type-a)_60%,transparent)]
        hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--type-a)_70%,transparent)]
        sm:flex-col
        sm:items-stretch
      "
    >
      {/* Farbflecken, die hinter dem Glas verschwimmen */}
      <div aria-hidden className="absolute -top-10 -left-10 -z-10 size-40 rounded-full bg-(--type-a) opacity-50 blur-2xl" />
      <div aria-hidden className="absolute -right-8 -bottom-10 -z-10 size-44 rounded-full bg-(--type-b) opacity-45 blur-2xl" />

      {/* Nummer als Wasserzeichen */}
      <span
        aria-hidden
        className="
          pointer-events-none
          absolute
          top-2
          right-3
          -z-10
          hidden
          select-none
          text-5xl
          font-black
          tracking-tighter
          text-white/15
          sm:block
        "
      >
        {dexNumber}
      </span>

      {/* Bild */}
      <div className="relative flex w-1/3 shrink-0 items-center justify-center py-2 sm:w-full sm:pt-6 sm:pb-2">
        <div
          aria-hidden
          className="
            absolute
            top-1/2
            left-1/2
            size-2/3
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white
            opacity-15
            blur-2xl
            transition-opacity
            duration-300
            group-hover:opacity-30
          "
        />

        <div className="relative w-full drop-shadow-[0_10px_15px_rgb(0_0_0/0.35)] transition-transform duration-300 group-hover:scale-110">
          <PokemonImage src={pokemon.image} alt={pokemon.name} />
        </div>
      </div>

      {/* Info als Glasfläche */}
      <div
        className="
          min-w-0
          flex-1
          rounded-2xl
          border
          border-white/15
          bg-white/10
          p-2.5
          shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]
          backdrop-blur-md
          min-[400px]:p-3
          sm:p-4
        "
      >
        <span className="font-mono text-sm font-semibold text-white/60">{dexNumber}</span>

        <h3 className="truncate text-xl font-bold text-white">{pokemon.name}</h3>

        <div className="mt-3 flex gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type.slug}
              className={`
                flex
                h-7
                min-w-0
                items-center
                gap-1
                rounded-full
                py-1
                pr-2.5
                pl-1
                text-xs
                font-semibold
                text-white
                shadow-sm
                ring-1
                ring-white/20
                ${getPokemonTypeClass(type.slug)}
              `}
            >
              <img src={getPokemonTypeIconPath(type.slug)} alt="" className="size-5 shrink-0 rounded-full ring-2 ring-white/40" />
              <span className="truncate">{type.name}</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
