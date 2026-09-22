import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PokemonDetail from "@/components/pokemon/PokemonDetail";
import { getSinglePokemon } from "@/server/pokemon/pokemon.service";

export const dynamic = "force-dynamic";

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PokemonDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const pokemon = await getSinglePokemon(Number(id));

  if (!pokemon) {
    return { title: "Pokémon nicht gefunden" };
  }

  const title = `${pokemon.name} (#${String(pokemon.id).padStart(3, "0")})`;
  const description =
    pokemon.description ?? `${pokemon.name}${pokemon.genus ? ` – ${pokemon.genus}` : ""} im PokéLab Pokédex mit Werten, Attacken und Fähigkeiten.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = await params;

  const pokemon = await getSinglePokemon(Number(id));

  if (!pokemon) {
    notFound();
  }

  return <PokemonDetail pokemon={pokemon} />;
}
