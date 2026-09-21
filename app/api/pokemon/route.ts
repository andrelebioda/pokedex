import { NextRequest, NextResponse } from "next/server";
import { getPokemonList } from "@/server/pokemon/pokemon.service";

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

  const { pokemon, hasMore } = await getPokemonList(page, limit, { search, types });

  return NextResponse.json({ pokemon, hasMore, page });
}
