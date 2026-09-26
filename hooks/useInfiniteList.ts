import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteListOptions<T> {
  initialItems: T[];
  initialHasMore: boolean;
  /** Ändert sich, sobald sich aktive Filter/Sortierung ändern — setzt die Liste dann auf initialItems zurück. */
  filterKey: string;
  getId: (item: T) => number | string;
  fetchPage: (page: number) => Promise<{ items: T[]; hasMore: boolean }>;
}

interface UseInfiniteListResult<T> {
  items: T[];
  hasMore: boolean;
  loading: boolean;
  error: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  retry: () => void;
}

/** Infinite-Scroll-Pagination: lädt über `fetchPage` nach, sobald der Sentinel-Div sichtbar wird. */
export function useInfiniteList<T>({
  initialItems,
  initialHasMore,
  filterKey,
  getId,
  fetchPage,
}: UseInfiniteListOptions<T>): UseInfiniteListResult<T> {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Reset bei Filterwechsel, ohne die Liste neu zu mounten — bereits gerenderte
  // Items (per id gematcht) behalten ihre Komponenten-Instanz (z.B. Bilder laden nicht neu).
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
      const data = await fetchPage(nextPage);

      setPage(nextPage);
      setHasMore(data.hasMore);

      setItems((prev) => {
        const existingIds = new Set(prev.map(getId));
        const newItems = data.items.filter((item) => !existingIds.has(getId(item)));
        return [...prev, ...newItems];
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, fetchPage, getId]);

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

  return { items, hasMore, loading, error, sentinelRef, retry: loadNextPage };
}
