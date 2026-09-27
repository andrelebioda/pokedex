import { prisma } from "@/server/db/prisma";
import { mapPokemon, MappedPokemon } from "@/server/pokemon/pokemon.mapper";

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

export async function getFavoritePokemonList(userId: string): Promise<MappedPokemon[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      pokemon: {
        select: {
          id: true,
          sprite: true,

          translations: {
            where: { language: "de" },
            select: { name: true },
          },

          types: {
            orderBy: { slot: "asc" },
            select: {
              type: {
                select: {
                  apiName: true,
                  translations: {
                    where: { language: "de" },
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      },
    },

    relationLoadStrategy: "join",
  });

  return favorites.map((favorite) => mapPokemon(favorite.pokemon));
}
