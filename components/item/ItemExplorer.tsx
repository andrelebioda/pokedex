"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ItemCard from "@/components/item/ItemCard";
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
  const filterKey = `${groupSlug}::${search}::${categories.join(",")}::${sort}`;

  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setItems(initialItems);
    setPage(1);
    setHasMore(initialHasMore);
    setLoading(false);
    setError(false);
  }

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    setError(false);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: String(nextPage), limit: String(LIMIT) });
      if (search) params.set("search", search);
      if (categories.length > 0) params.set("categories", categories.join(","));
      if (sort !== "name-asc") params.set("sort", sort);

      const response = await fetch(`/api/items/${groupSlug}?${params.toString()}`);
      if (!response.ok) throw new Error("Items konnten nicht geladen werden");

      const data = await response.json();

      setPage(nextPage);
      setHasMore(data.hasMore);

      setItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = (data.items as MappedItem[]).filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, categories, groupSlug, sort]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadNextPage]);

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
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{group.categoryName}</h2>

              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">{group.items.length}</span>
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
              onClick={loadNextPage}
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
