"use server";

import { getMoveList, getPokemonForMove, MoveLearner, MoveListFilters, MoveListResult } from "@/server/move/move.service";

export async function getMoveListAction(page: number, limit: number, filters: MoveListFilters): Promise<MoveListResult> {
  return getMoveList(page, limit, filters);
}

export async function getPokemonForMoveAction(moveId: number): Promise<MoveLearner[]> {
  return getPokemonForMove(moveId);
}
