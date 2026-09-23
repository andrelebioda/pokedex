"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import MoveGrid, { MoveGridItem } from "@/components/move/MoveGrid";
import { MoveSort } from "@/server/move/move.service";

const LIMIT = 50;

interface MoveExplorerProps {
  initialMoves: MoveGridItem[];
  initialHasMore: boolean;
  search?: string;
  types?: string[];
  sort?: MoveSort;
}

export default function MoveExplorer({ initialMoves, initialHasMore, search = "", types = [], sort = "name" }: MoveExplorerProps) {
  const filterKey = `${search}::${types.join(",")}::${sort}`;

  const [moves, setMoves] = useState(initialMoves);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setMoves(initialMoves);
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
      if (types.length > 0) params.set("types", types.join(","));
      if (sort !== "name") params.set("sort", sort);

      const response = await fetch(`/api/moves?${params.toString()}`);
      if (!response.ok) throw new Error("Attacken konnten nicht geladen werden");

      const data = await response.json();

      setPage(nextPage);
      setHasMore(data.hasMore);

      setMoves((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = (data.moves as MoveGridItem[]).filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, types, sort]);

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

  if (moves.length === 0) {
    return <p className="text-center text-slate-500">Keine Attacken gefunden.</p>;
  }

  return (
    <div>
      <MoveGrid moves={moves} />

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center px-4 pb-6">
          {loading && <p className="text-slate-400">Lade weitere Attacken…</p>}

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

      {!hasMore && moves.length > 0 && <p className="px-4 pb-6 text-center text-slate-500">Alle Attacken geladen ({moves.length})</p>}
    </div>
  );
}
