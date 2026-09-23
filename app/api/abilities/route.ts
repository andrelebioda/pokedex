import { NextRequest, NextResponse } from "next/server";

import { getAbilityList, AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

const VALID_SORTS: AbilitySort[] = ["name", "count"];
const VALID_HIDDEN: AbilityHiddenFilter[] = ["hidden", "visible"];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 50));
  const search = searchParams.get("search")?.trim() || undefined;
  const hidden =
    searchParams
      .get("hidden")
      ?.split(",")
      .map((value) => value.trim())
      .filter((value): value is AbilityHiddenFilter => VALID_HIDDEN.includes(value as AbilityHiddenFilter)) || undefined;
  const sortParam = searchParams.get("sort");
  const sort = VALID_SORTS.includes(sortParam as AbilitySort) ? (sortParam as AbilitySort) : undefined;

  const { abilities, hasMore } = await getAbilityList(page, limit, { search, hidden, sort });

  return NextResponse.json({ abilities, hasMore, page });
}
