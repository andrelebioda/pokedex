"use client";

import { useCallback, useMemo } from "react";

import ItemCard from "@/components/item/ItemCard";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { getItemsForGroupAction } from "@/server/item/item.actions";
import { ItemSort, MappedItem } from "@/server/item/item.service";

const LIMIT = 60;

interface ItemExplorerProps {
  groupSlug: string;
  initialItems: MappedItem[];
  initialHasMore: boolean;
  hideHeader?: boolean;
  search?: string;
  categories?: string[];
  sort?: ItemSort;
}

export default function ItemExplorer({
  groupSlug,
  initialItems,
  initialHasMore,
  hideHeader = false,
  search = "",
  categories = [],
  sort = "name-asc",
}: ItemExplorerProps) {
  const fetchPage = useCallback(
    async (page: number) => {
      const data = await getItemsForGroupAction(groupSlug, page, LIMIT, { search, categories, sort });
      if (!data) throw new Error("Items konnten nicht geladen werden");
      return { items: data.items, hasMore: data.hasMore };
    },
    [groupSlug, search, categories, sort],
  );

  const { items, hasMore, loading, error, sentinelRef, retry } = useInfiniteList({
    initialItems,
    initialHasMore,
    filterKey: `${groupSlug}::${search}::${categories.join(",")}::${sort}`,
    getId: (item) => item.id,
    fetchPage,
  });

  const groups = useMemo(() => {
    const map = new Map<string, { category: string; categoryName: string; items: MappedItem[] }>();

    for (const item of items) {
      const category = item.category ?? "other";
      const categoryName = item.categoryName ?? "Sonstige";

      if (!map.has(category)) {
        map.set(category, { category, categoryName, items: [] });
      }

      map.get(category)!.items.push(item);
    }

    return Array.from(map.values()).sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }, [items]);

  if (items.length === 0) {
    return <p className="text-center text-slate-500">Keine Items gefunden.</p>;
  }

  return (
    <div className="space-y-10 px-4 py-6">
      {groups.map((group) => (
        <section key={group.category}>
          {!hideHeader && (
            <div className="mb-4 flex items-center gap-3 border-l-4 border-(--accent) pl-3">
              <h2 className="text-xl font-bold text-white">{group.categoryName}</h2>

              <span className="rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-(--accent)">
                {group.items.length}
              </span>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center">
          {loading && <p className="text-slate-400">Lade weitere Items…</p>}

          {error && (
            <button
              onClick={retry}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-slate-300 hover:border-slate-700 hover:text-white"
            >
              Erneut versuchen
            </button>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && <p className="text-center text-slate-500">Alle Items geladen ({items.length})</p>}
    </div>
  );
}
