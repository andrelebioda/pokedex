// Next.js: Typ für die Seiten-<head>-Metadaten
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Ausgelagerter Props-Typ dieser Seite (nur die dynamische Route-ID)
import { PokemonDetailPageProps } from "@/app/pokemon/[id]/page.constants";
// Tabs (Stats/Attacken/Fähigkeiten), lädt Attacken bei Bedarf per Server Action nach
import PokemonDetail from "@/components/pokemon/PokemonDetail";
// Lädt das einzelne Pokémon sowie die erste Seite seiner Attacken serverseitig
import { getMovesForPokemon, getSinglePokemon } from "@/server/pokemon/pokemon.service";

export const dynamic = "force-dynamic";

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
    alternates: { canonical: `/pokemon/${pokemon.id}` },
    openGraph: { title, description },
  };
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = await params;

  const pokemon = await getSinglePokemon(Number(id));

  if (!pokemon) {
    notFound();
  }

  const { moves: initialMoves, hasMore: initialMovesHasMore } = await getMovesForPokemon(Number(id), 1, 30);

  return <PokemonDetail pokemon={pokemon} initialMoves={initialMoves} initialMovesHasMore={initialMovesHasMore} />;
}
