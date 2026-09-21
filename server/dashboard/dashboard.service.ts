import { prisma } from "@/server/db/prisma";
import { mapPokemon, MappedPokemon } from "@/server/pokemon/pokemon.mapper";

export interface DashboardData {
  stats: {
    pokemonCount: number;
    typeCount: number;
    moveCount: number;
    berryCount: number;
    abilityCount: number;
  };
  pokemon: MappedPokemon[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const pokemonCount = await prisma.pokemon.count();

  const typeCount = await prisma.type.count();

  const moveCount = await prisma.move.count();

  const berryCount = await prisma.berry.count();

  const abilityCount = await prisma.ability.count();

  const randomIds = Array.from({ length: 8 }, () => Math.floor(Math.random() * pokemonCount) + 1);

  const randomPokemon = await prisma.pokemon.findMany({
    where: {
      id: {
        in: randomIds,
      },
    },

    select: {
      id: true,
      sprite: true,
      apiName: true,

      translations: {
        where: {
          language: "de",
        },
        select: {
          name: true,
        },
      },

      types: {
        select: {
          type: {
            select: {
              apiName: true,

              translations: {
                where: {
                  language: "de",
                },
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    stats: {
      pokemonCount,
      typeCount,
      moveCount,
      berryCount,
      abilityCount,
    },

    pokemon: randomPokemon.map(mapPokemon),
  };
}
