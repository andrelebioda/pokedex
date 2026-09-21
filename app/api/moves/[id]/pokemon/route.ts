import { NextResponse } from "next/server";

import { getPokemonForMove } from "@/server/move/move.service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pokemon = await getPokemonForMove(Number(id));

  return NextResponse.json({ pokemon });
}
