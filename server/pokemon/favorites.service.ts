import { prisma } from "@/server/db/prisma";
import { mapPokemon, MappedPokemon } from "@/server/pokemon/pokemon.mapper";
import { buildPokemonWhere, POKEMON_LIST_SELECT, PokemonListFilters, sortMappedPokemon } from "@/server/pokemon/pokemon.service";

export async function getFavoritePokemonIds(userId: string): Promise<number[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { pokemonId: true },
  });

  return favorites.map((favorite) => favorite.pokemonId);
}

export async function isPokemonFavorited(userId: string, pokemonId: number): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_pokemonId: { userId, pokemonId } },
  });

  return favorite !== null;
}

export async function toggleFavoritePokemon(userId: string, pokemonId: number): Promise<boolean> {
  const existing = await prisma.favorite.findUnique({
    where: { userId_pokemonId: { userId, pokemonId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return false;
  }

  await prisma.favorite.create({ data: { userId, pokemonId } });
  return true;
}

export async function getFavoritePokemonList(userId: string, filters: PokemonListFilters = {}): Promise<MappedPokemon[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId, pokemon: buildPokemonWhere(filters) },
    select: { pokemon: { select: POKEMON_LIST_SELECT } },
    relationLoadStrategy: "join",
  });

  const mapped = favorites.map((favorite) => mapPokemon(favorite.pokemon));
  return sortMappedPokemon(mapped, filters.sort);
}
