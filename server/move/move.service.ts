import type { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

export type MoveSort = "name-asc" | "name-desc" | "type-asc" | "type-desc" | "power-asc" | "power-desc";

export interface MoveListFilters {
  search?: string;
  types?: string[];
  minPower?: number;
  maxPower?: number;
  sort?: MoveSort;
}

export interface MappedMoveListItem {
  id: number;
  nameDe: string;
  nameEn: string;
  slug: string;
  type: string;
  typeSlug: string;
  damageClass: string | null;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number | null;
  description: string | null;
}

export interface MoveListResult {
  moves: MappedMoveListItem[];
  hasMore: boolean;
}

export async function getMoveList(page = 1, limit = 50, filters: MoveListFilters = {}): Promise<MoveListResult> {
  const { search, types, minPower, maxPower, sort = "name-asc" } = filters;

  const where: Prisma.MoveWhereInput = {
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
          type: {
            apiName: {
              in: types,
            },
          },
        }
      : {}),

    ...(minPower != null || maxPower != null
      ? {
          power: {
            ...(minPower != null ? { gte: minPower } : {}),
            ...(maxPower != null ? { lte: maxPower } : {}),
          },
        }
      : {}),
  };

  const moves = await prisma.move.findMany({
    where,
    select: {
      id: true,
      apiName: true,
      power: true,
      accuracy: true,
      pp: true,
      priority: true,
      damageClass: true,
      effect: true,

      translations: {
        where: {
          language: { in: ["de", "en"] },
        },
        select: {
          language: true,
          name: true,
          description: true,
        },
      },

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

    relationLoadStrategy: "join",
  });

  const mapped = moves
    .map((move) => ({
      id: move.id,
      nameDe: move.translations.find((t) => t.language === "de")?.name ?? move.apiName,
      nameEn: move.translations.find((t) => t.language === "en")?.name ?? move.apiName,
      slug: move.apiName,
      type: move.type.translations[0]?.name ?? move.type.apiName,
      typeSlug: move.type.apiName,
      damageClass: move.damageClass,
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
      priority: move.priority,
      description: move.translations.find((t) => t.language === "de")?.description ?? move.translations.find((t) => t.language === "en")?.description ?? move.effect,
    }))
    .sort((a, b) => {
      if (sort === "type-asc" || sort === "type-desc") {
        const compare = a.type.localeCompare(b.type);
        return (sort === "type-desc" ? -compare : compare) || a.nameDe.localeCompare(b.nameDe);
      }

      if (sort === "power-asc" || sort === "power-desc") {
        const compare = (a.power ?? -1) - (b.power ?? -1);
        return (sort === "power-desc" ? -compare : compare) || a.nameDe.localeCompare(b.nameDe);
      }

      const compare = a.nameDe.localeCompare(b.nameDe);
      return sort === "name-desc" ? -compare : compare;
    });

  const start = (page - 1) * limit;
  const pageItems = mapped.slice(start, start + limit);
  const hasMore = start + limit < mapped.length;

  return { moves: pageItems, hasMore };
}

export interface MoveLearner {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  types: { slug: string; name: string }[];
  learnMethod: string | null;
  level: number | null;
}

export async function getPokemonForMove(moveId: number): Promise<MoveLearner[]> {
  const learners = await prisma.pokemonMove.findMany({
    where: { moveId },
    select: {
      learnMethod: true,
      level: true,

      pokemon: {
        select: {
          id: true,
          apiName: true,
          sprite: true,

          translations: {
            where: { language: "de" },
            select: { name: true },
          },

          types: {
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

  return learners
    .map((entry) => ({
      id: entry.pokemon.id,
      name: entry.pokemon.translations[0]?.name ?? entry.pokemon.apiName,
      slug: entry.pokemon.apiName,
      image: entry.pokemon.sprite,
      types: entry.pokemon.types.map((t) => ({
        slug: t.type.apiName,
        name: t.type.translations[0]?.name ?? t.type.apiName,
      })),
      learnMethod: entry.learnMethod,
      level: entry.level,
    }))
    .sort((a, b) => a.id - b.id);
}
