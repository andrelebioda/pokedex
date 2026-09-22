import { NextResponse } from "next/server";

import { getMovesForPokemon } from "@/server/pokemon/pokemon.service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const moves = await getMovesForPokemon(Number(id));

  return NextResponse.json({ moves });
}
