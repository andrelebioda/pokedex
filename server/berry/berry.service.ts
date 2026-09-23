import type { Prisma } from "@prisma/client";

import { formatBerryFirmness, formatBerryFlavor } from "@/config/berries";
import { prisma } from "@/server/db/prisma";

export interface MappedBerryFlavor {
  slug: string;
  name: string;
  potency: number;
}

export interface MappedBerry {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  growthTime: number | null;
  maxHarvest: number | null;
  size: number | null;
  smoothness: number | null;
  soilDryness: number | null;
  firmness: string | null;
  naturalGiftPower: number | null;
  naturalGiftType: string | null;
  naturalGiftTypeName: string | null;
  flavors: MappedBerryFlavor[];
}

export type BerrySort = "name-asc" | "name-desc" | "growth-asc" | "growth-desc" | "power-asc" | "power-desc";

interface BerryListFilters {
  search?: string;
  types?: string[];
  sort?: BerrySort;
  minPower?: number;
  maxPower?: number;
}

export async function getAllBerries(filters: BerryListFilters = {}): Promise<MappedBerry[]> {
  const { search, types: selectedTypes, sort = "name-asc", minPower, maxPower } = filters;

  const types = await prisma.type.findMany({
    select: {
      apiName: true,
      translations: {
        where: { language: "de" },
        select: { name: true },
      },
    },
  });

  const typeNameBySlug = new Map(types.map((type) => [type.apiName, type.translations[0]?.name ?? type.apiName]));

  const where: Prisma.BerryWhereInput = {
    item: {
      sprite: { not: null },

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
    },

    ...(selectedTypes && selectedTypes.length > 0
      ? {
          naturalGiftType: {
            in: selectedTypes,
          },
        }
      : {}),

    ...(minPower != null || maxPower != null
      ? {
          naturalGiftPower: {
            ...(minPower != null ? { gte: minPower } : {}),
            ...(maxPower != null ? { lte: maxPower } : {}),
          },
        }
      : {}),
  };

  const berries = await prisma.berry.findMany({
    where,
    select: {
      id: true,
      apiName: true,
      growthTime: true,
      maxHarvest: true,
      size: true,
      smoothness: true,
      soilDryness: true,
      firmness: true,
      naturalGiftPower: true,
      naturalGiftType: true,

      item: {
        select: {
          sprite: true,
          translations: {
            where: { language: "de" },
            select: { name: true, description: true },
          },
        },
      },

      flavors: {
        select: { flavor: true, potency: true },
      },
    },

    relationLoadStrategy: "join",
  });

  return berries
    .map((berry) => ({
      id: berry.id,
      name: berry.item?.translations[0]?.name ?? berry.apiName,
      slug: berry.apiName,
      image: berry.item?.sprite ?? null,
      description: berry.item?.translations[0]?.description ?? null,
      growthTime: berry.growthTime,
      maxHarvest: berry.maxHarvest,
      size: berry.size,
      smoothness: berry.smoothness,
      soilDryness: berry.soilDryness,
      firmness: formatBerryFirmness(berry.firmness),
      naturalGiftPower: berry.naturalGiftPower,
      naturalGiftType: berry.naturalGiftType,
      naturalGiftTypeName: berry.naturalGiftType ? (typeNameBySlug.get(berry.naturalGiftType) ?? berry.naturalGiftType) : null,
      flavors: berry.flavors
        .filter((flavor) => flavor.potency > 0)
        .map((flavor) => ({
          slug: flavor.flavor,
          name: formatBerryFlavor(flavor.flavor),
          potency: flavor.potency,
        }))
        .sort((a, b) => b.potency - a.potency),
    }))
    .sort((a, b) => {
      if (sort === "growth-asc" || sort === "growth-desc") {
        if (a.growthTime == null) return 1;
        if (b.growthTime == null) return -1;

        const compare = a.growthTime - b.growthTime;
        return (sort === "growth-desc" ? -compare : compare) || a.name.localeCompare(b.name);
      }

      if (sort === "power-asc" || sort === "power-desc") {
        if (a.naturalGiftPower == null) return 1;
        if (b.naturalGiftPower == null) return -1;

        const compare = a.naturalGiftPower - b.naturalGiftPower;
        return (sort === "power-desc" ? -compare : compare) || a.name.localeCompare(b.name);
      }

      const compare = a.name.localeCompare(b.name);
      return sort === "name-desc" ? -compare : compare;
    });
}

export async function getBerryCount() {
  return prisma.berry.count();
}
