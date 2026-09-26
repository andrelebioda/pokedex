"use client";

import { useCallback } from "react";

import AbilityGrid, { AbilityGridItem } from "@/components/ability/AbilityGrid";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { getAbilityListAction } from "@/server/ability/ability.actions";
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
  const fetchPage = useCallback(
    (page: number) =>
      getAbilityListAction(page, LIMIT, { search, hidden, sort }).then((data) => ({ items: data.abilities, hasMore: data.hasMore })),
    [search, hidden, sort],
  );

  const { items: abilities, hasMore, loading, error, sentinelRef, retry } = useInfiniteList({
    initialItems: initialAbilities,
    initialHasMore,
    filterKey: `${search}::${hidden.join(",")}::${sort}`,
    getId: (item) => item.id,
    fetchPage,
  });

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
              onClick={retry}
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
