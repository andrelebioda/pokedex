import Image from "next/image";
import Link from "next/link";

import { glassCard, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import PokemonImage from "@/components/pokemon/PokemonImage";
import { getPokemonTypeClass, getPokemonTypeColorVar, getPokemonTypeIconPath } from "@/config/pokemonTypes";
import { accentStyle } from "@/config/sections";

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

  const typeColors = accentStyle(getPokemonTypeColorVar(primaryType), getPokemonTypeColorVar(secondaryType));

  return (
    <Link href={`/pokemon/${pokemon.id}`} style={typeColors} className={`${glassCard} flex p-2 hover:-translate-y-1 sm:flex-col sm:p-3`}>
      <GlassBlobs />

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

      {/* Mobil: eine Glasfläche über die ganze Karte mit Bild und Info. Ab sm löst sie sich auf (contents). */}
      <div className={`${glassPanel} flex min-w-0 flex-1 items-center gap-2 p-1.5 sm:contents`}>
        {/* Bild */}
        <div className="relative flex w-1/3 shrink-0 items-center justify-center sm:w-full sm:pt-6 sm:pb-2">
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

        {/* Info, ab sm als eigene Glasfläche */}
        <div
          className="
            min-w-0
            flex-1
            py-2
            pr-2
            sm:rounded-2xl
            sm:border
            sm:border-white/15
            sm:bg-white/10
            sm:p-4
            sm:shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]
            sm:backdrop-blur-md
          "
        >
          <span className="font-mono text-sm md:text-lg font-semibold text-white/60">{dexNumber}</span>

          <h3 className="truncate text-xl xl:text-2xl font-bold text-white">{pokemon.name}</h3>

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
                  md:pr-3
                  pl-1
                  text-xs
                  md:text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  ring-1
                  ring-white/20
                  ${getPokemonTypeClass(type.slug)}
                `}
              >
                <Image
                  src={getPokemonTypeIconPath(type.slug)}
                  alt=""
                  width={20}
                  height={20}
                  className="md:mr-1 size-5 shrink-0 rounded-full ring-2 ring-white/40"
                />
                <span className="truncate">{type.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
