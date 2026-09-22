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
  const [pokemonCount, typeCount, moveCount, berryCount, abilityCount] = await Promise.all([
    prisma.pokemon.count(),
    prisma.type.count(),
    prisma.move.count(),
    prisma.berry.count(),
    prisma.ability.count(),
  ]);

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

    relationLoadStrategy: "join",
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
