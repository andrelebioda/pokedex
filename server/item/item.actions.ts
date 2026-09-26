"use server";

import { getItemsForGroup, ItemListFilters, ItemListResult } from "@/server/item/item.service";

export async function getItemsForGroupAction(
  groupSlug: string,
  page: number,
  limit: number,
  filters: ItemListFilters,
): Promise<ItemListResult | null> {
  return getItemsForGroup(groupSlug, page, limit, filters);
}
