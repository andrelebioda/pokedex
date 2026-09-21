import { NextResponse } from "next/server";

import { getPokemonForAbility } from "@/server/ability/ability.service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pokemon = await getPokemonForAbility(Number(id));

  return NextResponse.json({ pokemon });
}
