import Link from "next/link";

import PokemonImage from "@/components/pokemon/PokemonImage";
import { getPokemonTypeClass } from "@/config/pokemonTypes";

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
  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="
        group
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-5
        shadow-lg
        transition-all
        hover:-translate-y-1
        hover:border-slate-700
        hover:shadow-xl
        hover:shadow-red-500/10
      "
    >
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-1">
        {/* Bild */}
        <div
          className="
          flex
          justify-center
          rounded-xl
          bg-slate-800/50
          py-4"
        >
          <PokemonImage src={pokemon.image} alt={pokemon.name} />
        </div>

        {/* Info */}
        <div className="mt-4">
          <strong className="text-md text-slate-500">#{String(pokemon.id).padStart(3, "0")}</strong>

          <h3 className="text-xl font-bold text-white">{pokemon.name}</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.slug}
                className={`
              flex
              h-6
              w-20
              items-center
              justify-center
              rounded-full
              text-xs
              font-semibold
              text-white
              ${getPokemonTypeClass(type.slug)}
                `}
              >
                {type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
