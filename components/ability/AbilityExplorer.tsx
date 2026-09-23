"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AbilityGrid, { AbilityGridItem } from "@/components/ability/AbilityGrid";
import { AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

const LIMIT = 50;

interface AbilityExplorerProps {
  initialAbilities: AbilityGridItem[];
  initialHasMore: boolean;
  search?: string;
  hidden?: AbilityHiddenFilter[];
  sort?: AbilitySort;
}

export default function AbilityExplorer({
  initialAbilities,
  initialHasMore,
  search = "",
  hidden = [],
  sort = "name-asc",
}: AbilityExplorerProps) {
  const filterKey = `${search}::${hidden.join(",")}::${sort}`;

  const [abilities, setAbilities] = useState(initialAbilities);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setAbilities(initialAbilities);
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
      if (hidden.length > 0) params.set("hidden", hidden.join(","));
      if (sort !== "name-asc") params.set("sort", sort);

      const response = await fetch(`/api/abilities?${params.toString()}`);
      if (!response.ok) throw new Error("Fähigkeiten konnten nicht geladen werden");

      const data = await response.json();

      setPage(nextPage);
      setHasMore(data.hasMore);

      setAbilities((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = (data.abilities as AbilityGridItem[]).filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, hidden, sort]);

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

  if (abilities.length === 0) {
    return <p className="text-center text-slate-500">Keine Fähigkeiten gefunden.</p>;
  }

  return (
    <div>
      <AbilityGrid abilities={abilities} />

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center px-4 pb-6">
          {loading && <p className="text-slate-400">Lade weitere Fähigkeiten…</p>}

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

      {!hasMore && abilities.length > 0 && <p className="px-4 pb-6 text-center text-slate-500">Alle Fähigkeiten geladen ({abilities.length})</p>}
    </div>
  );
}
