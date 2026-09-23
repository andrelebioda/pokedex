import { NextRequest, NextResponse } from "next/server";

import { getMoveList, MoveSort } from "@/server/move/move.service";

const VALID_SORTS: MoveSort[] = ["name", "type"];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 50));
  const search = searchParams.get("search")?.trim() || undefined;
  const types =
    searchParams
      .get("types")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) || undefined;
  const sortParam = searchParams.get("sort");
  const sort = VALID_SORTS.includes(sortParam as MoveSort) ? (sortParam as MoveSort) : undefined;

  const { moves, hasMore } = await getMoveList(page, limit, { search, types, sort });

  return NextResponse.json({ moves, hasMore, page });
}
