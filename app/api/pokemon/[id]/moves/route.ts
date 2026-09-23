import { NextRequest, NextResponse } from "next/server";

import { getMovesForPokemon } from "@/server/pokemon/pokemon.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 30));
  const search = searchParams.get("search")?.trim() || undefined;

  const { moves, hasMore } = await getMovesForPokemon(Number(id), page, limit, { search });

  return NextResponse.json({ moves, hasMore });
}
