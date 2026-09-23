import { NextRequest, NextResponse } from "next/server";
import { getPokemonList, PokemonSort } from "@/server/pokemon/pokemon.service";

const VALID_SORTS: PokemonSort[] = ["number-asc", "number-desc", "name-asc", "name-desc", "type-asc", "type-desc"];

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
  const generations =
    searchParams
      .get("generations")
      ?.split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value > 0) || undefined;
  const sortParam = searchParams.get("sort");
  const sort = VALID_SORTS.includes(sortParam as PokemonSort) ? (sortParam as PokemonSort) : undefined;

  const { pokemon, hasMore } = await getPokemonList(page, limit, { search, types, generations, sort });

  return NextResponse.json({ pokemon, hasMore, page });
}
