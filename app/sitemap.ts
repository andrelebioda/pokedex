import type { MetadataRoute } from "next";

import { itemCategoryGroups } from "@/config/itemCategories";
import { prisma } from "@/server/db/prisma";

const BASE_URL = "https://www.pokelabs.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pokemon = await prisma.pokemon.findMany({ select: { id: true } });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/pokemon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/moves`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/abilities`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/items`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/berries`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const itemGroupRoutes: MetadataRoute.Sitemap = itemCategoryGroups.map((group) => ({
    url: `${BASE_URL}/items/${group.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const pokemonRoutes: MetadataRoute.Sitemap = pokemon.map((entry) => ({
    url: `${BASE_URL}/pokemon/${entry.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...itemGroupRoutes, ...pokemonRoutes];
}
