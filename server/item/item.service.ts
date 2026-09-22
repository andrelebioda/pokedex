import type { Prisma } from "@prisma/client";

import { formatItemCategoryLabel, getItemCategoryGroupBySlug, itemCategoryGroups } from "@/config/itemCategories";
import { prisma } from "@/server/db/prisma";

export interface ItemCategoryOption {
  slug: string;
  name: string;
}

export interface MappedItem {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  category: string | null;
  categoryName: string | null;
  effect: string | null;
}

export interface ItemCategoryGroup {
  category: string;
  categoryName: string;
  items: MappedItem[];
}

export interface ItemGroupOverview {
  slug: string;
  name: string;
  categoryCount: number;
  itemCount: number;
  categories: ItemCategoryOption[];
}

interface ItemListFilters {
  search?: string;
  categories?: string[];
}

const hasImage: Prisma.itemWhereInput = {
  sprite: { not: null },
};

export async function getItemGroupOverview(): Promise<ItemGroupOverview[]> {
  const allCategorySlugs = itemCategoryGroups.flatMap((group) => group.categories);

  const counts = await prisma.item.groupBy({
    by: ["category"],
    where: {
      category: {
        in: allCategorySlugs,
      },
      ...hasImage,
    },
    _count: {
      _all: true,
    },
  });

  const countByCategory = new Map(counts.map((entry) => [entry.category, entry._count._all]));

  return itemCategoryGroups.map((group) => ({
    slug: group.slug,
    name: group.name,
    categoryCount: group.categories.length,
    itemCount: group.categories.reduce((sum, category) => sum + (countByCategory.get(category) ?? 0), 0),
    categories: group.categories
      .map((category) => ({ slug: category, name: formatItemCategoryLabel(category) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

export function getGroupCategoryOptions(groupSlug: string): ItemCategoryOption[] {
  const group = getItemCategoryGroupBySlug(groupSlug);
  if (!group) return [];

  return group.categories.map((category) => ({
    slug: category,
    name: formatItemCategoryLabel(category),
  }));
}

export async function getItemsForGroup(groupSlug: string, filters: ItemListFilters = {}): Promise<ItemCategoryGroup[] | null> {
  const group = getItemCategoryGroupBySlug(groupSlug);
  if (!group) return null;

  const { search, categories } = filters;

  const restrictedCategories = categories?.length ? categories.filter((category) => group.categories.includes(category)) : [];

  const activeCategories = restrictedCategories.length > 0 ? restrictedCategories : group.categories;

  const where: Prisma.itemWhereInput = {
    category: {
      in: activeCategories,
    },

    ...hasImage,

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

  const items = await prisma.item.findMany({
    where,
    select: {
      id: true,
      apiName: true,
      sprite: true,
      category: true,
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

    relationLoadStrategy: "join",
  });

  const mappedItems: MappedItem[] = items
    .map((item) => ({
      id: item.id,
      name: item.translations[0]?.name ?? item.apiName,
      slug: item.apiName,
      image: item.sprite,
      category: item.category,
      categoryName: item.category ? formatItemCategoryLabel(item.category) : null,
      effect: item.translations[0]?.description ?? item.effect,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (group.flat) {
    return [{ category: group.slug, categoryName: group.name, items: mappedItems }];
  }

  const groups = new Map<string, ItemCategoryGroup>();

  for (const item of mappedItems) {
    const category = item.category ?? "other";
    const categoryName = item.categoryName ?? "Sonstige";

    if (!groups.has(category)) {
      groups.set(category, { category, categoryName, items: [] });
    }

    groups.get(category)!.items.push(item);
  }

  return Array.from(groups.values()).sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}
