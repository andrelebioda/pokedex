import type { Prisma } from "@prisma/client";
import { cache } from "react";

import { prisma } from "@/server/db/prisma";
import { mapPokemon, MappedPokemonMove } from "@/server/pokemon/pokemon.mapper";

interface PokemonListFilters {
  search?: string;
  types?: string[];
}

export async function getPokemonList(page = 1, limit = 50, filters: PokemonListFilters = {}) {
  const { search, types } = filters;

  const where: Prisma.PokemonWhereInput = {
    ...(search
      ? {
          translations: {
            some: {
              language: "de",
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        }
      : {}),

    ...(types && types.length > 0
      ? {
          types: {
            some: {
              type: {
                apiName: {
                  in: types,
                },
              },
            },
          },
        }
      : {}),
  };

  const pokemon = await prisma.pokemon.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit + 1,
    orderBy: {
      id: "asc",
    },

    select: {
      id: true,
      sprite: true,

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

  const hasMore = pokemon.length > limit;

  return {
    pokemon: pokemon.slice(0, limit).map(mapPokemon),
    hasMore,
  };
}

export const getSinglePokemon = cache(async function getSinglePokemon(id: number) {
  const pokemon = await prisma.pokemon.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      apiName: true,
      height: true,
      weight: true,
      sprite: true,

      translations: {
        where: {
          language: "de",
        },
        select: {
          name: true,
          description: true,
          genus: true,
        },
      },

      stats: true,

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

      abilities: {
        select: {
          isHidden: true,

          ability: {
            select: {
              id: true,
              apiName: true,
              effect: true,

              translations: {
                where: {
                  language: "de",
                },
                select: {
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      },
    },

    relationLoadStrategy: "join",
  });

  if (!pokemon) return null;

  return mapPokemon(pokemon);
});

export async function getMovesForPokemon(pokemonId: number): Promise<MappedPokemonMove[]> {
  const moves = await prisma.pokemonMove.findMany({
    where: { pokemonId },
    select: {
      learnMethod: true,
      level: true,

      move: {
        select: {
          id: true,
          apiName: true,
          power: true,
          accuracy: true,
          pp: true,
          damageClass: true,
          priority: true,

          translations: {
            where: {
              language: "de",
            },
            select: {
              name: true,
              description: true,
            },
          },

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

  return moves.map((pokemonMove) => ({
    id: pokemonMove.move.id,
    name: pokemonMove.move.translations[0]?.name ?? pokemonMove.move.apiName,
    slug: pokemonMove.move.apiName,
    description: pokemonMove.move.translations[0]?.description ?? null,
    type: pokemonMove.move.type.translations[0]?.name ?? pokemonMove.move.type.apiName,
    typeSlug: pokemonMove.move.type.apiName,
    power: pokemonMove.move.power,
    accuracy: pokemonMove.move.accuracy,
    pp: pokemonMove.move.pp,
    damageClass: pokemonMove.move.damageClass,
    priority: pokemonMove.move.priority,
    learnMethod: pokemonMove.learnMethod,
    level: pokemonMove.level,
  }));
}
