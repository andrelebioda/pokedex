"use client";

import { useCallback } from "react";

import MoveGrid, { MoveGridItem } from "@/components/move/MoveGrid";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import { getMoveListAction } from "@/server/move/move.actions";
import { MoveSort } from "@/server/move/move.service";

const LIMIT = 50;

interface MoveExplorerProps {
  initialMoves: MoveGridItem[];
  initialHasMore: boolean;
  search?: string;
  types?: string[];
  sort?: MoveSort;
  minPower?: number;
  maxPower?: number;
}

export default function MoveExplorer({
  initialMoves,
  initialHasMore,
  search = "",
  types = [],
  sort = "name-asc",
  minPower,
  maxPower,
}: MoveExplorerProps) {
  const fetchPage = useCallback(
    (page: number) =>
      getMoveListAction(page, LIMIT, { search, types, sort, minPower, maxPower }).then((data) => ({
        items: data.moves,
        hasMore: data.hasMore,
      })),
    [search, types, sort, minPower, maxPower],
  );

  const { items: moves, hasMore, loading, error, sentinelRef, retry } = useInfiniteList({
    initialItems: initialMoves,
    initialHasMore,
    filterKey: `${search}::${types.join(",")}::${sort}::${minPower ?? ""}::${maxPower ?? ""}`,
    getId: (item) => item.id,
    fetchPage,
  });

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
              onClick={retry}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-slate-300 hover:border-slate-700 hover:text-white"
            >
              Erneut versuchen
            </button>
          )}
        </div>
      )}

      {!hasMore && moves.length > 0 && <p className="px-4 pt-6 pb-6 text-center text-slate-500">Alle Attacken geladen ({moves.length})</p>}
    </div>
  );
}
