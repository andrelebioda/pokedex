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
        gap-4
        overflow-hidden
        rounded-3xl
        border
        border-white/5
        bg-slate-900
        p-3
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[color-mix(in_oklab,var(--type-a)_45%,transparent)]
        hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--type-a)_60%,transparent)]
        sm:flex-col
        sm:items-stretch
        sm:gap-0
        sm:p-0
      "
    >
      {/* Bild */}
      <div
        className="
          relative
          flex
          w-2/5
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          bg-[linear-gradient(135deg,color-mix(in_oklab,var(--type-a)_40%,transparent),color-mix(in_oklab,var(--type-b)_15%,transparent))]
          py-3
          sm:w-full
          sm:rounded-none
          sm:pt-8
          sm:pb-4
        "
      >
        {/* Nummer als Wasserzeichen */}
        <span
          aria-hidden
          className="
            pointer-events-none
            absolute
            top-2
            right-3
            hidden
            select-none
            text-5xl
            font-black
            tracking-tighter
            text-white/10
            sm:block
          "
        >
          {dexNumber}
        </span>

        {/* Glow hinter dem Pokémon */}
        <div
          aria-hidden
          className="
            absolute
            left-1/2
            top-1/2
            size-3/4
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-(--type-a)
            opacity-25
            blur-3xl
            transition-opacity
            duration-300
            group-hover:opacity-45
          "
        />

        <div className="relative w-full transition-transform duration-300 group-hover:scale-110">
          <PokemonImage src={pokemon.image} alt={pokemon.name} />
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 sm:px-5 sm:pt-4 sm:pb-5">
        <span className="font-mono text-sm font-semibold text-slate-500">{dexNumber}</span>

        <h3 className="truncate text-xl font-bold text-white">{pokemon.name}</h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type.slug}
              className={`
                flex
                h-7
                items-center
                gap-1.5
                rounded-full
                py-1
                pr-3
                pl-1
                text-xs
                font-semibold
                text-white
                shadow-sm
                ${getPokemonTypeClass(type.slug)}
              `}
            >
              <img
                src={getPokemonTypeIconPath(type.slug)}
                alt=""
                className="size-5 rounded-full ring-2 ring-white/40"
              />
              {type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Typ-Akzent unten */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 hidden h-1 bg-[linear-gradient(90deg,var(--type-a),var(--type-b))] opacity-70 sm:block"
      />
    </Link>
  );
}
