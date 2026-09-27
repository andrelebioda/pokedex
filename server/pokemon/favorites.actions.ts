"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth/authOptions";
import { getFavoritePokemonIds, toggleFavoritePokemon } from "@/server/pokemon/favorites.service";

export async function getFavoriteIdsAction(): Promise<number[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return getFavoritePokemonIds(session.user.id);
}

export async function toggleFavoriteAction(pokemonId: number): Promise<{ favorited: boolean } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Bitte melde dich an, um Pokémon zu favorisieren." };
  }

  const favorited = await toggleFavoritePokemon(session.user.id, pokemonId);
  return { favorited };
}
