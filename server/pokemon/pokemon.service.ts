import type { Prisma } from "@prisma/client";
import { cache } from "react";

import { prisma } from "@/server/db/prisma";
import { mapPokemon, MappedPokemon, MappedPokemonMove } from "@/server/pokemon/pokemon.mapper";

export type PokemonSort = "number-asc" | "number-desc" | "name-asc" | "name-desc" | "type-asc" | "type-desc";

export interface PokemonListFilters {
  search?: string;
  types?: string[];
  generations?: number[];
  sort?: PokemonSort;
}

export interface PokemonListResult {
  pokemon: MappedPokemon[];
  hasMore: boolean;
}

export function buildPokemonWhere(filters: PokemonListFilters = {}): Prisma.PokemonWhereInput {
  const { search, types, generations } = filters;

  return {
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

    ...(generations && generations.length > 0
      ? {
          generation: {
            in: generations,
          },
        }
      : {}),
  };
}

export function sortMappedPokemon(pokemon: MappedPokemon[], sort: PokemonSort = "number-asc"): MappedPokemon[] {
  return pokemon.sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);

    if (sort === "type-asc" || sort === "type-desc") {
      const typeA = a.types[0]?.name ?? "";
      const typeB = b.types[0]?.name ?? "";
      const compare = typeA.localeCompare(typeB);
      return (sort === "type-desc" ? -compare : compare) || a.id - b.id;
    }

    return sort === "number-desc" ? b.id - a.id : a.id - b.id;
  });
}

export const POKEMON_LIST_SELECT = {
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
    orderBy: { slot: "asc" as const },
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
} satisfies Prisma.PokemonSelect;

export async function getPokemonList(page = 1, limit = 50, filters: PokemonListFilters = {}): Promise<PokemonListResult> {
  const { sort = "number-asc" } = filters;

  const pokemon = await prisma.pokemon.findMany({
    where: buildPokemonWhere(filters),
    select: POKEMON_LIST_SELECT,
    relationLoadStrategy: "join",
  });

  const mapped = sortMappedPokemon(pokemon.map(mapPokemon), sort);

  const start = (page - 1) * limit;
  const pageItems = mapped.slice(start, start + limit);
  const hasMore = start + limit < mapped.length;

  return {
    pokemon: pageItems,
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
        orderBy: { slot: "asc" },
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

export interface PokemonMovesResult {
  moves: MappedPokemonMove[];
  hasMore: boolean;
}

export async function getMovesForPokemon(
  pokemonId: number,
  page = 1,
  limit = 30,
  filters: { search?: string } = {},
): Promise<PokemonMovesResult> {
  const { search } = filters;

  const where: Prisma.PokemonMoveWhereInput = {
    pokemonId,

    ...(search
      ? {
          move: {
            translations: {
              some: {
                language: "de",
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        }
      : {}),
  };

  const moves = await prisma.pokemonMove.findMany({
    where,
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

  const mapped = moves
    .map((pokemonMove) => ({
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
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const start = (page - 1) * limit;
  const pageItems = mapped.slice(start, start + limit);
  const hasMore = start + limit < mapped.length;

  return { moves: pageItems, hasMore };
}
