import type { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";

export interface AbilityListFilters {
  search?: string;
}

export interface MappedAbilityListItem {
  id: number;
  nameDe: string;
  nameEn: string;
  slug: string;
  description: string | null;
  pokemonCount: number;
  hasHidden: boolean;
}

export async function getAbilityList(filters: AbilityListFilters = {}): Promise<MappedAbilityListItem[]> {
  const { search } = filters;

  const where: Prisma.AbilityWhereInput = {
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
  };

  const abilities = await prisma.ability.findMany({
    where,
    select: {
      id: true,
      apiName: true,
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

      pokemon: {
        select: {
          isHidden: true,
        },
      },
    },

    relationLoadStrategy: "join",
  });

  return abilities
    .map((ability) => ({
      id: ability.id,
      nameDe: ability.translations.find((t) => t.language === "de")?.name ?? ability.apiName,
      nameEn: ability.translations.find((t) => t.language === "en")?.name ?? ability.apiName,
      slug: ability.apiName,
      description:
        ability.translations.find((t) => t.language === "de")?.description ??
        ability.translations.find((t) => t.language === "en")?.description ??
        ability.effect,
      pokemonCount: ability.pokemon.length,
      hasHidden: ability.pokemon.some((entry) => entry.isHidden),
    }))
    .sort((a, b) => a.nameDe.localeCompare(b.nameDe));
}

export interface AbilityPokemon {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  types: { slug: string; name: string }[];
  isHidden: boolean;
}

export async function getPokemonForAbility(abilityId: number): Promise<AbilityPokemon[]> {
  const entries = await prisma.pokemonAbility.findMany({
    where: { abilityId },
    select: {
      isHidden: true,

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

  return entries
    .map((entry) => ({
      id: entry.pokemon.id,
      name: entry.pokemon.translations[0]?.name ?? entry.pokemon.apiName,
      slug: entry.pokemon.apiName,
      image: entry.pokemon.sprite,
      types: entry.pokemon.types.map((t) => ({
        slug: t.type.apiName,
        name: t.type.translations[0]?.name ?? t.type.apiName,
      })),
      isHidden: entry.isHidden,
    }))
    .sort((a, b) => a.id - b.id);
}
