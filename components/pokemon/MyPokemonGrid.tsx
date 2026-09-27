"use client";

import { useFavorites } from "@/components/providers/FavoritesProvider";
import PokemonCard, { PokemonListItem } from "@/components/pokemon/PokemonCard";

interface MyPokemonGridProps {
  pokemon: PokemonListItem[];
}

export default function MyPokemonGrid({ pokemon }: MyPokemonGridProps) {
  const { favoriteIds, ready } = useFavorites();

  // Solange favoriteIds noch nicht geladen ist, die Server-Liste unverändert zeigen, statt kurz "leer" aufzublitzen.
  const visible = ready ? pokemon.filter((poke) => favoriteIds.has(poke.id)) : pokemon;

  if (visible.length === 0) {
    return <p className="text-center text-slate-500">Du hast noch keine Pokémon favorisiert. Klicke auf das Herz-Symbol bei einem Pokémon.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {visible.map((poke) => (
        <PokemonCard key={poke.id} pokemon={poke} />
      ))}
    </div>
  );
}
