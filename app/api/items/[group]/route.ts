import { NextRequest, NextResponse } from "next/server";

import { getItemsForGroup, ItemSort } from "@/server/item/item.service";

const VALID_SORTS: ItemSort[] = ["name-asc", "name-desc"];

export async function GET(request: NextRequest, { params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 60));
  const search = searchParams.get("search")?.trim() || undefined;
  const categories =
    searchParams
      .get("categories")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) || undefined;
  const sortParam = searchParams.get("sort");
  const sort = VALID_SORTS.includes(sortParam as ItemSort) ? (sortParam as ItemSort) : undefined;

  const result = await getItemsForGroup(group, page, limit, { search, categories, sort });

  if (!result) {
    return NextResponse.json({ error: "Kategorie nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json(result);
}
