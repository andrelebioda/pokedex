import { notFound } from "next/navigation";

import PokemonDetail from "@/components/pokemon/PokemonDetail";
import { getSinglePokemon } from "@/server/pokemon/pokemon.service";

export const dynamic = "force-dynamic";

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = await params;

  const pokemon = await getSinglePokemon(Number(id));

  if (!pokemon) {
    notFound();
  }

  return <PokemonDetail pokemon={pokemon} />;
}
